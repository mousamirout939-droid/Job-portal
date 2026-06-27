import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplicationStore } from '../store/applicationStore';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import toast from 'react-hot-toast';
import {
  FaFileUpload,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaPlus,
} from 'react-icons/fa';

export default function Dashboard() {
  const { applications, stats, getApplications, getApplicationStats } =
    useApplicationStore();
  const { resumes, getResumes, uploadResume } = useResumeStore();
  const { user } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getApplications();
    getApplicationStats();
    getResumes();
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadResume(file);
      toast.success('Resume uploaded successfully!');
      getResumes();
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your job applications and resumes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <h3 className="text-3xl font-bold">{stats?.total || 0}</h3>
              </div>
              <FaFileUpload className="text-blue-600 text-4xl opacity-20" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Under Review</p>
                <h3 className="text-3xl font-bold">{stats?.applied || 0}</h3>
              </div>
              <FaHourglassHalf className="text-yellow-600 text-4xl opacity-20" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rejected</p>
                <h3 className="text-3xl font-bold">{stats?.rejected || 0}</h3>
              </div>
              <FaTimesCircle className="text-red-600 text-4xl opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumes Section */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Your Resumes</h2>
              <div className="space-y-3 mb-6">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-semibold text-sm">{resume.fileName}</p>
                      {resume.isPrimary && (
                        <span className="text-xs text-blue-600 font-semibold">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

              <label className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer">
                <FaPlus /> Upload Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Applications Section */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Your Applications</h2>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{app.job?.title}</h3>
                          <p className="text-gray-600">{app.job?.company?.name}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            app.status === 'Applied'
                              ? 'bg-blue-100 text-blue-800'
                              : app.status === 'Shortlisted'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>ATS Score: {app.atsScore}%</span>
                        <span>
                          Applied:{' '}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No applications yet.{' '}
                  <Link to="/jobs" className="text-blue-600 hover:text-blue-700">
                    Browse jobs
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
