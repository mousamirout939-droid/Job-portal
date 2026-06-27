import Resume from '../models/resume.js';
import Application from '../models/application.js';

// Extract keywords from text
export const extractKeywords = (text) => {
  if (!text) return [];
  
  const keywords = [];
  const words = text.toLowerCase().split(/\s+/);
  const commonStopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'from', 'up', 'about', 'into', 'through', 'during', 'is', 'are', 'was', 'been', 'be',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  ]);

  for (let word of words) {
    if (word.length > 2 && !commonStopWords.has(word)) {
      keywords.push(word);
    }
  }

  return [...new Set(keywords)];
};

// Parse resume data
export const parseResumeData = (text) => {
  const parsedData = {
    personalInfo: {},
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    projects: [],
  };

  // Extract skills (simple extraction)
  const skillsPattern = /skills?:?\s*([\s\S]*?)(?=education|experience|$)/i;
  const skillsMatch = text.match(skillsPattern);
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    parsedData.skills = skillsText.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
  }

  // Extract summary
  const summaryPattern = /(?:objective|summary|profile)[:\s]+([\s\S]*?)(?=experience|education|skills|$)/i;
  const summaryMatch = text.match(summaryPattern);
  if (summaryMatch) {
    parsedData.summary = summaryMatch[1].trim().substring(0, 500);
  }

  return parsedData;
};

// Calculate ATS score
export const calculateATSScore = (resumeKeywords, jobRequirements) => {
  if (!resumeKeywords.length || !jobRequirements.length) {
    return 0;
  }

  const jobKeywordsSet = new Set(jobRequirements.map(k => k.toLowerCase()));
  const resumeKeywordsSet = new Set(resumeKeywords.map(k => k.toLowerCase()));

  let matchCount = 0;
  for (let keyword of jobKeywordsSet) {
    if (resumeKeywordsSet.has(keyword)) {
      matchCount++;
    }
  }

  const score = Math.round((matchCount / jobKeywordsSet.size) * 100);
  return Math.min(score, 100);
};

// Get matching score between resume and job
export const getMatchingScore = async (resumeId, jobRequirements) => {
  try {
    const resume = await Resume.findById(resumeId);
    if (!resume) return 0;

    const resumeText = `
      ${resume.parsedData.summary || ''}
      ${resume.parsedData.skills.join(' ')}
      ${resume.parsedData.experience.map(e => e.description).join(' ')}
    `.toLowerCase();

    const resumeKeywords = extractKeywords(resumeText);
    const score = calculateATSScore(resumeKeywords, jobRequirements);

    return score;
  } catch (error) {
    console.error('Error calculating matching score:', error);
    return 0;
  }
};

// Auto-score applications
export const autoScoreApplications = async (jobId, jobRequirements) => {
  try {
    const applications = await Application.find({ job: jobId })
      .populate('resume');

    for (let application of applications) {
      if (application.resume) {
        const score = await getMatchingScore(application.resume._id, jobRequirements);
        application.atsScore = score;
        await application.save();
      }
    }

    return { success: true, message: 'Applications scored successfully' };
  } catch (error) {
    console.error('Error auto-scoring applications:', error);
    return { success: false, error: error.message };
  }
};

// Recommend candidates for a job
export const recommendCandidates = async (jobId, limit = 10) => {
  try {
    const applications = await Application.find({ job: jobId })
      .populate('candidate resume')
      .sort({ atsScore: -1 })
      .limit(limit);

    return applications;
  } catch (error) {
    console.error('Error recommending candidates:', error);
    return [];
  }
};
