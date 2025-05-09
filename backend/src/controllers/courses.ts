import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Course, { ICourse } from '../models/Course';
import User, { UserRole } from '../models/User';
import Enrollment from '../models/Enrollment';

/**
 * Get all courses (with filtering)
 */
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      instructor, 
      published = 'true',
      limit = 20, 
      page = 1 
    } = req.query;
    
    // Build the query
    const query: any = {};
    
    // Filter by published status
    if (published === 'true') {
      query.published = true;
    }
    
    // Filter by instructor
    if (instructor) {
      query.instructor = instructor;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find courses
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Count total courses for pagination
    const totalCourses = await Course.countDocuments(query);
    
    return res.status(200).json({
      courses,
      totalPages: Math.ceil(totalCourses / Number(limit)),
      currentPage: Number(page),
      totalCourses,
    });
  } catch (error) {
    console.error('Error getting courses:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single course by ID
 */
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find course
    const course = await Course.findById(id)
      .populate('instructor', 'firstName lastName email profilePicture');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // If course is not published, only the instructor or admin can view it
    if (!course.published) {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const isInstructor = course.instructor._id.toString() === authReq.user.id;
      const isAdmin = authReq.user.role === UserRole.ADMIN;
      
      if (!isInstructor && !isAdmin) {
        return res.status(403).json({ message: 'This course is not published yet' });
      }
    }
    
    return res.status(200).json(course);
  } catch (error) {
    console.error('Error getting course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new course
 */
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Only teachers and admins can create courses
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN)) {
      return res.status(403).json({ message: 'Only teachers and admins can create courses' });
    }
    
    const { title, description, thumbnail } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    // Create new course
    const course = new Course({
      title,
      description,
      thumbnail,
      instructor: req.user.id,
      modules: [],
      published: false,
    });
    
    await course.save();
    
    return res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a course
 */
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { title, description, thumbnail, published } = req.body;
    
    // Find course
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    
    // Update course
    if (title) course.title = title;
    if (description) course.description = description;
    if (thumbnail) course.thumbnail = thumbnail;
    if (published !== undefined) course.published = published;
    
    await course.save();
    
    return res.status(200).json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Find course
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own courses' });
    }
    
    // Delete course
    await Course.findByIdAndDelete(id);
    
    // Delete all enrollments for this course
    await Enrollment.deleteMany({ course: id });
    
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add a module to a course
 */
export const addModule = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { title, order } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Module title is required' });
    }
    
    // Find course
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    
    // Add module
    course.modules.push({
      title,
      lessons: [],
      order: order || course.modules.length,
    } as any);
    
    await course.save();
    
    return res.status(201).json(course);
  } catch (error) {
    console.error('Error adding module:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a module
 */
export const updateModule = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId, moduleId } = req.params;
    const { title, order } = req.body;
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    
    // Find module
    const moduleIndex = course.modules.findIndex(
      (module) => module._id.toString() === moduleId
    );
    
    if (moduleIndex === -1) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Update module
    if (title) course.modules[moduleIndex].title = title;
    if (order !== undefined) course.modules[moduleIndex].order = order;
    
    await course.save();
    
    return res.status(200).json(course);
  } catch (error) {
    console.error('Error updating module:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a module
 */
export const deleteModule = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId, moduleId } = req.params;
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    
    // Find module
    const moduleIndex = course.modules.findIndex(
      (module) => module._id.toString() === moduleId
    );
    
    if (moduleIndex === -1) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Remove module
    course.modules.splice(moduleIndex, 1);
    
    await course.save();
    
    return res.status(200).json(course);
  } catch (error) {
    console.error('Error deleting module:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add a lesson to a module
 */
export const addLesson = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId, moduleId } = req.params;
    const { title, content, type, order, duration } = req.body;
    
    if (!title || !content || !type) {
      return res.status(400).json({ message: 'Title, content, and type are required' });
    }
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    
    // Find module
    const moduleIndex = course.modules.findIndex(
      (module) => module._id.toString() === moduleId
    );
    
    if (moduleIndex === -1) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Add lesson
    course.modules[moduleIndex].lessons.push({
      title,
      content,
      type,
      order: order || course.modules[moduleIndex].lessons.length,
      duration,
    } as any);
    
    await course.save();
    
    return res.status(201).json(course);
  } catch (error) {
    console.error('Error adding lesson:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get courses by instructor
 */
export const getCoursesByInstructor = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { instructorId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    // Verify the instructor exists
    const instructor = await User.findById(instructorId);
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find courses
    const courses = await Course.find({ instructor: instructorId })
      .populate('instructor', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Count total courses for pagination
    const totalCourses = await Course.countDocuments({ instructor: instructorId });
    
    return res.status(200).json({
      courses,
      totalPages: Math.ceil(totalCourses / Number(limit)),
      currentPage: Number(page),
      totalCourses,
    });
  } catch (error) {
    console.error('Error getting instructor courses:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get my courses (as an instructor)
 */
export const getMyCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { limit = 20, page = 1 } = req.query;
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find courses
    const courses = await Course.find({ instructor: req.user.id })
      .populate('instructor', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Count total courses for pagination
    const totalCourses = await Course.countDocuments({ instructor: req.user.id });
    
    return res.status(200).json({
      courses,
      totalPages: Math.ceil(totalCourses / Number(limit)),
      currentPage: Number(page),
      totalCourses,
    });
  } catch (error) {
    console.error('Error getting my courses:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  getCoursesByInstructor,
  getMyCourses,
}; 