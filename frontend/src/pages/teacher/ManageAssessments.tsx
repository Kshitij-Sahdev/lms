import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AssessmentType } from '../../types';

const ManageAssessments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  
  useEffect(() => {
    // Mock loading delay and data
    const timer = setTimeout(() => {
      setAssessments([
        {
          id: '1',
          title: 'JavaScript Basics Quiz',
          type: AssessmentType.QUIZ,
          course: 'Web Development Fundamentals',
          submissions: 18,
          dueDate: '2023-10-15T23:59:59.000Z',
        },
        {
          id: '2',
          title: 'React Components Assignment',
          type: AssessmentType.ASSIGNMENT,
          course: 'React Framework Masterclass',
          submissions: 0,
          dueDate: '2023-10-20T23:59:59.000Z',
        },
        {
          id: '3',
          title: 'CSS Layouts and Flexbox Quiz',
          type: AssessmentType.QUIZ,
          course: 'Web Development Fundamentals',
          submissions: 15,
          dueDate: '2023-10-10T23:59:59.000Z',
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
        <h1 className="text-2xl font-bold">Manage Assessments</h1>
        <div className="flex space-x-2">
          <Link 
            to="/teacher/assessments/create?type=quiz" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Quiz
          </Link>
          <Link 
            to="/teacher/assessments/create?type=assignment" 
            className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Assignment
          </Link>
        </div>
      </div>
      
      {/* Filters/Search */}
      <div className="bg-surface p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search assessments..."
            className="w-full p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary"
          />
        </div>
        <select className="p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary">
          <option value="all">All Types</option>
          <option value="quiz">Quizzes</option>
          <option value="assignment">Assignments</option>
        </select>
        <select className="p-2 rounded bg-surface-light border border-surface-light text-white focus:border-primary">
          <option value="all">All Courses</option>
          <option value="web-dev">Web Development</option>
          <option value="react">React Framework</option>
        </select>
      </div>
      
      {/* Assessments List */}
      {assessments.length === 0 ? (
        <div className="text-center p-8 bg-surface rounded-lg">
          <h2 className="text-xl mb-3">No assessments found</h2>
          <p className="text-text-secondary mb-6">Create your first assessment to get started</p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/teacher/assessments/create?type=quiz" 
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Create Quiz
            </Link>
            <Link 
              to="/teacher/assessments/create?type=assignment" 
              className="px-6 py-3 bg-surface-light text-white rounded-lg hover:bg-primary/20 transition-colors"
            >
              Create Assignment
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((assessment: any) => (
            <div key={assessment.id} className="bg-surface p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">{assessment.title}</h2>
                    <span 
                      className={`ml-3 px-2 py-1 rounded text-xs ${
                        assessment.type === AssessmentType.QUIZ 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-success/20 text-success'
                      }`}
                    >
                      {assessment.type}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">
                    Course: {assessment.course}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/teacher/assessments/${assessment.id}`}
                    className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/teacher/assessments/${assessment.id}/submissions`}
                    className="bg-surface-light hover:bg-primary/20 text-white px-4 py-2 rounded transition-colors"
                  >
                    View Submissions
                  </Link>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-light flex flex-col sm:flex-row justify-between">
                <div>
                  <span className="text-text-secondary">Submissions: </span>
                  <span>{assessment.submissions}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Due Date: </span>
                  <span>{new Date(assessment.dueDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Status: </span>
                  <span className={new Date(assessment.dueDate) > new Date() ? 'text-success' : 'text-error'}>
                    {new Date(assessment.dueDate) > new Date() ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAssessments; 