import express from 'express';
import { Request, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import Course from '../models/Course';
import { UserRole } from '../models/User';

const router = express.Router();

// Get all courses (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { published } = req.query;
    const query: any = {};
    
    // Filter by published status if provided
    if (published !== undefined) {
      query.published = published === 'true';
    }
    
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email profilePicture');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course (teachers and admins only)
router.post('/', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { title, description, thumbnail } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const course = new Course({
      title,
      description,
      thumbnail,
      instructor: req.user.id,
      modules: [],
      published: false,
    });
    
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course (owner or admin only)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { title, description, thumbnail, published } = req.body;
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the course instructor or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (thumbnail) course.thumbnail = thumbnail;
    if (published !== undefined) course.published = published;
    
    await course.save();
    
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course (owner or admin only)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the course instructor or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses by instructor
router.get('/instructor/:instructorId', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ instructor: req.params.instructorId })
      .populate('instructor', 'firstName lastName email profilePicture');
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 