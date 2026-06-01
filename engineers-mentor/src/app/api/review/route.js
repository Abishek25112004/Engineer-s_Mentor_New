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
          <h2>Hi ${name},</h2>
          <p>Thank you for taking the time to share your feedback with us.</p>
          <p>We highly appreciate your review, and it helps us continue to improve our services and support more students.</p>
          <p>Your Review Details:</p>
          <ul>
            <li><strong>Rating:</strong> ${rating} / 5</li>
            <li><strong>Review:</strong> ${text}</li>
          </ul>
          <br>
          <p>Best regards,</p>
          <p><strong>Engineer's Mentor Team</strong></p>
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
