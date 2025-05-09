import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Course, LiveClass } from '@/types';
import { getMyTeachingCourses, getCourseStats } from '@/utils/courseService';
import { getUpcomingLiveClasses } from '@/utils/liveClassService';

// Stats card component
const StatsCard: React.FC<{ title: string; value: number; icon: string }> = ({ 
  title, 
  value, 
  icon 
}) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl text-primary">{icon}</div>
      </div>
    </div>
  );
};

// Course item component
const CourseItem: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="card p-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-white">{course.title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{course.description}</p>
        <div className="flex items-center mt-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            course.published ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
          }`}>
            {course.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Link 
          to={`/teacher/courses/${course.id}`}
          className="btn btn-outline py-1 px-3 text-sm"
        >
          Manage
        </Link>
      </div>
    </div>
  );
};

// Live class item
const LiveClassItem: React.FC<{ liveClass: LiveClass }> = ({ liveClass }) => {
  // Format date
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
    <div className="card p-4">
      <h3 className="font-medium text-white">{liveClass.title}</h3>
      <p className="text-xs text-primary mt-1">{formatDate(liveClass.startTime)}</p>
      <p className="text-sm text-gray-400 mt-2 line-clamp-2">{liveClass.description}</p>
      <div className="flex justify-between items-center mt-3">
        <Link 
          to={`/teacher/live-classes/${liveClass.id}`}
          className="text-primary hover:text-primary-light text-sm"
        >
          View Details
        </Link>
        <a 
          href={liveClass.meetingUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary py-1 px-3 text-sm"
        >
          Join
        </a>
      </div>
    </div>
  );
};

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalLiveClasses: 0,
    totalAssessments: 0,
  });
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch teacher's courses
        const courseData = await getMyTeachingCourses();
        setCourses(courseData.courses || []);
        
        // Fetch course stats
        if (courseData.courses && courseData.courses.length > 0) {
          const courseIds = courseData.courses.map(course => course.id);
          const statsData = await getCourseStats(courseIds);
          setStats(statsData);
        }
        
        // Fetch upcoming live classes
        const liveClassData = await getUpcomingLiveClasses();
        setLiveClasses(liveClassData || []);
      } catch (err) {
        console.error('Failed to fetch teacher dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
        <Link to="/teacher/courses/new" className="btn btn-primary">
          Create Course
        </Link>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Courses" value={stats.totalCourses} icon="📚" />
        <StatsCard title="Total Students" value={stats.totalStudents} icon="👨‍🎓" />
        <StatsCard title="Live Classes" value={stats.totalLiveClasses} icon="🎥" />
        <StatsCard title="Assessments" value={stats.totalAssessments} icon="📝" />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">My Courses</h2>
            <Link to="/teacher/courses" className="text-primary hover:text-primary-light text-sm">
              View All
            </Link>
          </div>
          
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => (
                <CourseItem key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center">
              <p className="text-gray-400 mb-4">You haven't created any courses yet.</p>
              <Link to="/teacher/courses/new" className="btn btn-primary">
                Create Your First Course
              </Link>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Upcoming live classes */}
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4 p-4 pb-0">
              <h2 className="text-xl font-semibold text-white">Upcoming Sessions</h2>
              <Link to="/teacher/live-classes" className="text-primary hover:text-primary-light text-sm">
                View All
              </Link>
            </div>
            
            {liveClasses.length > 0 ? (
              <div className="space-y-4 p-4 pt-0">
                {liveClasses.slice(0, 3).map((liveClass) => (
                  <LiveClassItem key={liveClass.id} liveClass={liveClass} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-400 mb-4">No upcoming live classes.</p>
                <Link to="/teacher/live-classes/new" className="btn btn-outline">
                  Schedule a Class
                </Link>
              </div>
            )}
          </div>
          
          {/* Quick actions */}
          <div className="card-glass p-4">
            <h3 className="font-medium text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/teacher/courses/new" className="flex items-center p-2 hover:bg-background-elevated rounded-md transition-colors">
                <span className="mr-2">📚</span>
                <span>Create a new course</span>
              </Link>
              <Link to="/teacher/live-classes/new" className="flex items-center p-2 hover:bg-background-elevated rounded-md transition-colors">
                <span className="mr-2">🎥</span>
                <span>Schedule a live class</span>
              </Link>
              <Link to="/teacher/assessments/new" className="flex items-center p-2 hover:bg-background-elevated rounded-md transition-colors">
                <span className="mr-2">📝</span>
                <span>Create an assessment</span>
              </Link>
              <Link to="/teacher/analytics" className="flex items-center p-2 hover:bg-background-elevated rounded-md transition-colors">
                <span className="mr-2">📊</span>
                <span>View analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 