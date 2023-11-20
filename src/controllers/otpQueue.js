import transporter from "../config/emailConfig.js";
import otpModel from "../models/otp.js";
import Queue from "bull";

// Function to save job data to MongoDB
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const otpQueue = new Queue('otpQueue');
otpQueue.process('sendOtpMessage', async (job) => {
    const { user, uniqueId } = job.data; 
    const otp = generateOTP();

    try {
        console.log('Sending OTP message to:', user.email);
        console.log('OTP:', otp);

        await transporter.sendMail({
            from: 'usamat652@gmail.com',
            to: user.email,
            subject: 'Account Verification',
            text: `Your OTP code is ${otp}`,
        });
        console.log('OTP message sent successfully.');

        // Job completed successfully, remove it from the MongoDB collection using the unique identifier
        await otpModel.findOneAndDelete({ uniqueId: uniqueId });
    } catch (otpError) {
        console.error('Error sending OTP message:', otpError);

        // Job failed, update its state in the MongoDB collection
        await otpModel.findOneAndUpdate({ name: job.name }, { state: 'failed', failed_at: new Date() });
    }
});
export { otpQueue };
