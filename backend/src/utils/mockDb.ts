import { Request, Response, NextFunction } from 'express';

// In-memory storage for mock data
const mockDatabase: {
  users: any[];
  courses: any[];
  enrollments: any[];
  assessments: any[];
  twoFactorCodes: any[];
} = {
  users: [
    {
      _id: 'dev-user-123',
      firstName: 'Dev',
      lastName: 'Student',
      email: 'student@example.com',
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'dev-teacher-123',
      firstName: 'Dev',
      lastName: 'Teacher',
      email: 'teacher@example.com',
      role: 'teacher',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'dev-admin-123',
      firstName: 'Dev',
      lastName: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  courses: [
    {
      _id: 'course-1',
      title: 'Introduction to TypeScript',
      description: 'Learn the basics of TypeScript programming',
      thumbnail: 'https://via.placeholder.com/300x200?text=TypeScript',
      teacherId: 'dev-teacher-123',
      modules: [
        {
          title: 'Getting Started',
          lessons: [
            { title: 'Installation & Setup', content: 'Setting up TypeScript in your project', videoUrl: '' },
            { title: 'Basic Types', content: 'Understanding TypeScript types', videoUrl: '' }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'course-2',
      title: 'React with TypeScript',
      description: 'Build modern web applications with React and TypeScript',
      thumbnail: 'https://via.placeholder.com/300x200?text=React+TypeScript',
      teacherId: 'dev-teacher-123',
      modules: [
        {
          title: 'React Basics',
          lessons: [
            { title: 'Components', content: 'Understanding React components', videoUrl: '' },
            { title: 'Props and State', content: 'Managing data in React', videoUrl: '' }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  enrollments: [
    {
      _id: 'enrollment-1',
      studentId: 'dev-user-123',
      courseId: 'course-1',
      progress: 50,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  assessments: [
    {
      _id: 'assessment-1',
      title: 'TypeScript Basics Quiz',
      description: 'Test your knowledge of TypeScript basics',
      courseId: 'course-1',
      questions: [
        {
          text: 'What is TypeScript?',
          options: [
            'A programming language',
            'A superset of JavaScript',
            'A database',
            'A framework'
          ],
          correctAnswer: 1
        }
      ],
      timeLimit: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  twoFactorCodes: []
};

// Middleware to check if we should use mock database
export const useMockDb = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DB === 'true') {
    // Attach mock database to request object
    (req as any).mockDb = mockDatabase;
    (req as any).useMockDb = true;
    next();
  } else {
    // Use real database
    (req as any).useMockDb = false;
    next();
  }
};

// Mock database operations
export const getMockData = (collection: string) => {
  return mockDatabase[collection as keyof typeof mockDatabase] || [];
};

export const findMockById = (collection: string, id: string) => {
  const items = getMockData(collection);
  return items.find(item => item._id === id);
};

export const createMockItem = (collection: string, data: any) => {
  const items = mockDatabase[collection as keyof typeof mockDatabase];
  const newItem = {
    ...data,
    _id: `${collection}-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  items.push(newItem);
  return newItem;
};

export const updateMockItem = (collection: string, id: string, data: any) => {
  const items = mockDatabase[collection as keyof typeof mockDatabase];
  const index = items.findIndex(item => item._id === id);
  
  if (index !== -1) {
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date()
    };
    return items[index];
  }
  
  return null;
};

export const deleteMockItem = (collection: string, id: string) => {
  const items = mockDatabase[collection as keyof typeof mockDatabase];
  const index = items.findIndex(item => item._id === id);
  
  if (index !== -1) {
    const deleted = items[index];
    items.splice(index, 1);
    return deleted;
  }
  
  return null;
};

export default mockDatabase; 