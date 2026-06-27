import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyStore } from '../store/companyStore';
import { FaMapMarkerAlt, FaGlobe, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Companies() {
  const { companies, getCompanies, loading } = useCompanyStore();
  const [currentPage, setCurrentPage] = useState(1);
  const companiesList = Array.isArray(companies) ? companies : [];

  useEffect(() => {
    getCompanies(currentPage);
  }, [currentPage]);

  const getCompanyInitial = (company) => {
    const name = company?.name?.trim();
    return name ? name.charAt(0).toUpperCase() : 'C';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Top Companies</h1>
          <p className="text-gray-600 text-lg">
            Explore verified companies hiring now
          </p>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : companiesList.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {companiesList.map((company) => (
                <div
                  key={company?._id || company?.id || Math.random()}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <Link to={`/companies/${company?._id || company?.id || ''}`} className="block">
                    <div className="flex items-center justify-center mb-4 h-20">
                      {company?.logo?.url ? (
                        <img
                          src={company.logo.url}
                          alt={company?.name || 'Company logo'}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                          {getCompanyInitial(company)}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-center mb-2">{company?.name || 'Unnamed Company'}</h3>

                    {company?.location && (
                      <p className="text-gray-600 text-center text-sm flex items-center justify-center gap-1 mb-3">
                        <FaMapMarkerAlt /> {company.location.city || 'Location unavailable'}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm text-center line-clamp-3 mb-4">
                      {company?.description || 'No description available'}
                    </p>
                  </Link>

                  <div className="border-t border-gray-200 pt-4 flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaUsers /> {company?.totalApplications || 0}
                    </span>
                    {company?.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <FaGlobe /> Visit
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="btn-secondary disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              <span>Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="btn-secondary"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-600 text-lg">No companies found</p>
          </div>
        )}
      </div>
    </div>
  );
}
