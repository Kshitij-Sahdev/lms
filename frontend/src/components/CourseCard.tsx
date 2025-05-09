import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  progress?: number; // Optional progress percentage
  isEnrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  progress, 
  isEnrolled = false 
}) => {
  // Default thumbnail if none provided
  const thumbnail = course.thumbnail || 'https://placehold.co/600x400/1E1E1E/FF6B00?text=Course';
  
  return (
    <div className="bg-background-paper rounded-lg overflow-hidden shadow-md transition-transform hover:transform hover:scale-[1.02]">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Progress overlay if enrolled */}
        {isEnrolled && typeof progress === 'number' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background-elevated">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Course Details */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">
          {course.title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Instructor info */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-background-elevated flex items-center justify-center mr-2">
            {course.instructor.profilePicture ? (
              <img 
                src={course.instructor.profilePicture} 
                alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="text-xs font-medium text-gray-300">
                {course.instructor.firstName.charAt(0)}
                {course.instructor.lastName.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-300">
            {course.instructor.firstName} {course.instructor.lastName}
          </span>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between items-center">
          {isEnrolled ? (
            <Link 
              to={`/courses/${course.id}`} 
              className="btn btn-primary py-1 px-3 text-sm w-full text-center"
            >
              {progress === 100 ? 'Review Course' : 'Continue Learning'}
            </Link>
          ) : (
            <Link 
              to={`/courses/${course.id}`} 
              className="btn btn-outline py-1 px-3 text-sm w-full text-center"
            >
              View Course
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 