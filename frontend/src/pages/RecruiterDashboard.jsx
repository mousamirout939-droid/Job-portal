import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { useApplicationStore } from '../store/applicationStore';
import { useATSStore } from '../store/atsStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import {
  FaBriefcase,
  FaUsers,
  FaCheckCircle,
  FaPlus,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const { getRecruiterJobs, jobs, deleteJob } = useJobStore();
  const { getApplicationStats, stats } = useApplicationStore();
  const { getATSAnalytics, analytics } = useATSStore();
  const [activeTab, setActiveTab] = useState('jobs');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'recruiter' && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    getRecruiterJobs();
    getApplicationStats();
    getATSAnalytics();
  }, [authLoading, user, navigate, getRecruiterJobs, getApplicationStats, getATSAnalytics]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setDeleting(jobId);
      try {
        await deleteJob(jobId);
        toast.success('Job deleted successfully');
      } catch (error) {
        toast.error('Failed to delete job');
      } finally {
        setDeleting(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Recruiter Dashboard</h1>
            <p className="text-gray-600">Manage your job postings and applications</p>
          </div>
          <Link to="/recruiter/create-job" className="btn-primary flex items-center gap-2">
            <FaPlus /> Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Jobs</p>
                <h3 className="text-3xl font-bold">{jobs.length}</h3>
              </div>
              <FaBriefcase className="text-blue-600 text-4xl opacity-20" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <h3 className="text-3xl font-bold">{stats?.total || 0}</h3>
              </div>
              <FaUsers className="text-green-600 text-4xl opacity-20" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Shortlisted</p>
                <h3 className="text-3xl font-bold">{stats?.shortlisted || 0}</h3>
              </div>
              <FaCheckCircle className="text-yellow-600 text-4xl opacity-20" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg ATS Score</p>
                <h3 className="text-3xl font-bold">
                  {analytics?.averageScore?.toFixed(1) || 0}%
                </h3>
              </div>
              <span className="text-purple-600 text-4xl opacity-20">📊</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-4 border-b-2 font-semibold transition-colors ${
                  activeTab === 'jobs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Jobs
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-4 border-b-2 font-semibold transition-colors ${
                  activeTab === 'applications'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Applications
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'jobs' && (
              <div>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{job.title}</h3>
                            <p className="text-gray-600">{job.location}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              job.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                          <span>{job.applicationsCount} applications</span>
                          <span>{job.views} views</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/recruiter/jobs/${job._id}`}
                            className="btn-secondary text-sm"
                          >
                            <FaEdit /> Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            disabled={deleting === job._id}
                            className="btn-danger text-sm disabled:opacity-50"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No jobs posted yet.{' '}
                    <Link to="/recruiter/create-job" className="text-blue-600 hover:text-blue-700">
                      Create your first job
                    </Link>
                  </p>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <p className="text-gray-600 text-center py-8">
                  View applications for your jobs.{' '}
                  <Link to="/recruiter/applications" className="text-blue-600 hover:text-blue-700">
                    Go to applications
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
