import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// MongoDB connection string 
const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

const directLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // User credentials
    const email = 'kshitijsahdev5@gmail.com';
    const password = 'Kshitij@2023!';

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error('User not found with email:', email);
      return;
    }
    
    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.role})`);
    
    // Create a session token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('=========================================');
    console.log('LOGIN SUCCESS - AUTH TOKEN:');
    console.log(token);
    console.log('=========================================');
    console.log('Copy this token and use it to authenticate.');
    console.log('In your browser console, run:');
    console.log('localStorage.setItem("authToken", "YOUR_TOKEN_HERE")');
    console.log('Then refresh the page.');
    
  } catch (error) {
    console.error('Error during direct login:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the login
directLogin(); 