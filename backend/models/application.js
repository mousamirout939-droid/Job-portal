import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected', 'Withdrawn'],
      default: 'Applied',
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    coverLetter: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    interviewSchedules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
    }],
    rating: Number,
    feedback: String,
    notes: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    lastInteractionDate: Date,
    rejectionReason: String,
    offerDetails: {
      salary: Number,
      startDate: Date,
      benefits: [String],
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 });
applicationSchema.index({ status: 1 });

export default mongoose.model('Application', applicationSchema);
