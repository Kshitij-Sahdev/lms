import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageLiveClasses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [liveClasses, setLiveClasses] = useState([]);
  
  useEffect(() => {
    // Mock loading delay and data
    const timer = setTimeout(() => {
      setLiveClasses([
        {
          id: '1',
          title: 'CSS Layouts and Flexbox',
          course: 'Web Development Fundamentals',
          startTime: '2023-10-15T14:00:00.000Z',
          endTime: '2023-10-15T15:30:00.000Z',
          meetingLink: 'https://meet.example.com/class1',
          participants: 12,
          status: 'upcoming',
        },
        {
          id: '2',
          title: 'JavaScript Event Handling',
          course: 'Web Development Fundamentals',
          startTime: '2023-10-20T14:00:00.000Z',
          endTime: '2023-10-20T15:30:00.000Z',
          meetingLink: 'https://meet.example.com/class2',
          participants: 8,
          status: 'upcoming',
        },
        {
          id: '3',
          title: 'Introduction to React Hooks',
          course: 'React Framework Masterclass',
          startTime: '2023-10-05T14:00:00.000Z',
          endTime: '2023-10-05T15:30:00.000Z',
          meetingLink: 'https://meet.example.com/class3',
          participants: 15,
          status: 'completed',
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
  
  // Helper function to format date
  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Live Classes</h1>
        <Link 
          to="/teacher/live-classes/schedule" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          Schedule New Class
        </Link>
      </div>
      
      {/* Filters/Search */}
      <div className="bg-surface p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search classes..."
            className="w-full p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
          />
        </div>
        <select className="p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary">
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary">
          <option value="all">All Courses</option>
          <option value="web-dev">Web Development</option>
          <option value="react">React Framework</option>
        </select>
      </div>
      
      {/* Live Classes List */}
      {liveClasses.length === 0 ? (
        <div className="text-center p-8 bg-surface rounded-lg">
          <h2 className="text-xl mb-3">No live classes found</h2>
          <p className="text-text-secondary mb-6">Schedule your first live class to get started</p>
          <Link 
            to="/teacher/live-classes/schedule" 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Schedule Class
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {liveClasses.map((liveClass: any) => (
            <div key={liveClass.id} className="bg-surface p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">{liveClass.title}</h2>
                    <span 
                      className={`ml-3 px-2 py-1 rounded text-xs ${
                        liveClass.status === 'upcoming' 
                          ? 'bg-primary/20 text-primary' 
                          : liveClass.status === 'completed'
                            ? 'bg-success/20 text-success'
                            : 'bg-error/20 text-error'
                      }`}
                    >
                      {liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">
                    Course: {liveClass.course}
                  </p>
                </div>
                <div className="flex gap-2">
                  {liveClass.status === 'upcoming' && (
                    <>
                      <Link 
                        to={`/teacher/live-classes/${liveClass.id}`}
                        className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <a 
                        href={liveClass.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-success hover:bg-success/80 text-white px-4 py-2 rounded transition-colors"
                      >
                        Start Class
                      </a>
                    </>
                  )}
                  {liveClass.status === 'completed' && (
                    <Link 
                      to={`/teacher/live-classes/${liveClass.id}/recordings`}
                      className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded transition-colors"
                    >
                      View Recording
                    </Link>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-light flex flex-col sm:flex-row justify-between">
                <div>
                  <span className="text-text-secondary">Time: </span>
                  <span>{formatDateTime(liveClass.startTime)}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Duration: </span>
                  <span>
                    {Math.round((new Date(liveClass.endTime).getTime() - new Date(liveClass.startTime).getTime()) / (1000 * 60))} minutes
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Participants: </span>
                  <span>{liveClass.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageLiveClasses; 