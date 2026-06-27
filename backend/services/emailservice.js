import nodemailer from 'nodemailer';

const hasEmailCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

const transporter = hasEmailCredentials
  ? nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@jobportal.com',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    if (!transporter) {
      console.warn('Email delivery skipped: SMTP credentials are not configured.');
      return { success: false, error: 'Email service is not configured' };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

export const sendJobAlertEmail = async (userEmail, userName, jobs) => {
  const jobsHtml = jobs
    .map(
      (job) => `
    <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${job.company.name}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Type:</strong> ${job.jobType}</p>
      <p>${job.description.substring(0, 200)}...</p>
      <a href="${process.env.FRONTEND_URL}/jobs/${job._id}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Job</a>
    </div>
  `
    )
    .join('');

  const message = `
    <h2>New Job Matches for You</h2>
    <p>Hi ${userName},</p>
    <p>We found some new jobs that match your profile:</p>
    ${jobsHtml}
    <p>Best regards,<br>Job Portal Team</p>
  `;

  return sendEmail({
    email: userEmail,
    subject: 'New Job Opportunities Matching Your Profile',
    message,
  });
};

export const sendApplicationStatusEmail = async (userEmail, userName, jobTitle, status) => {
  const statusMessages = {
    'Shortlisted': 'Congratulations! Your application has been shortlisted.',
    'Interview': 'Great news! You have been selected for an interview.',
    'Offered': 'Excellent! We are pleased to offer you this position.',
    'Rejected': 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.',
  };

  const message = `
    <h2>Application Status Update</h2>
    <p>Hi ${userName},</p>
    <p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status}</strong></p>
    <p>${statusMessages[status] || 'Your application status has been updated.'}</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Application</a>
    </p>
    <p>Best regards,<br>Job Portal Team</p>
  `;

  return sendEmail({
    email: userEmail,
    subject: `Application Status Update: ${jobTitle}`,
    message,
  });
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  const message = `
    <h2>Welcome to Job Portal</h2>
    <p>Hi ${userName},</p>
    <p>Thank you for joining our job portal! We're excited to help you find your next opportunity.</p>
    <p>
      <a href="${process.env.FRONTEND_URL}/jobs" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Explore Jobs</a>
    </p>
    <p>Best regards,<br>Job Portal Team</p>
  `;

  return sendEmail({
    email: userEmail,
    subject: 'Welcome to Job Portal',
    message,
  });
};
