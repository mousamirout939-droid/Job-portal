import mongoose from 'mongoose';
import Job from '../models/job.js';
import Company from '../models/company.js';

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      jobType,
      experienceLevel,
      salary,
      skills,
      qualifications,
      applicationDeadline,
    } = req.body;

    if (!title || !description || !location || !jobType || !experienceLevel) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let companyId = company;
    if (companyId && typeof companyId === 'string') {
      companyId = companyId.trim();
    }

    if (!companyId || !mongoose.isValidObjectId(companyId)) {
      let recruiterCompany = await Company.findOne({ admin: req.user._id });

      if (!recruiterCompany) {
        const companyName = req.user?.name ? `${req.user.name} Company` : 'Default Company';
        recruiterCompany = await Company.create({
          name: companyName,
          email: req.user?.email || `${req.user?._id || 'recruiter'}@example.com`,
          admin: req.user._id,
        });
      }

      companyId = recruiterCompany._id;
    }

    const job = await Job.create({
      title,
      description,
      company: companyId,
      recruiter: req.user._id,
      location,
      jobType,
      experienceLevel,
      salary,
      skills: skills || [],
      qualifications: qualifications || [],
      applicationDeadline,
    });

    res.status(201).json({
      success: true,
      job,
      message: 'Job created successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, location, jobType, experienceLevel } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    const jobs = await Job.find(query)
      .populate('company recruiter', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company recruiter', 'name email')
      .populate('applications');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      job,
      message: 'Job updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company');

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
