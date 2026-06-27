import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { FaSearch, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const { jobs, getJobs } = useJobStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    getJobs(1, 6);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl mb-8">Search thousands of jobs from top companies</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 flex gap-4">
              <div className="flex-1 flex items-center gap-2 border-r border-gray-300">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company?.name || 'Company'}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {job.jobType}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                  <FaArrowRight className="text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/jobs" className="btn-primary text-lg">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-blue-600">10,000+</h3>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-600">50,000+</h3>
              <p className="text-gray-600">Companies</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-600">100,000+</h3>
              <p className="text-gray-600">Happy Candidates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
