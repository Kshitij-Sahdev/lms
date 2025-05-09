import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Assessment, { AssessmentType, IAssessment } from '../models/Assessment';
import Course from '../models/Course';
import User, { UserRole } from '../models/User';
import Submission, { SubmissionStatus } from '../models/Submission';
import Notification, { NotificationType } from '../models/Notification';

/**
 * Create a new assessment
 */
export const createAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, description, courseId, dueDate, type, questions } = req.body;

    // Validate required fields
    if (!title || !courseId || !type) {
      return res.status(400).json({ message: 'Title, course ID, and type are required' });
    }

    // Check if course exists and user is instructor
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor or admin
    if (course.instructor && course.instructor.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to add assessments to this course' });
    }

    // Create assessment
    const assessment = new Assessment({
      title,
      description,
      course: courseId,
      dueDate,
      type,
      questions,
      createdBy: req.user.id,
    });

    await assessment.save();

    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all assessments for a course
 */
export const getCourseAssessments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get assessments
    const assessments = await Assessment.find({ course: courseId })
      .sort({ dueDate: 1 })
      .populate('createdBy', 'firstName lastName email');

    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get assessment by ID
 */
export const getAssessmentById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const assessment = await Assessment.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('course', 'title');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update assessment
 */
export const updateAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, description, dueDate, questions } = req.body;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if user is creator or admin
    if (assessment.createdBy && assessment.createdBy.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to update this assessment' });
    }

    // Update fields
    if (title) assessment.title = title;
    if (description) assessment.description = description;
    if (dueDate) assessment.dueDate = dueDate;
    if (questions) assessment.questions = questions;

    await assessment.save();

    res.json(assessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete assessment
 */
export const deleteAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if user is creator or admin
    if (assessment.createdBy && assessment.createdBy.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to delete this assessment' });
    }

    await Assessment.findByIdAndDelete(id);

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Submit an assessment
 */
export const submitAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { answers } = req.body;
    
    // Find assessment
    const assessment = await Assessment.findById(id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Check if due date has passed
    let isLate = false;
    if (assessment.dueDate && new Date() > new Date(assessment.dueDate)) {
      isLate = true;
    }
    
    // Find existing submission
    let submission = await Submission.findOne({
      student: req.user.id,
      assessment: id,
    });
    
    let isNewSubmission = false;
    
    if (!submission) {
      // Create new submission
      submission = new Submission({
        student: req.user.id,
        assessment: id,
        answers: [],
        status: SubmissionStatus.PENDING,
      });
      
      isNewSubmission = true;
    }
    
    // Update submission
    if (answers) submission.answers = answers;
    
    // Update status
    submission.status = isLate ? SubmissionStatus.RESUBMITTED : SubmissionStatus.PENDING;
    submission.submittedAt = new Date();
    
    // Auto-grade quiz if possible
    if (assessment.type === AssessmentType.QUIZ && assessment.questions && assessment.questions.length > 0) {
      let score = 0;
      let totalPoints = 0;
      
      // Simple auto-grading implementation
      // In a real app, this would be more sophisticated
      
      await submission.save();
      
      return res.status(200).json(submission);
    }
    
    await submission.save();
    
    // Create notification for instructor if this is a new submission
    if (isNewSubmission) {
      // Find course
      const course = await Course.findById(assessment.course);
      
      if (course) {
        const notification = new Notification({
          user: course.instructor,
          title: 'New Submission',
          message: `A student has submitted ${assessment.type === AssessmentType.QUIZ ? 'a quiz' : 'an assignment'}: ${assessment.title}`,
          type: NotificationType.ASSESSMENT,
          resourceId: assessment._id ? assessment._id.toString() : '',
        });
        
        await notification.save();
      }
    }
    
    return res.status(200).json(submission);
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get submission for an assessment
 */
export const getSubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Find submission
    const submission = await Submission.findOne({
      student: req.user.id,
      assessment: id,
    });
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    return res.status(200).json(submission);
  } catch (error) {
    console.error('Error getting submission:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Grade a submission (for instructors)
 */
export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { submissionId } = req.params;
    const { score, feedback } = req.body;
    
    if (score === undefined) {
      return res.status(400).json({ message: 'Score is required' });
    }
    
    // Find submission
    const submission = await Submission.findById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Find assessment
    const assessment = await Assessment.findById(submission.assessment);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Find course
    const course = await Course.findById(assessment.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify user is the instructor or an admin
    if (course.instructor && course.instructor.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to grade this submission' });
    }
    
    // Update submission
    submission.score = score;
    if (feedback) submission.feedback = feedback;
    submission.status = SubmissionStatus.GRADED;
    submission.gradedBy = req.user.id;
    submission.gradedAt = new Date();
    
    await submission.save();
    
    // Create notification for student
    const notification = new Notification({
      user: submission.student,
      title: 'Assessment Graded',
      message: `Your ${assessment.type === AssessmentType.QUIZ ? 'quiz' : 'assignment'} "${assessment.title}" has been graded`,
      type: NotificationType.GRADE,
      resourceId: assessment._id ? assessment._id.toString() : '',
    });
    
    await notification.save();
    
    return res.status(200).json(submission);
  } catch (error) {
    console.error('Error grading submission:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all submissions for an assessment (for instructors)
 */
export const getAssessmentSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { status } = req.query;
    
    // Find assessment
    const assessment = await Assessment.findById(id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Find course
    const course = await Course.findById(assessment.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify user is the instructor or an admin
    if (course.instructor && course.instructor.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to view submissions for this assessment' });
    }
    
    // Build query
    const query: any = { assessment: id };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Find submissions
    const submissions = await Submission.find(query)
      .populate('student', 'firstName lastName email profilePicture')
      .sort({ submittedAt: -1 });
    
    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Error getting submissions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createAssessment,
  getCourseAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
  getSubmission,
  gradeSubmission,
  getAssessmentSubmissions,
}; 