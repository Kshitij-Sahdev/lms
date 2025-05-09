import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend if API key is provided
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Create SMTP transporter if SMTP credentials are provided
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

let smtpTransporter: nodemailer.Transporter | null = null;

if (smtpHost && smtpUser && smtpPass) {
  smtpTransporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

/**
 * Send an email using the configured email service (Resend or SMTP)
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const { to, subject, html, text, from = 'Knowledge Chakra <noreply@knowledgechakra.com>' } = options;
    
    // Try to send with Resend first if available
    if (resend) {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if text not provided
      });
      
      if (error) {
        throw new Error(`Resend API error: ${error.message}`);
      }
      
      return !!data;
    }
    
    // Fall back to SMTP if available
    if (smtpTransporter) {
      const info = await smtpTransporter.sendMail({
        from,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if text not provided
      });
      
      return !!info.messageId;
    }
    
    throw new Error('No email provider configured');
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Email configuration
const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  from: process.env.EMAIL_FROM || 'Knowledge Chakra <noreply@example.com>',
};

/**
 * Send a 2FA verification email
 */
export const send2FAVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    // Check if running in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] 2FA code for ${email}: ${code}`);
      return true;
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth,
    });
    
    // Email content
    const mailOptions = {
      from: emailConfig.from,
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
    
    return true;
  } catch (error) {
    console.error('Error sending 2FA email:', error);
    return false;
  }
};

export default {
  emailConfig,
  send2FAVerificationEmail,
}; 