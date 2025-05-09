import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Course, LiveClass, Notification } from '@/types';
import CourseCard from '@/components/CourseCard';

// Placeholder data (to be replaced with API calls)
const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    instructor: {
      id: '101',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'teacher',
      createdAt: new Date().toISOString(),
    },
    modules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Master React hooks, context API, and build production-grade applications.',
    instructor: {
      id: '102',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'teacher',
      createdAt: new Date().toISOString(),
    },
    modules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleLiveClasses: LiveClass[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals Q&A',
    description: 'Live session to answer questions about JS basics',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour duration
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    course: '1',
  },
  {
    id: '2',
    title: 'React State Management Workshop',
    description: 'Hands-on workshop about React state management techniques',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 1.5 hour duration
    meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
    course: '2',
  },
];

const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Assignment Available',
    message: 'A new assignment has been added to Introduction to Web Development.',
    type: 'assignment',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    link: '/courses/1/assignments/3',
  },
  {
    id: '2',
    title: 'Upcoming Live Class',
    message: 'Don\'t forget your scheduled JavaScript Fundamentals Q&A session.',
    type: 'live_class',
    read: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    link: '/calendar',
  },
];

const StudentDashboard = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>(sampleLiveClasses);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, these would be actual API calls
        // Mock data for demonstration
        setCourses([
          { _id: '1', title: 'Introduction to Programming', instructor: 'Jane Doe', progress: 25 },
          { _id: '2', title: 'Web Development Fundamentals', instructor: 'John Smith', progress: 50 },
          { _id: '3', title: 'Data Structures and Algorithms', instructor: 'Alice Johnson', progress: 10 },
        ]);
        
        setUpcomingAssessments([
          { _id: '1', title: 'Programming Quiz', dueDate: '2023-10-15', course: 'Introduction to Programming' },
          { _id: '2', title: 'Web Project', dueDate: '2023-10-20', course: 'Web Development Fundamentals' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-light rounded w-1/4"></div>
          <div className="h-32 bg-surface-light rounded w-full"></div>
          <div className="h-8 bg-surface-light rounded w-1/4"></div>
          <div className="h-32 bg-surface-light rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Stats overview */}
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-light p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">{courses.length}</p>
              <p className="text-text-secondary">Enrolled Courses</p>
            </div>
            <div className="bg-surface-light p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">{upcomingAssessments.length}</p>
              <p className="text-text-secondary">Upcoming Assessments</p>
            </div>
          </div>
        </div>
        
        {/* Calendar/upcoming */}
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          {upcomingAssessments.length > 0 ? (
            <ul className="space-y-3">
              {upcomingAssessments.map((assessment: any) => (
                <li key={assessment._id} className="flex justify-between items-center p-3 bg-surface-light rounded">
                  <div>
                    <p className="font-medium">{assessment.title}</p>
                    <p className="text-sm text-text-secondary">{assessment.course}</p>
                  </div>
                  <p className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">
                    Due: {new Date(assessment.dueDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary">No upcoming deadlines</p>
          )}
        </div>
      </div>
      
      {/* My courses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Courses</h2>
          <Link to="/student/courses" className="text-primary hover:text-primary-dark">
            View All
          </Link>
        </div>
        
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course: any) => (
              <Link key={course._id} to={`/student/courses/${course._id}`} className="block">
                <div className="bg-surface rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                  <div className="h-40 bg-surface-light"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Instructor: {course.instructor}
                    </p>
                    <div className="relative h-2 bg-surface-light rounded overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{course.progress}% complete</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">You are not enrolled in any courses yet</p>
        )}
      </div>
    </div>
  );
};

// Add toRelativeTime method to Date prototype for time ago display
declare global {
  interface Date {
    toRelativeTime(): string;
  }
}

Date.prototype.toRelativeTime = function() {
  const now = new Date();
  const diffMs = now.getTime() - this.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (diffSec < 60) return `${diffSec} sec ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  return this.toLocaleDateString();
};

export default StudentDashboard; 