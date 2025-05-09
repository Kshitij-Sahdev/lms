import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Assessment, { AssessmentType, IAssessment } from '../models/Assessment';
import Course from '../models/Course';
import User, { UserRole } from '../models/User';
import Submission, { SubmissionStatus } from '../models/Submission';
import Notification, { NotificationType } from '../models/Notification';

/**
 * Create an assessment
 */
export const createAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const {
      title,
      description,
      courseId,
      type,
      questions,
      dueDate,
      timeLimit,
      passingScore,
      points,
      submissionType,
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !courseId || !type) {
      return res.status(400).json({ message: 'Title, description, courseId, and type are required' });
    }
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to create assessments for this course' });
    }
    
    // Create assessment
    const assessment = new Assessment({
      title,
      description,
      course: courseId,
      type,
      questions: questions || [],
      dueDate,
      timeLimit,
      passingScore: passingScore || 60,
      points: points || 100,
      submissionType,
      published: false,
    });
    
    await assessment.save();
    
    return res.status(201).json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all assessments for a course
 */
export const getCourseAssessments = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { type } = req.query;
    
    // Build query
    const query: any = { course: courseId };
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }
    
    // Find assessments
    const assessments = await Assessment.find(query)
      .sort({ createdAt: -1 });
    
    return res.status(200).json(assessments);
  } catch (error) {
    console.error('Error getting assessments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single assessment
 */
export const getAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find assessment
    const assessment = await Assessment.findById(id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    return res.status(200).json(assessment);
  } catch (error) {
    console.error('Error getting assessment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update an assessment
 */
export const updateAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const {
      title,
      description,
      questions,
      dueDate,
      timeLimit,
      passingScore,
      points,
      submissionType,
      published,
    } = req.body;
    
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
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this assessment' });
    }
    
    // Update assessment
    if (title) assessment.title = title;
    if (description) assessment.description = description;
    if (questions) assessment.questions = questions;
    if (dueDate) assessment.dueDate = new Date(dueDate);
    if (timeLimit !== undefined) assessment.timeLimit = timeLimit;
    if (passingScore !== undefined) assessment.passingScore = passingScore;
    if (points !== undefined) assessment.points = points;
    if (submissionType) assessment.submissionType = submissionType;
    if (published !== undefined) {
      // If publishing for the first time, notify enrolled students
      if (published && !assessment.published) {
        // Get enrolled students
        const submissions = await Submission.find({ assessment: id });
        const enrolledStudents = await User.find({
          _id: { $nin: submissions.map(sub => sub.student) }
        });
        
        // Create notification for each student
        const notificationPromises = enrolledStudents.map(student => {
          const notification = new Notification({
            user: student._id,
            title: `New ${assessment.type === AssessmentType.QUIZ ? 'Quiz' : 'Assignment'} Available`,
            message: `A new ${assessment.type === AssessmentType.QUIZ ? 'quiz' : 'assignment'} has been published in ${course.title}: ${assessment.title}`,
            type: NotificationType.ASSIGNMENT,
            resourceId: id,
            link: `/courses/${course._id}/assessments/${id}`,
          });
          
          return notification.save();
        });
        
        await Promise.all(notificationPromises);
      }
      
      assessment.published = published;
    }
    
    await assessment.save();
    
    return res.status(200).json(assessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete an assessment
 */
export const deleteAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
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
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this assessment' });
    }
    
    // Delete assessment
    await Assessment.findByIdAndDelete(id);
    
    // Delete submissions
    await Submission.deleteMany({ assessment: id });
    
    return res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return res.status(500).json({ message: 'Server error' });
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
    const { answers, fileUrl, textContent, linkUrl } = req.body;
    
    // Find assessment
    const assessment = await Assessment.findById(id);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Check if assessment is published
    if (!assessment.published) {
      return res.status(400).json({ message: 'Cannot submit to an unpublished assessment' });
    }
    
    // Check if due date has passed
    if (assessment.dueDate && new Date() > new Date(assessment.dueDate)) {
      // Allow submission but mark as late
      const status = SubmissionStatus.LATE;
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
        status: SubmissionStatus.DRAFT,
      });
      
      isNewSubmission = true;
    }
    
    // Update submission
    if (answers) submission.answers = answers;
    if (fileUrl) submission.fileUrl = fileUrl;
    if (textContent) submission.textContent = textContent;
    if (linkUrl) submission.linkUrl = linkUrl;
    
    // Check if late
    const isLate = assessment.dueDate && new Date() > new Date(assessment.dueDate);
    
    // Update status
    submission.status = isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED;
    submission.submittedAt = new Date();
    
    // Auto-grade quiz if possible
    if (assessment.type === AssessmentType.QUIZ) {
      let score = 0;
      let totalPoints = 0;
      
      // Calculate score
      assessment.questions.forEach(question => {
        const answer = submission.answers.find(a => a.questionId === question._id.toString());
        
        if (answer) {
          const correctOptions = question.options
            .filter(option => option.isCorrect)
            .map(option => option._id.toString());
            
          // Check if answer is correct
          if (answer.selectedOptions && answer.selectedOptions.length > 0) {
            // For single choice, check if the selected option is correct
            if (question.type === 'single_choice') {
              const isCorrect = correctOptions.includes(answer.selectedOptions[0]);
              answer.isCorrect = isCorrect;
              answer.pointsEarned = isCorrect ? question.points : 0;
            } 
            // For multiple choice, check if all selected options are correct and no incorrect ones
            else if (question.type === 'multiple_choice') {
              const allCorrect = answer.selectedOptions.every(option => correctOptions.includes(option));
              const allSelected = correctOptions.length === answer.selectedOptions.length;
              answer.isCorrect = allCorrect && allSelected;
              answer.pointsEarned = (allCorrect && allSelected) ? question.points : 0;
            }
          }
          
          score += answer.pointsEarned || 0;
        }
        
        totalPoints += question.points;
      });
      
      // Calculate final score as percentage
      const scorePercentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
      
      submission.score = Math.round(scorePercentage);
      submission.status = SubmissionStatus.GRADED;
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
          type: NotificationType.ASSIGNMENT,
          resourceId: id,
          link: `/teacher/courses/${course._id}/assessments/${id}/submissions`,
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
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
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
      title: 'Assignment Graded',
      message: `Your ${assessment.type === AssessmentType.QUIZ ? 'quiz' : 'assignment'} "${assessment.title}" has been graded`,
      type: NotificationType.GRADE,
      resourceId: assessment._id.toString(),
      link: `/courses/${course._id}/assessments/${assessment._id}/submission`,
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
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
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
  getAssessment,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
  getSubmission,
  gradeSubmission,
  getAssessmentSubmissions,
}; 