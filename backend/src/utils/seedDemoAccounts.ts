import User, { UserRole } from '../models/User';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

/**
 * Seed demo accounts for teachers and students
 */
export const seedDemoAccounts = async (): Promise<void> => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB is not connected. Cannot seed demo accounts.');
      return;
    }
    
    // Only seed if environment variable is set
    if (process.env.SEED_DEMO_ACCOUNTS !== 'true') {
      console.log('Demo account seeding is disabled.');
      return;
    }

    console.log('Seeding demo accounts...');
    
    // Demo Teachers
    const teachers = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'teacher1@knowledgechakra.com',
        password: 'Teacher123!',
        role: UserRole.TEACHER
      },
      {
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'teacher2@knowledgechakra.com',
        password: 'Teacher123!',
        role: UserRole.TEACHER
      }
    ];

    // Demo Students
    const students = [
      {
        firstName: 'Alex',
        lastName: 'Brown',
        email: 'student1@knowledgechakra.com',
        password: 'Student123!',
        role: UserRole.STUDENT
      },
      {
        firstName: 'Sarah',
        lastName: 'Davis',
        email: 'student2@knowledgechakra.com',
        password: 'Student123!',
        role: UserRole.STUDENT
      },
      {
        firstName: 'Michael',
        lastName: 'Wilson',
        email: 'student3@knowledgechakra.com',
        password: 'Student123!',
        role: UserRole.STUDENT
      }
    ];

    // Combine all demo accounts
    const demoAccounts = [...teachers, ...students];
    
    // Create each demo account if it doesn't exist
    for (const account of demoAccounts) {
      const existingUser = await User.findOne({ email: account.email });
      
      if (!existingUser) {
        // Generate a clerk ID for each user
        const clerkId = `demo-${account.role}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        
        // Create user
        const user = new User({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          clerkId,
          role: account.role,
          requires2FA: account.role === UserRole.TEACHER || account.role === UserRole.ADMIN
        });
        
        await user.save();
        console.log(`Created ${account.role} account: ${account.email}`);
      } else {
        console.log(`Demo account ${account.email} already exists.`);
      }
    }
    
    console.log('Demo account seeding completed.');
  } catch (error) {
    console.error('Error seeding demo accounts:', error);
  }
}; 