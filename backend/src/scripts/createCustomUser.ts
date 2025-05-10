import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
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

const createUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // User details
    const user = {
      firstName: "Kshitij",
      lastName: "Sah",
      email: "kshitijsahdev5@gmail.com",
      role: UserRole.ADMIN, // Can be STUDENT, TEACHER, or ADMIN
      password: "Kshitij@2023!",
      requires2FA: false     // Disable 2FA
    };

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(user.password, salt);

    // Check if user exists
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      // Update existing user
      existingUser.firstName = user.firstName;
      existingUser.lastName = user.lastName;
      existingUser.role = user.role;
      existingUser.passwordHash = passwordHash;
      existingUser.requires2FA = user.requires2FA;
      
      await existingUser.save();
      console.log(`Updated user: ${user.email} with password: ${user.password}`);
    } else {
      // Create new user
      const newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash,
        role: user.role,
        requires2FA: user.requires2FA,
      });
      
      await newUser.save();
      console.log(`Created user: ${user.email} with password: ${user.password}`);
    }

    console.log('User creation completed successfully.');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the function
createUser(); 