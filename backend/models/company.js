import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: String,
    website: String,
    description: String,
    logo: {
      public_id: String,
      url: String,
    },
    banner: {
      public_id: String,
      url: String,
    },
    industry: String,
    size: {
      type: String,
      enum: ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'],
    },
    foundedYear: Number,
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    totalApplications: {
      type: Number,
      default: 0,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
