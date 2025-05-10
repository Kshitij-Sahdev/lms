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
    
    // Always log the code for testing purposes
    console.log('======================================');
    console.log(`2FA CODE FOR ${email}`);
    console.log(`CODE: ${code}`);
    console.log('EXPIRES: ' + expiresAt.toLocaleTimeString());
    console.log('======================================');
    
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
  try {
    // Create test account using Ethereal
    const testAccount = await nodemailer.createTestAccount();
    console.log('Created test email account:', testAccount.user);
    
    // Create transporter using Ethereal credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    // Email content
    const mailOptions = {
      from: '"Knowledge Chakra" <no-reply@knowledgechakra.com>',
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
    const info = await transporter.sendMail(mailOptions);
    
    // Log test URL where email can be viewed
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Failed to send email:', error);
    // Continue despite email error - user can use the code from logs
  }
};

export default {
  generateSixDigitCode,
  generateUUID,
  createAndSend2FACode,
}; 