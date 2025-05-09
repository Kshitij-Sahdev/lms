// User-related types
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
  requires2FA: boolean;
}

// Course-related types
export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: string | User;
  modules: Module[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  type: LessonType;
  duration?: number;
  order: number;
}

export enum LessonType {
  VIDEO = 'video',
  PDF = 'pdf',
  LINK = 'link',
  TEXT = 'text',
}

export interface LessonContent {
  type: LessonType;
  url?: string;
  text?: string;
}

// Assessment-related types
export enum AssessmentType {
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  FILE_UPLOAD = 'file_upload',
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  points: number;
  correctAnswer?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  submissionType: SubmissionType;
}

export enum SubmissionType {
  FILE = 'file',
  TEXT = 'text',
  LINK = 'link',
  AUTOGRADED = 'autograded',
}

// Live class types
export interface LiveClass {
  _id: string;
  title: string;
  description?: string;
  course: string | Course;
  instructor: string | User;
  startTime: string;
  endTime: string;
  meetingLink: string;
  isRecurring: boolean;
  recursOn?: string[];
  maxParticipants?: number;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export enum NotificationType {
  COURSE = 'course',
  ASSESSMENT = 'assessment',
  LIVE_CLASS = 'live_class',
  GRADE = 'grade',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Notification {
  _id: string;
  user: string | User;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  link?: string;
  isRead: boolean;
  resourceId?: string;
  createdAt: string;
  updatedAt: string;
}

// Progress tracking
export interface StudentProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // Array of lesson IDs
  completedAssignments: string[]; // Array of assignment IDs
  quizResults: QuizResult[];
  overallProgress: number; // Percentage
}

export interface QuizResult {
  quizId: string;
  score: number;
  completed: boolean;
  submittedAt: string;
}

// 2FA types
export interface TwoFactorAuthCode {
  email: string;
  code: string;
  expiresAt: string;
  used: boolean;
}

// Enrollment progress
export interface EnrollmentProgress {
  moduleId: string;
  completedLessons: string[]; // Lesson IDs
  progress: number; // Percentage
}

// Enrollment interface
export interface Enrollment {
  id: string;
  student: User;
  course: Course;
  completedLessons: string[]; // Lesson IDs
  progress: EnrollmentProgress[];
  overallProgress: number; // Percentage
  isCompleted: boolean;
  lastAccessed?: string;
  enrolledAt: string;
  completedAt?: string;
}

// Submission status enum
export enum SubmissionStatus {
  PENDING = 'pending',
  GRADED = 'graded',
  RESUBMITTED = 'resubmitted',
}

// Answer to a question
export interface Answer {
  questionId: string;
  selectedOptions?: string[]; // For multiple choice
  textAnswer?: string; // For text/short answer
  isCorrect?: boolean;
  pointsEarned?: number;
}

// Submission interface
export interface SubmissionAnswer {
  questionId: string;
  answer: string;
  points?: number;
  feedback?: string;
}

export interface Submission {
  _id: string;
  student: string | User;
  assessment: string | Assessment;
  answers: SubmissionAnswer[];
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  gradedBy?: string | User;
}

// Assessment interface
export interface Assessment {
  _id: string;
  title: string;
  description?: string;
  course: string | Course;
  type: AssessmentType;
  questions: Question[];
  dueDate?: string;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  requires2FA: boolean;
  is2FAVerified: boolean;
}

// API response interfaces
export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface UserStats {
  userStats: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    newUsers: number;
  };
  courseStats: {
    totalCourses: number;
    totalPublishedCourses: number;
  };
  enrollmentStats: {
    totalEnrollments: number;
    newEnrollments: number;
  };
} 