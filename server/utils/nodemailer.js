import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your gmail address
    pass: process.env.EMAIL_PASS, // your gmail app password
  },
});

export const sendUserCredentials = async (to, email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Account Credentials',
    html: `<div style="font-family:sans-serif;">
      <h2>Welcome to Face Detection Attendance System</h2>
      <p>Your account has been created. Here are your login credentials:</p>
      <ul>
        <li><b>Email:</b> ${email}</li>
        <li><b>Password:</b> ${password}</li>
      </ul>
      <p>Please login and change your password after first login.</p>
    </div>`
  };
  await transporter.sendMail(mailOptions);
};
