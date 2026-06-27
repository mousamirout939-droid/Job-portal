import Resume from '../models/resume.js';
import User from '../models/user.js';
import { parseResumeData, extractKeywords } from '../services/atsservice.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const filePath = req.file.path;

    // Parse resume data (simplified)
    const parsedData = {
      personalInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        location: req.user.location,
      },
      skills: req.user.skills || [],
      summary: req.user.bio || '',
    };

    const resume = await Resume.create({
      user: req.user._id,
      fileName,
      fileUrl: { url: filePath },
      parsedData,
      atsKeywords: extractKeywords(JSON.stringify(parsedData)),
      isPrimary: false,
    });

    // Check if this is the first resume
    const resumeCount = await Resume.countDocuments({ user: req.user._id });
    if (resumeCount === 1) {
      resume.isPrimary = true;
      await resume.save();
      req.user.resume = resume._id;
      await req.user.save();
    }

    res.status(201).json({
      success: true,
      resume,
      message: 'Resume uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setPrimaryResume = async (req, res) => {
  try {
    // Unset primary for all resumes
    await Resume.updateMany(
      { user: req.user._id },
      { isPrimary: false }
    );

    // Set the selected resume as primary
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { isPrimary: true },
      { new: true }
    );

    req.user.resume = resume._id;
    await req.user.save();

    res.status(200).json({
      success: true,
      resume,
      message: 'Primary resume updated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Resume.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
