import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { FaMapMarkerAlt, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Jobs() {
  const { jobs, total, pages, loading, getJobs, searchJobs } = useJobStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
  });

  useEffect(() => {
    getJobs(currentPage);
  }, [currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchJobs(1, filters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaFilter /> Filters
              </h3>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Job title..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <button type="submit" className="w-full btn-primary">
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Jobs List */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="card p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          {job.jobType}
                        </span>
                        {job.salary?.min && (
                          <p className="text-green-600 font-semibold">
                            ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-2">
                        <FaMapMarkerAlt /> {job.location}
                      </span>
                      <span className="text-sm text-gray-400">
                        {job.applicationsCount} applications
                      </span>
                    </div>
                  </Link>
                ))}

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="btn-secondary disabled:opacity-50"
                    >
                      <FaChevronLeft />
                    </button>
                    <span>
                      Page {currentPage} of {pages}
                    </span>
                    <button
                      disabled={currentPage === pages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="btn-secondary disabled:opacity-50"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-gray-600 text-lg">No jobs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
