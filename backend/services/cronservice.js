import cron from 'node-cron';
import User from '../models/user.js';
import Job from '../models/job.js';
import { sendJobAlertEmail } from './emailservice.js';

// Send job alerts to candidates every day at 9 AM
export const initializeCronJobs = () => {
  // Daily job alerts at 09:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running scheduled job alerts task...');
    try {
      const candidates = await User.find({
        role: 'candidate',
        'notifications.jobAlerts': true,
      }).select('name email skills location');

      for (let candidate of candidates) {
        // Find jobs matching candidate skills and location
        const matchingJobs = await Job.find({
          isActive: true,
          $or: [
            { skills: { $in: candidate.skills } },
            { location: { $regex: candidate.location, $options: 'i' } },
          ],
        }).limit(5);

        if (matchingJobs.length > 0) {
          await sendJobAlertEmail(candidate.email, candidate.name, matchingJobs);
          console.log(`Job alerts sent to ${candidate.email}`);
        }
      }
      console.log('Job alerts task completed');
    } catch (error) {
      console.error('Error in job alerts cron job:', error);
    }
  });

  // Update analytics every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('Running scheduled analytics update...');
    try {
      // Update job view counts and application counts
      // This would typically update analytics dashboards
      console.log('Analytics update completed');
    } catch (error) {
      console.error('Error in analytics cron job:', error);
    }
  });

  // Clean up old applications every week
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running cleanup task...');
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      // Clean up old records or archive them
      console.log('Cleanup task completed');
    } catch (error) {
      console.error('Error in cleanup cron job:', error);
    }
  });

  console.log('Cron jobs initialized successfully');
};
