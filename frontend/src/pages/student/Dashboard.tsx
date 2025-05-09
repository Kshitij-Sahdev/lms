import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
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

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>(sampleLiveClasses);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  
  // Placeholder for API calls
  useEffect(() => {
    // In a real app, you would fetch data from your API
    // api.get('/courses/enrolled').then(data => setCourses(data));
    // api.get('/live-classes/upcoming').then(data => setUpcomingClasses(data));
    // api.get('/notifications').then(data => setNotifications(data));
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.firstName || 'Student'}!</h1>
        <p className="text-gray-300 mt-2">Continue your learning journey</p>
      </div>
      
      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrolled courses section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">My Courses</h2>
            <Link to="/courses" className="text-primary hover:text-primary-light text-sm">
              View All
            </Link>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  isEnrolled={true}
                  progress={Math.floor(Math.random() * 100)} // Random progress for demo
                />
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center">
              <p className="text-gray-400 mb-4">You are not enrolled in any courses yet.</p>
              <Link to="/courses/browse" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          )}
        </div>
        
        {/* Sidebar sections */}
        <div className="space-y-6">
          {/* Upcoming live classes */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">Upcoming Live Classes</h2>
            
            {upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {upcomingClasses.map((liveClass) => (
                  <div key={liveClass.id} className="border-b border-background-elevated pb-3 last:border-b-0 last:pb-0">
                    <h3 className="font-medium text-white">{liveClass.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{liveClass.description}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      {formatDate(liveClass.startTime)}
                    </p>
                    <a 
                      href={liveClass.meetingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-light text-sm inline-block mt-1"
                    >
                      Join Meeting
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No upcoming live classes.</p>
            )}
            
            <div className="mt-4 pt-3 border-t border-background-elevated">
              <Link to="/calendar" className="text-primary hover:text-primary-light text-sm">
                View Full Schedule
              </Link>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
            
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-2 rounded-md ${notification.read ? 'bg-transparent' : 'bg-background-elevated'}`}
                  >
                    <h3 className="font-medium text-white text-sm">{notification.title}</h3>
                    <p className="text-xs text-gray-400 mb-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toRelativeTime()}
                      </span>
                      {notification.link && (
                        <Link to={notification.link} className="text-primary hover:text-primary-light text-xs">
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No new notifications.</p>
            )}
            
            <div className="mt-4 pt-3 border-t border-background-elevated">
              <Link to="/notifications" className="text-primary hover:text-primary-light text-sm">
                View All Notifications
              </Link>
            </div>
          </div>
        </div>
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