import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const CoursesList = () => {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // For demonstration purposes using static data
        // In a real app, you would fetch from your API
        // const token = await getToken();
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/enrolled`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();
        
        // Mock data
        const mockCourses = [
          {
            _id: '1',
            title: 'Introduction to Programming',
            description: 'Learn the basics of programming with JavaScript',
            instructor: 'Jane Doe',
            progress: 25,
            thumbnail: '',
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            title: 'Web Development Fundamentals',
            description: 'Learn HTML, CSS and JavaScript for building modern websites',
            instructor: 'John Smith',
            progress: 50,
            thumbnail: '',
            updatedAt: new Date().toISOString()
          },
          {
            _id: '3',
            title: 'Data Structures and Algorithms',
            description: 'Master the core computer science concepts',
            instructor: 'Alice Johnson',
            progress: 10,
            thumbnail: '',
            updatedAt: new Date().toISOString()
          },
          {
            _id: '4',
            title: 'React Framework Deep Dive',
            description: 'Become proficient with React and its ecosystem',
            instructor: 'Bob Martin',
            progress: 75,
            thumbnail: '',
            updatedAt: new Date().toISOString()
          }
        ];
        
        setCourses(mockCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [getToken]);

  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">My Courses</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface p-4 rounded-lg flex">
              <div className="w-40 h-24 bg-surface-light rounded mr-4"></div>
              <div className="flex-1">
                <div className="h-6 bg-surface-light rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-light rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-surface-light rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">My Courses</h1>
        <div className="bg-error/20 text-error p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      
      {courses.length === 0 ? (
        <div className="text-center p-8 bg-surface rounded-lg">
          <h2 className="text-xl mb-3">You are not enrolled in any courses yet</h2>
          <p className="text-text-secondary mb-6">Browse available courses and start your learning journey</p>
          <Link to="/student/courses/browse" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course: any) => (
            <div key={course._id} className="bg-surface rounded-lg overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-48 h-40 md:h-full bg-surface-light flex-shrink-0">
                {course.thumbnail && (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6 flex-1">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-text-secondary mb-3">
                  Instructor: {course.instructor}
                </p>
                <p className="mb-4">{course.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="w-full sm:w-2/3">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden mr-3">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-text-secondary whitespace-nowrap">
                        {course.progress}% complete
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/student/courses/${course._id}`}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors text-center"
                  >
                    Continue Learning
                  </Link>
                </div>
                
                <p className="text-xs text-text-secondary mt-4">
                  Last updated: {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesList; 