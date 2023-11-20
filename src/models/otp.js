import mongoose from 'mongoose';

// Create a Mongoose model for jobs
const otpSchema = new mongoose.Schema({
    name: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    options: { type: mongoose.Schema.Types.Mixed },
    created_at: { type: Date, default: Date.now },
    finished_at: { type: Date },
    failed_at: { type: Date },
    state: { type: String },
});

const otpModel = mongoose.model('OTP', otpSchema);
export default otpModel;