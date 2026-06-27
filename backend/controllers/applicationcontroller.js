import Application from '../models/application.js';
import Job from '../models/job.js';
import { calculateATSScore, extractKeywords } from '../services/atsservice.js';
import { sendApplicationStatusEmail } from '../services/emailservice.js';

export const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Calculate ATS score
    const jobKeywords = [
      ...job.skills,
      ...job.qualifications,
      job.title,
      job.jobType,
      job.experienceLevel,
    ];

    let atsScore = 0;
    if (resumeId) {
      atsScore = 50; // Placeholder score
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resume: resumeId,
      coverLetter,
      atsScore,
    });

    job.applicationsCount += 1;
    await job.save();

    res.status(201).json({
      success: true,
      application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { status, jobId } = req.query;

    const query = {};

    if (req.user.role === 'candidate') {
      query.candidate = req.user._id;
    } else if (req.user.role === 'recruiter') {
      const jobs = await Job.find({ recruiter: req.user._id });
      query.job = { $in: jobs.map(j => j._id) };
    }

    if (status) {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('job candidate resume')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('candidate job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const job = await Job.findById(application.job._id);

    if (req.user.role !== 'admin' && job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    application.lastInteractionDate = new Date();

    await application.save();

    // Send email notification
    await sendApplicationStatusEmail(
      application.candidate.email,
      application.candidate.name,
      job.title,
      status
    );

    res.status(200).json({
      success: true,
      application,
      message: 'Application status updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const stats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
