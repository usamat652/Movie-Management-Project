import transporter from "../config/emailConfig.js";
import jobModel from "../models/job.js";
import Queue from "bull";
// Function to save job data to MongoDB

const emailQueue= new Queue('emailQueue');

emailQueue.process("sendVerificationEmail", async (job) => {
  const { user } = job.data;
  const verificationLink = `http://localhost:4000/your-verification-link/${user.rememberToken}`;

  try {
    console.log('Sending verification email to:', user.email);
    console.log('Verification link:', verificationLink);

    await transporter.sendMail({
      from: 'usamat652@gmail.com',
      to: user.email,
      subject: 'Account Verification',
      html: `Click <a href="${verificationLink}">here</a> to verify your account.`,
    });
    console.log('Verification email sent successfully.');

    // Job completed successfully, remove it from the MongoDB collection
    await jobModel.findOneAndDelete({ name: job.name });
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);

    // Job failed, update its state in the MongoDB collection
    await jobModel.findOneAndUpdate({ name: job.name }, { state: 'failed', failed_at: new Date() });
  }
});

export default emailQueue;