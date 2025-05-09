import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-surface-light rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-surface-light rounded w-full mb-8"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="h-96 bg-surface-light rounded mb-4"></div>
            <div className="h-4 bg-surface-light rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-light rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-light rounded w-3/4"></div>
          </div>
          <div>
            <div className="h-64 bg-surface-light rounded mb-4"></div>
            <div className="h-4 bg-surface-light rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-light rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Course Details</h1>
      <p className="text-text-secondary mb-6">This is a placeholder for the Course Details page. Course ID: {courseId}</p>
      
      <div className="bg-surface p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Development in Progress</h2>
        <p className="mb-4">
          This page will show detailed information about a specific course, including:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Course title, description, and instructor information</li>
          <li>Course modules and lessons</li>
          <li>Progress tracking</li>
          <li>Related assessments and assignments</li>
          <li>Discussion forums and resources</li>
        </ul>
        <Link to="/student/courses" className="text-primary hover:text-primary-dark">
          ← Back to My Courses
        </Link>
      </div>
    </div>
  );
};

export default CourseDetails; 