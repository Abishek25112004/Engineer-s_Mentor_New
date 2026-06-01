import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.json();
    const { name, email, college, domain, rating, text } = formData;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Review Submitted by ${name}`,
      html: `
        <h2>New Review Submitted</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>College:</strong> ${college}</p>
        <p><strong>Domain:</strong> ${domain}</p>
        <p><strong>Rating:</strong> ${rating} / 5</p>
        <p><strong>Review:</strong></p>
        <p>${text.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    // Send thank you email to the user
    if (email) {
      const clientMailOptions = {
        from: `"Engineer's Mentor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thank You for Your Review!`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #1f2937;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Engineer's Mentor</h1>
              </div>
              <div style="padding: 40px;">
                <h2 style="margin-top: 0; color: #111827; font-size: 22px;">Hi ${name},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  Thank you for taking the time to share your feedback with us. We highly appreciate your review, and it helps us continue to improve our services and support more students.
                </p>
                
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                  <h3 style="margin-top: 0; margin-bottom: 15px; color: #374151; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Your Review Details</h3>
                  <p style="margin: 0 0 10px 0; font-size: 15px;">
                    <strong style="color: #111827;">Rating:</strong> 
                    <span style="color: #f59e0b; font-size: 18px;">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span> <span style="color: #6b7280; font-size: 14px;">(${rating}/5)</span>
                  </p>
                  <p style="margin: 0; font-size: 15px;">
                    <strong style="color: #111827;">Review:</strong><br>
                    <span style="color: #4b5563; font-style: italic; display: inline-block; margin-top: 8px; line-height: 1.5;">"${text}"</span>
                  </p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  If you need anything else, feel free to reach out to us at any time!
                </p>
                
                <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  <p style="margin: 0; font-size: 15px; color: #374151;">Best regards,</p>
                  <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #111827;">The Engineer's Mentor Team</p>
                </div>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 13px; color: #6b7280;">© ${new Date().getFullYear()} Engineer's Mentor. All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
      };
      await transporter.sendMail(clientMailOptions);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending review email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send review email' },
      { status: 500 }
    );
  }
}
