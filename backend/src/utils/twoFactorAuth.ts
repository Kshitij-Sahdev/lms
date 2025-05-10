import crypto from 'crypto';
import TwoFactorCode from '../models/TwoFactorCode';
import { send2FAVerificationEmail } from '../config/email';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate a random 6-digit code
 */
export const generateSixDigitCode = (): string => {
  // Generate a random number between 100000 and 999999
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a secure random UUID
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * Create and send a 2FA code
 */
export const createAndSend2FACode = async (email: string): Promise<boolean> => {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Save code to database
    await TwoFactorCode.create({
      email,
      code,
      expiresAt,
      used: false,
    });
    
    // In development, log the code instead of sending email
    if (process.env.NODE_ENV === 'development') {
      console.log('======================================');
      console.log(`[DEV MODE] 2FA CODE FOR ${email}`);
      console.log(`CODE: ${code}`);
      console.log('EXPIRES: ' + expiresAt.toLocaleTimeString());
      console.log('======================================');
      return true;
    }
    
    // Send email with code
    await sendCodeByEmail(email, code);
    
    return true;
  } catch (error) {
    console.error('Error creating/sending 2FA code:', error);
    return false;
  }
};

/**
 * Send 2FA code by email
 */
const sendCodeByEmail = async (email: string, code: string): Promise<void> => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Knowledge Chakra Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF6600;">Knowledge Chakra - 2FA Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f4f4f4; padding: 10px; text-align: center; font-family: monospace;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };
  
  // Send email
  await transporter.sendMail(mailOptions);
};

export default {
  generateSixDigitCode,
  generateUUID,
  createAndSend2FACode,
}; 