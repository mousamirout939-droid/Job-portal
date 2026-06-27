import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaShieldAlt,
} from 'react-icons/fa';
import { FaBuildingColumns } from 'react-icons/fa6';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationFilter, setApplicationFilter] = useState('Pending');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(response.data.dashboard);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch dashboard');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(response.data.companies);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      toast.error('Failed to fetch job requests');
    }
  };

  const handleUpdateApplication = async (applicationId, status) => {
    try {
      await axios.put(
        `${API_URL}/applications/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(status === 'Shortlisted' ? 'Application accepted' : 'Application rejected');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const filteredApplications = applications.filter((application) => {
    if (applicationFilter === 'All') return true;
    if (applicationFilter === 'Pending') return application.status === 'Applied';
    return application.status === applicationFilter;
  });

  const handleVerifyCompany = async (companyId) => {
    try {
      await axios.post(
        `${API_URL}/admin/companies/${companyId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Company verified');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to verify company');
    }
  };

  const handleSuspendUser = async (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await axios.post(
          `${API_URL}/admin/users/${userId}/suspend`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('User suspended');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to suspend user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, companies, and system settings</p>
        </div>

        {/* Stats */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <h3 className="text-3xl font-bold">{dashboard.totalUsers}</h3>
                </div>
                <FaUsers className="text-blue-600 text-4xl opacity-20" />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Jobs</p>
                  <h3 className="text-3xl font-bold">{dashboard.totalJobs}</h3>
                </div>
                <FaBriefcase className="text-green-600 text-4xl opacity-20" />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Applications</p>
                  <h3 className="text-3xl font-bold">{dashboard.totalApplications}</h3>
                </div>
                <FaFileAlt className="text-yellow-600 text-4xl opacity-20" />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Companies</p>
                  <h3 className="text-3xl font-bold">{dashboard.totalCompanies}</h3>
                </div>
                <FaBuildingColumns className="text-purple-600 text-4xl opacity-20" />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">This Month</p>
                  <h3 className="text-3xl font-bold">
                    {dashboard.thisMonthApplications}
                  </h3>
                </div>
                <FaShieldAlt className="text-red-600 text-4xl opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-4 border-b-2 font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab('users');
                  fetchUsers();
                }}
                className={`py-4 px-4 border-b-2 font-semibold transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => {
                  setActiveTab('companies');
                  fetchCompanies();
                }}
                className={`py-4 px-4 border-b-2 font-semibold transition-colors ${
                  activeTab === 'companies'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => {
                  setActiveTab('applications');
                  fetchApplications();
                }}
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
            {activeTab === 'overview' && dashboard && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Reports</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      Jobs created this month:{' '}
                      <strong>{dashboard.thisMonthJobs}</strong>
                    </p>
                    <p>
                      Users created this month:{' '}
                      <strong>{dashboard.thisMonthUsers}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-3">{user.name}</td>
                            <td className="px-6 py-3">{user.email}</td>
                            <td className="px-6 py-3">
                              <span className="capitalize">{user.role}</span>
                            </td>
                            <td className="px-6 py-3">
                              <span
                                className={`px-2 py-1 rounded text-sm font-semibold ${
                                  user.isVerified
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {user.isVerified ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <button
                                onClick={() => handleSuspendUser(user._id)}
                                className="btn-danger text-sm"
                              >
                                {user.isVerified ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No users found</p>
                )}
              </div>
            )}

            {activeTab === 'companies' && (
              <div>
                {companies.length > 0 ? (
                  <div className="space-y-4">
                    {companies.map((company) => (
                      <div
                        key={company._id}
                        className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          <h3 className="font-bold text-lg">{company.name}</h3>
                          <p className="text-gray-600">{company.email}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Status:{' '}
                            <span
                              className={`font-semibold ${
                                company.verificationStatus === 'Verified'
                                  ? 'text-green-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              {company.verificationStatus}
                            </span>
                          </p>
                        </div>
                        {company.verificationStatus !== 'Verified' && (
                          <button
                            onClick={() => handleVerifyCompany(company._id)}
                            className="btn-primary text-sm"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No companies found</p>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">Job requests</h3>
                  <select
                    value={applicationFilter}
                    onChange={(event) => setApplicationFilter(event.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="All">All</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {filteredApplications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{application?.job?.title || 'Job request'}</h3>
                            <p className="text-gray-600">Applicant: {application?.candidate?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">Email: {application?.candidate?.email || 'N/A'}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Status:{' '}
                              <span className="font-semibold text-blue-600">{application.status}</span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateApplication(application._id, 'Shortlisted')}
                              className="btn-primary text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateApplication(application._id, 'Rejected')}
                              className="btn-danger text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No matching job requests found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}