import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { otp } = await req.json();
    const cookieStore = await cookies();
    const expectedOtp = cookieStore.get('pending_admin_otp')?.value;

    if (!expectedOtp) {
      return NextResponse.json({ success: false, message: 'OTP expired or not requested' }, { status: 400 });
    }

    if (otp === expectedOtp) {
      const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
      
      // Clear the pending OTP cookie
      response.cookies.delete('pending_admin_otp');

      // Set auth cookie
      response.cookies.set({
        name: 'admin_session',
        value: 'authenticated', // In a real app this should be a signed JWT
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 401 });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
