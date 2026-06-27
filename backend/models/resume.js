import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: String,
    fileUrl: {
      public_id: String,
      url: String,
    },
    parsedData: {
      personalInfo: {
        name: String,
        email: String,
        phone: String,
        location: String,
      },
      summary: String,
      skills: [String],
      experience: [
        {
          company: String,
          position: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          graduationDate: Date,
          gpa: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: Date,
        },
      ],
      languages: [String],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
        },
      ],
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    atsKeywords: [String],
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
