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
        <h2>Hi ${name},</h2>
        <p>Thank you for submitting your project request for <strong>${domain}</strong>.</p>
        <p>Our team has received your details and will get back to you within 24 hours.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Engineer's Mentor Team</strong></p>
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
