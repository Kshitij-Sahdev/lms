import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const AssessmentView = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface p-6 rounded-lg">
              <div className="h-6 bg-surface-light rounded w-3/4 mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-surface-light rounded w-full"></div>
                <div className="h-4 bg-surface-light rounded w-full"></div>
              </div>
              <div className="h-10 bg-surface-light rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Assessment View</h1>
      <p className="text-text-secondary mb-6">This is a placeholder for the Assessment View page. Assessment ID: {assessmentId}</p>
      
      <div className="bg-surface p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Development in Progress</h2>
        <p className="mb-4">
          This page will display assessment/quiz details and allow students to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>View assessment instructions and requirements</li>
          <li>Complete multiple-choice quizzes</li>
          <li>Submit assignments</li>
          <li>View grades and feedback</li>
          <li>Track submission history</li>
        </ul>
        <Link to="/student/courses" className="text-primary hover:text-primary-dark">
          ← Back to My Courses
        </Link>
      </div>
    </div>
  );
};

export default AssessmentView; 