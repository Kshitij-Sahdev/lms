# Knowledge Chakra Learning Management System

A modern Learning Management System (LMS) for educational institutions, designed to facilitate online learning with courses, assessments, and live classes.

## Features

- **User Authentication**: Password-based authentication with JWT tokens
- **Role-Based Access Control**: Different interfaces for students, teachers, and administrators
- **Courses Management**: Create and manage courses with modules and lessons
- **Assessments**: Quizzes and assignments with automatic grading
- **Live Classes**: Schedule and manage virtual classrooms
- **User Management**: Create and manage users (students, teachers, admin)
- **Two-Factor Authentication**: Additional security for teacher and admin accounts
- **Real-time Notifications**: Updates for course activities, assignments, and announcements
- **Progress Tracking**: Monitor student progress through courses

## Project Structure

The project is divided into two main parts:

1. **Frontend**: React application with TypeScript
2. **Backend**: Node.js API with Express and MongoDB

### Frontend

The frontend is built with React, TypeScript, and Tailwind CSS:

- React Router for navigation
- Axios for API requests
- React Hot Toast for notifications
- Tailwind CSS for styling

### Backend

The backend uses Node.js with Express and MongoDB:

- Mongoose for MongoDB object modeling
- JWT for authentication
- Bcrypt for password hashing
- Zod for schema validation
- Express Rate Limit for API security

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example` file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string and other required variables.

5. Seed the database with initial users:

```bash
npm run seed-users
```

6. Start the development server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example` file:

```bash
cp .env.example .env
```

4. Update the `.env` file with the backend API URL.

5. Start the development server:

```bash
npm run dev
```

## User Accounts

The seed script creates the following accounts:

### Student Users

| Name | Email | Password Format |
|------|-------|----------------|
| L.Nancy | nancylouis013@gmail.com | 567416KC@ (Last 6 digits of phone + KC@) |
| Keerthika R | keerthikaravishankar05@gmail.com | 104038KC@ |
| SANDHIYA N | sandhiyanagaraj0610@gmail.com | 330672KC@ |
| Bharath m | mbharath529@gmail.com | 995827KC@ |
| Arjun D | arjund9a@gmail.com | 984504KC@ |
| Arunbaskar A | arunboss8754@gmail.com | 533716KC@ |
| Deepti rathi | deeptirathi61@gmail.com | 924515KC@ |
| Nityam sharma | sharmanityam50@gmail.com | 036144KC@ |
| Kashish | hc8147728@gmail.com | 543210KC@ |
| faizan khan | fk4976468@gmail.com | 198461KC@ |

### Teacher Users

| Name | Email | Password Format |
|------|-------|----------------|
| DEBASISH SENAPATI | debasish025@gmail.com | TeacherKC@deb |
| Mohammed Ameenuddin | mdameen18@gmail.com | TeacherKC@moh |
| Bhavesh Sharma | bhavesh3005sharma@gmail.com | TeacherKC@bha |

### Admin User

- Email: admin@knowledgechakra.com
- Password: AdminPass@2023!

## Important Notes

1. **Database**: The MongoDB database is pre-configured but can be changed in the .env files
2. **Two-Factor Authentication**: Teachers and Admins will be prompted for 2FA verification
3. **Session Expiry**: JWT tokens expire after 7 days

## Troubleshooting

- **Database Connection Issues**: Verify MongoDB connection string in backend/.env
- **Missing Users**: Run the seed-users script to populate the database
- **Authentication Issues**: Check the browser console for API errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.