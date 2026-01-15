import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Please provide a role'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied',
    },
    date: {
        type: String, // Storing as YYYY-MM-DD string as per frontend usage
        required: [true, 'Please provide an application date'],
    },
    salary: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    link: {
        type: String,
        trim: true,
    },
    platform: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    workMode: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        default: 'On-site',
    },
}, {
    timestamps: true,
});

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
