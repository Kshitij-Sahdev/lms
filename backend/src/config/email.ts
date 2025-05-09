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

/**
 * Generate a 2FA verification email
 */
export const send2FAVerificationEmail = async (to: string, code: string): Promise<boolean> => {
  const subject = 'Knowledge Chakra - Two-Factor Authentication Code';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #FF6B00; text-align: center;">Knowledge Chakra</h2>
      <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Two-Factor Authentication Code</h3>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #FF6B00; color: white; border-radius: 4px;">${code}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
      <p style="font-size: 12px; text-align: center; color: #777;">
        &copy; ${new Date().getFullYear()} Knowledge Chakra. All rights reserved.
      </p>
    </div>
  `;
  
  return sendEmail({ to, subject, html });
};

export default { sendEmail, send2FAVerificationEmail }; 