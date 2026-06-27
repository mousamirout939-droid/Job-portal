import { useEffect, useState } from 'react';
import { useApplicationStore } from '../store/applicationStore';
import { FaFilter, FaCalendarAlt } from 'react-icons/fa';

export default function Applications() {
  const { applications, getApplications, updateApplicationStatus, loading } =
    useApplicationStore();
  const [filters, setFilters] = useState({ status: '' });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getApplications(filters);
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFilterChange = (status) => {
    setFilters({ status });
    getApplications({ status });
  };

  const filteredApps = filters.status
    ? applications.filter((app) => app.status === filters.status)
    : applications;

  const statusOptions = ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected', 'Withdrawn'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="font-semibold text-gray-700">Filter by status:</span>
            </div>
            <button
              onClick={() => handleFilterChange('')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filters.status === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  filters.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app._id}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <h3 className="font-bold text-lg">{app.job?.title}</h3>
                    <p className="text-gray-600 text-sm">{app.job?.company?.name}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Applied Date</p>
                    <p className="font-semibold flex items-center gap-2">
                      <FaCalendarAlt />
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">ATS Score</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${app.atsScore}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold whitespace-nowrap">{app.atsScore}%</span>
                    </div>
                  </div>

                  <div>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updatingId === app._id}
                      className={`w-full px-3 py-2 rounded border border-gray-300 font-semibold disabled:opacity-50 ${
                        app.status === 'Applied'
                          ? 'text-blue-600'
                          : app.status === 'Shortlisted'
                          ? 'text-green-600'
                          : app.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
