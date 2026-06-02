import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (email !== 'engineersmentorservices@gmail.com' || password !== 'admin@123') {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
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

    // Set HTTP-only cookie with OTP instead of using global variable which is unreliable in Next.js
    const response = NextResponse.json({ success: true, message: 'OTP sent successfully' });
    response.cookies.set({
      name: 'pending_admin_otp',
      value: otp,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 10 * 60, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
