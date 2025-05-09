import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    // Mock loading delay and data
    const timer = setTimeout(() => {
      setCourses([
        {
          id: '1',
          title: 'Web Development Fundamentals',
          status: 'published',
          students: 24,
          lastUpdated: '2023-09-30T14:48:00.000Z',
        },
        {
          id: '2',
          title: 'JavaScript Deep Dive',
          status: 'published',
          students: 18,
          lastUpdated: '2023-09-28T09:30:00.000Z',
        },
        {
          id: '3',
          title: 'React Framework Masterclass',
          status: 'draft',
          students: 0,
          lastUpdated: '2023-10-05T11:20:00.000Z',
        }
      ]);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between">
          <div className="h-8 bg-surface-light rounded w-1/4"></div>
          <div className="h-10 bg-surface-light rounded w-32"></div>
        </div>
        <div className="h-12 bg-surface-light rounded w-full mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface p-4 rounded-lg flex items-center">
            <div className="flex-1">
              <div className="h-6 bg-surface-light rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-surface-light rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-surface-light rounded w-24 mr-2"></div>
            <div className="h-8 bg-surface-light rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Link 
          to="/teacher/courses/create" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create New Course
        </Link>
      </div>
      
      {/* Filters/Search */}
      <div className="bg-surface p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search courses..."
            className="w-full p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
          />
        </div>
        <select className="p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select className="p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      
      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center p-8 bg-surface rounded-lg">
          <h2 className="text-xl mb-3">No courses found</h2>
          <p className="text-text-secondary mb-6">Create your first course to get started</p>
          <Link 
            to="/teacher/courses/create" 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course: any) => (
            <div key={course.id} className="bg-surface p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <div className="flex items-center gap-8 mt-2">
                  <div className="flex items-center">
                    <span className="text-text-secondary mr-2">Status:</span>
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        course.status === 'published' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-text-secondary mr-2">Students:</span>
                    <span>{course.students}</span>
                  </div>
                  <div className="hidden md:block text-text-secondary text-sm">
                    Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link 
                  to={`/teacher/courses/${course.id}`}
                  className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded transition-colors"
                >
                  Edit
                </Link>
                {course.status === 'draft' ? (
                  <button className="bg-success hover:bg-success/80 text-white px-4 py-2 rounded transition-colors">
                    Publish
                  </button>
                ) : (
                  <button className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded transition-colors">
                    Unpublish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses; 