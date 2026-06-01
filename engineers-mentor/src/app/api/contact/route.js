import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.json();
    const { name, email, phone, college, department, domain, description } = formData;

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
      subject: `New Project Request: ${domain} from ${name}`,
      html: `
        <h2>New Project Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>College:</strong> ${college}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Domain:</strong> ${domain}</p>
        <p><strong>Description:</strong></p>
        <p>${description.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user
    const clientMailOptions = {
      from: `"Engineer's Mentor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Project Request Received: ${domain}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #1f2937;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Engineer's Mentor</h1>
              </div>
              <div style="padding: 40px;">
                <h2 style="margin-top: 0; color: #111827; font-size: 22px;">Hi ${name},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  Thank you for submitting your project request for <strong>${domain}</strong>.
                </p>
                
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                  <h3 style="margin-top: 0; margin-bottom: 15px; color: #374151; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Request Status</h3>
                  <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.5;">
                    Our team has successfully received your details. We are currently reviewing your request and will get back to you within the next 24 hours.
                  </p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                  If you have any urgent questions in the meantime, feel free to reply directly to this email.
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
