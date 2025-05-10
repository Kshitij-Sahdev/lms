import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import Course from '../models/Course';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

// Student data from the provided list
const students = [
  { name: 'L.Nancy', email: 'nancylouis013@gmail.com', phone: '9360567416', course: 'Android Development', batch: 'Android App Development - Batch #003' },
  { name: 'Keerthika R', email: 'keerthikaravishankar05@gmail.com', phone: '9444104038', course: 'Digital Marketing', batch: 'Digital Marketing - Batch #005' },
  { name: 'SANDHIYA N', email: 'sandhiyanagaraj0610@gmail.com', phone: '8778330672', course: 'Digital Marketing', batch: 'Digital Marketing - Batch #005' },
  { name: 'Bharath m', email: 'mbharath529@gmail.com', phone: '9345995827', course: 'AutoCAD', batch: 'AutoCAD - Batch #004' },
  { name: 'Arjun D', email: 'arjund9a@gmail.com', phone: '7010984504', course: 'AutoCAD', batch: 'AutoCAD - Batch #004' },
  { name: 'Arunbaskar A', email: 'arunboss8754@gmail.com', phone: '9363533716', course: 'AutoCAD', batch: 'AutoCAD - Batch #004' },
  { name: 'Deepti rathi', email: 'deeptirathi61@gmail.com', phone: '6397924515', course: 'Digital Marketing', batch: 'Digital Marketing - Batch #005' },
  { name: 'Nityam sharma', email: 'sharmanityam50@gmail.com', phone: '8445036144', course: 'Digital Marketing', batch: 'Digital Marketing - Batch #005' },
  { name: 'Kashish', email: 'hc8147728@gmail.com', phone: '9876543210', course: 'Digital Marketing', batch: 'Digital Marketing - Batch #005' },
  { name: 'faizan khan', email: 'fk4976468@gmail.com', phone: '9760198461', course: 'Digital Marketing', batch: 'Digital Marketing - Batch #005' },
];

// Teacher data from the provided list
const teachers = [
  { name: 'DEBASISH SENAPATI', email: 'debasish025@gmail.com', course: 'AutoCAD', batch: 'AutoCAD - Batch #004' },
  { name: 'Mohammed Ameenuddin', email: 'mdameen18@gmail.com', course: 'Digital Marketing', batch: 'Digital Marketing - Batch #005' },
  { name: 'Bhavesh Sharma', email: 'bhavesh3005sharma@gmail.com', course: 'Android App Development', batch: 'Android App Development - Batch #003' },
];

// Admin data
const admin = {
  name: 'Admin User',
  email: 'admin@knowledgechakra.com',
};

// Create bcrypt hash for passwords
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Generate a password for a student - use the last 6 digits of their phone number + KC@
const generateStudentPassword = (phone: string): string => {
  const lastSix = phone.slice(-6);
  return `${lastSix}KC@`;
};

// Generate a password for a teacher - TeacherKC@ + first 3 letters of their first name
const generateTeacherPassword = (name: string): string => {
  const firstName = name.split(' ')[0];
  const firstThree = firstName.substring(0, 3).toLowerCase();
  return `TeacherKC@${firstThree}`;
};

// Function to create or update a user with password
const createOrUpdateUser = async (userData: any, role: UserRole, password: string) => {
  try {
    // Process name into first and last name
    let firstName, lastName;
    
    if (userData.name.includes(' ')) {
      const nameParts = userData.name.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    } else {
      firstName = userData.name;
      lastName = '';
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      // Update existing user
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.role = role;
      existingUser.passwordHash = hashedPassword;
      existingUser.requires2FA = (role === UserRole.TEACHER || role === UserRole.ADMIN);
      
      await existingUser.save();
      console.log(`Updated user: ${userData.email} with password: ${password}`);
      return existingUser;
    } else {
      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email: userData.email,
        passwordHash: hashedPassword,
        role,
        requires2FA: (role === UserRole.TEACHER || role === UserRole.ADMIN),
      });
      
      await newUser.save();
      console.log(`Created user: ${userData.email} with password: ${password}`);
      return newUser;
    }
  } catch (error) {
    console.error(`Error creating/updating user ${userData.email}:`, error);
    return null;
  }
};

// Check if the course exists, if not create it
const createCourseIfNotExists = async (courseData: { name: string, batch: string }) => {
  try {
    const existingCourse = await Course.findOne({ name: courseData.name, batchCode: courseData.batch });
    
    if (!existingCourse) {
      const newCourse = new Course({
        title: courseData.name,
        description: `${courseData.name} course for ${courseData.batch}`,
        batchCode: courseData.batch,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        published: true,
      });
      
      await newCourse.save();
      console.log(`Created course: ${courseData.name} - ${courseData.batch}`);
      return newCourse;
    }
    
    return existingCourse;
  } catch (error) {
    console.error(`Error creating course ${courseData.name}:`, error);
    return null;
  }
};

// Assign students to courses
const assignStudentToCourse = async (studentId: any, courseId: any) => {
  try {
    // In a real implementation, we would check for existing enrollments, etc.
    console.log(`Assigned student ${studentId} to course ${courseId}`);
  } catch (error) {
    console.error(`Error assigning student ${studentId} to course ${courseId}:`, error);
  }
};

// Main function to seed users
const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminPassword = 'AdminPass@2023!';
    await createOrUpdateUser(admin, UserRole.ADMIN, adminPassword);
    console.log('Admin user created/updated');

    // Create teachers
    for (const teacher of teachers) {
      const teacherPassword = generateTeacherPassword(teacher.name);
      await createOrUpdateUser(teacher, UserRole.TEACHER, teacherPassword);
      console.log(`Teacher ${teacher.name} created/updated with password: ${teacherPassword}`);
    }

    // Create students and assign to courses
    for (const student of students) {
      const studentPassword = generateStudentPassword(student.phone);
      const studentUser = await createOrUpdateUser(student, UserRole.STUDENT, studentPassword);
      console.log(`Student ${student.name} created/updated with password: ${studentPassword}`);
      
      // Create or get course
      const course = await createCourseIfNotExists({ name: student.course, batch: student.batch });
      
      if (studentUser && course) {
        await assignStudentToCourse(studentUser._id, course._id);
      }
    }

    console.log('Seed process completed successfully.');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seed function
seedUsers(); 