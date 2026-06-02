import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Simple in-memory store for OTP (in a real app, use Redis or DB)
if (!global.otpStore) {
  global.otpStore = { code: null, expires: null };
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (email !== 'engineersmentorservices@gmail.com' || password !== 'admin@123') {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    global.otpStore.code = otp;
    global.otpStore.expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Admin System" <${process.env.EMAIL_USER}>`,
      to: 'engineersmentorservices@gmail.com', // Always send to this email
      subject: `Admin Panel Login OTP: ${otp}`,
      html: `
        <h2>Admin Panel Access</h2>
        <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this login, please secure your account.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
