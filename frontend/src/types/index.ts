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
  role: UserRole;
  profilePicture?: string;
  clerkId: string;
  requires2FA: boolean;
  createdAt: string;
  updatedAt: string;
}

// Course-related types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: User;
  modules: Module[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
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

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  points: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
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
export enum LiveClassPlatform {
  ZOOM = 'zoom',
  GOOGLE_MEET = 'google_meet',
  MICROSOFT_TEAMS = 'microsoft_teams',
  OTHER = 'other',
}

export enum LiveClassStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  course: Course | string;
  instructor: User | string;
  startTime: string;
  endTime: string;
  platform: LiveClassPlatform;
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  status: LiveClassStatus;
  recordingUrl?: string;
  attendees: (User | string)[];
  createdAt: string;
  updatedAt: string;
}

// Notification types
export enum NotificationType {
  COURSE = 'course',
  ASSIGNMENT = 'assignment',
  ANNOUNCEMENT = 'announcement',
  LIVE_CLASS = 'live_class',
  SYSTEM = 'system',
  GRADE = 'grade',
}

export interface Notification {
  id: string;
  user: User | string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  resourceId?: string;
  createdAt: string;
  readAt?: string;
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
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  LATE = 'late',
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
export interface Submission {
  id: string;
  student: User | string;
  assessment: Assessment | string;
  answers: Answer[];
  fileUrl?: string;
  textContent?: string;
  linkUrl?: string;
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  gradedBy?: User | string;
  submittedAt?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Assessment interface
export interface Assessment {
  id: string;
  title: string;
  description: string;
  course: Course | string;
  type: AssessmentType;
  questions: Question[];
  dueDate?: string;
  timeLimit?: number; // in minutes, for quizzes
  passingScore: number;
  points: number;
  submissionType: SubmissionType;
  published: boolean;
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