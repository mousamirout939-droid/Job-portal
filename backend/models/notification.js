import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Application', 'Message', 'System', 'JobAlert', 'Interview'],
      required: true,
    },
    title: String,
    message: String,
    link: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedData: {
      jobId: mongoose.Schema.Types.ObjectId,
      applicationId: mongoose.Schema.Types.ObjectId,
      userId: mongoose.Schema.Types.ObjectId,
    },
    readAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
