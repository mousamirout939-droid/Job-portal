import Job from '../models/job.js';
import Application from '../models/application.js';
import User from '../models/user.js';

export const getRecruiterDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const applicationsByStatus = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const recentApplications = await Application.find({
      job: { $in: jobIds },
    })
      .populate('candidate job')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      dashboard: {
        totalJobs: jobs.length,
        totalApplications,
        applicationsByStatus,
        recentApplications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status, sortBy = 'createdAt' } = req.query;

    const job = await Job.findById(jobId);

    if (!job || job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const query = { job: jobId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('candidate resume')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ [sortBy]: -1 });

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      applications,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addNoteToApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { content } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const job = await Job.findById(application.job);

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.notes.push({
      content,
      author: req.user._id,
    });

    await application.save();

    res.status(200).json({
      success: true,
      application,
      message: 'Note added successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rateCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { rating, feedback } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.rating = rating;
    application.feedback = feedback;
    await application.save();

    res.status(200).json({
      success: true,
      application,
      message: 'Candidate rated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
