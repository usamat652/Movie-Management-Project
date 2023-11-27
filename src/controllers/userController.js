import { userModel, validateUser } from "../models/user.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config()
// import schedule from 'node-schedule';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import jobModel from "../models/job.js";
import emailQueue from "./emailQueue.js";
import  { otpQueue } from "./otpQueue.js";
import otpModel from "../models/otp.js";
// import cron, { schedule } from 'node-cron';

const Secret_Key = process.env.SECRET_KEY

function generateRandomToken() {
    const charactersToGenerateRandomToken = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let startIndex = 0; startIndex < 12; startIndex++) {
        const randomIndex = Math.floor(Math.random() * charactersToGenerateRandomToken.length);
        token = token + charactersToGenerateRandomToken.charAt(randomIndex);
    }
    return token;
}

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate user data
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send({ message: 'User Data is not Validated', error: error });
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = generateRandomToken();

        // Create user with hashed password and verification token
        const createUser = await userModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            rememberToken: verificationToken
        });

        createUser.rememberToken = verificationToken;
        await createUser.save();

        // Schedule the email verification job
        const jobData = { user: createUser };
        const job=  emailQueue.add("sendVerificationEmail", jobData); 

        // Save the job details in the MongoDB collection
        const uniqueJobName = `sendVerificationEmail_${createUser._id}`; 
        await jobModel.create({
            name: uniqueJobName,
            data: jobData,
            options: job.opts,
        });

        res.status(200).json({ message: 'User created successfully. Please check your email for verification.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Process the email verification job
const verification = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await userModel.findOne({ rememberToken: token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.rememberToken = null;
        await user.save();
        return res.status(200).send({ message: "Verification Successfully" });
    } catch (error) {
        return res.status(401).send({ message: "Error occurred" });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    // Find the existing user by email
    let existingUser = await userModel.findOne({ email: email });

    if (!existingUser) {
        return res.status(400).json({ message: "User Not Found" });
    }

    existingUser = _.pick(existingUser, ['email', 'password']);
    const comparePassword = await bcrypt.compare(password, existingUser.password);

    if (!comparePassword) {
        return res.status(400).json({ message: "Password Did Not Match" });
    }

    const otpdata = { user: existingUser};
    const otpJob = otpQueue.add('sendOtpMessage', otpdata);
    
    await otpModel.create({
        name: otpJob.name, 
        uniqueId: existingUser._id, 
        data: otpdata,
        options: otpJob.opts,
    });
    const payload = { email: existingUser.email, id: existingUser._id }
    const token = jwt.sign(payload, Secret_Key);

    res.status(200).json({ user: existingUser, token: token, message: "Login Successfully" });
};

const addAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate user data
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send({ message: 'User Data is not Validated', error: error });
        }
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateRandomToken();

        const createUser = await userModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            rememberToken: verificationToken,
            isAdmin: true
        });

        createUser.rememberToken = verificationToken;
        await createUser.save();

        const jobData = { user: createUser };
        const job=  emailQueue.add("sendVerificationEmail", jobData); 
        const uniqueJobName = `sendVerificationEmail_${createUser._id}`; 
        await jobModel.create({
            name: uniqueJobName,
            data: jobData,
            options: job.opts,
        });
        res.status(200).json({ message: 'User created successfully. Please check your email for verification.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export {
    signup,
    signin,
    verification,
    addAdmin
}




// const signup = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password } = req.body;

//         // Validate user data
//         const { error } = validateUser(req.body);
//         if (error) {
//             return res.status(400).send({ message: 'User Data is not Validated', error: error });
//         }

//         // Check if the user already exists
//         const existingUser = await userModel.findOne({ email: email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User Already Exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Generate a verification token
//         const verificationToken = generateRandomToken();
//         // Create user with hashed password
//         const createUser = await userModel.create({
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             password: hashedPassword,
//             rememberToken: verificationToken
//         });

//         createUser.verificationToken = verificationToken;
//         await createUser.save();

//         // Send verification email

//         const verificationLink = `http://localhost:4000/your-verification-link/${verificationToken}`;

//         await transporter.sendMail({
//             from: 'usamat652@gmail.com',
//             to: createUser.email,
//             subject: 'Account Verification',
//             html: `Click <a href="${verificationLink}">here</a> to verify your account.`,
//         });

//         res.status(200).json({ message: 'User created successfully. Please check your email for verification.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };



// function scheduleEmailVerificationJob(user) {
//     const jobName = `Mail_Job_${user._id}_${user.rememberToken}`;

//     // Schedule the job to run after 5 minutes (adjust as needed)
//     schedule.scheduleJob(jobName, '*/10 * * * * *', async () => {
//         try {
//             const verificationLink = `http://localhost:4000/your-verification-link/${user._id}/${user.rememberToken}`;

//             await transporter.sendMail({
//                 from: 'usamat652@gmail.com',
//                 to: user.email,
//                 subject: 'Account Verification',
//                 html: `Click <a href="${verificationLink}">here</a> to verify your account.`,
//             });

//             console.log('Verification email sent successfully.');
//         } catch (emailError) {
//             console.error('Error sending verification email:', emailError);
//         }

//         // Cancel the job after it's executed
//         schedule.cancelJob(jobName);
//     });
// }