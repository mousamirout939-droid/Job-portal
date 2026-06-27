import Application from '../models/application.js';
import Job from '../models/job.js';
import { calculateATSScore, extractKeywords, recommendCandidates } from '../services/atsservice.js';

export const scoreApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const jobKeywords = [...job.skills, ...job.qualifications];
    const applications = await Application.find({ job: jobId }).populate('resume');

    let scoredCount = 0;
    for (let app of applications) {
      if (app.resume) {
        const resumeKeywords = extractKeywords(JSON.stringify(app.resume.parsedData));
        const score = calculateATSScore(resumeKeywords, jobKeywords);
        app.atsScore = score;
        await app.save();
        scoredCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `${scoredCount} applications scored`,
      scoredCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopCandidates = async (req, res) => {
  try {
    const { jobId, limit = 10 } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const topCandidates = await Application.find({ job: jobId })
      .populate('candidate resume')
      .sort({ atsScore: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      candidates: topCandidates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getATSAnalytics = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const stats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          avgScore: { $avg: '$atsScore' },
          maxScore: { $max: '$atsScore' },
          minScore: { $min: '$atsScore' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: stats[0] || {
        totalApplications: 0,
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const filterCandidates = async (req, res) => {
  try {
    const { jobId, minScore, maxScore, status } = req.body;

    const query = { job: jobId };

    if (minScore) query.atsScore = { $gte: minScore };
    if (maxScore) query.atsScore = { ...query.atsScore, $lte: maxScore };
    if (status) query.status = status;

    const candidates = await Application.find(query)
      .populate('candidate resume')
      .sort({ atsScore: -1 });

    res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
