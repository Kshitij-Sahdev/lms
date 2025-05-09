# Knowledge Chakra - Learning Management System

A modern Learning Management System built with the MERN stack (MongoDB, Express, React, Node.js) with TypeScript.

## Features

- **User Roles**: Student, Teacher, and Admin access levels
- **Authentication**: Clerk for sign-up/login and 2FA for Admin & Instructor roles
- **Course Management**: Create/edit courses with structured content
- **Teacher Dashboard**: Upload content, schedule live classes, view student engagement
- **Student Dashboard**: View enrolled courses, track progress, join live classes
- **Assessments**: Quizzes and assignments with auto-evaluation
- **Notifications**: Email and in-app alerts
- **Admin Panel**: User management, course management, platform metrics

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Clerk for authentication
- React Router for navigation

### Backend
- Express.js with TypeScript
- MongoDB Atlas for database
- Mongoose for data modeling
- JSON Web Tokens for API authorization
- Nodemailer/Resend for email notifications

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/knowledge-chakra.git
   cd knowledge-chakra
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the values with your specific configuration

5. Start the development servers:

   Backend:
   ```
   cd backend
   npm run dev
   ```

   Frontend:
   ```
   cd frontend
   npm run dev
   ```

## Project Structure

```
knowledge-chakra/
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS and style files
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── .env.example        # Example environment variables
│   └── package.json        # Frontend dependencies
│
├── backend/                # Express backend
│   ├── src/                # Source code
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── .env.example        # Example environment variables
│   └── package.json        # Backend dependencies
│
└── README.md               # This file
```

## License

This project is licensed under the MIT License.