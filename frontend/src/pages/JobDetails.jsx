import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { useApplicationStore } from '../store/applicationStore';
import { useResumeStore } from '../store/resumeStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, getJobById, loading } = useJobStore();
  const { applyForJob } = useApplicationStore();
  const { resumes, getResumes } = useResumeStore();
  const { user } = useAuthStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getJobById(id);
    if (user?.role === 'candidate') {
      getResumes();
    }
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedResume) {
      toast.error('Please select a resume');
      return;
    }

    setSubmitting(true);
    try {
      await applyForJob(id, selectedResume, coverLetter);
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setSelectedResume('');
      setCoverLetter('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!job)
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Job not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{job.company?.name}</p>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaBriefcase /> {job.jobType}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaGraduationCap /> {job.experienceLevel}
                  </span>
                </div>
              </div>

              {/* Salary */}
              {job.salary?.min && (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-8">
                  <p className="text-green-800 font-semibold">
                    ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}{' '}
                    {job.salary.currency}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About this role</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.qualifications?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.qualifications.map((qual, idx) => (
                      <li key={idx}>{qual}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  {job.company?.logo?.url ? (
                    <img
                      src={job.company.logo.url}
                      alt={job.company.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-600 text-center">{job.company?.name}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-center">{job.company?.name}</h3>
                {job.company?.location && (
                  <p className="text-gray-600 text-center text-sm">{job.company.location.city}</p>
                )}
              </div>

              {user?.role === 'candidate' ? (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2 mb-4"
                >
                  Apply Now <FaArrowRight />
                </button>
              ) : !user ? (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn-primary flex items-center justify-center gap-2 mb-4"
                >
                  Login to Apply <FaArrowRight />
                </button>
              ) : null}

              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Applications:</strong> {job.applicationsCount}
                </p>
                <p className="mb-2">
                  <strong>Views:</strong> {job.views}
                </p>
                {job.applicationDeadline && (
                  <p>
                    <strong>Deadline:</strong>{' '}
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Resume
                </label>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">-- Select Resume --</option>
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.fileName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="input-field h-32 resize-none"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
