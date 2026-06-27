import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaGlobe, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { useCompanyStore } from '../store/companyStore';

export default function CompanyDetails() {
  const { id } = useParams();
  const { company, getCompanyById, loading, error } = useCompanyStore();
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const data = await getCompanyById(id);
      setCompanyData(data || null);
    };

    fetchCompany();
  }, [id, getCompanyById]);

  useEffect(() => {
    if (company) {
      setCompanyData(company);
    }
  }, [company]);

  const currentCompany = companyData || company;

  if (loading && !currentCompany) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error && !currentCompany) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/companies" className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <FaArrowLeft /> Back to companies
          </Link>
          <div className="rounded-lg bg-white p-8 shadow">
            <h1 className="text-2xl font-bold text-gray-800">Company not found</h1>
            <p className="mt-2 text-gray-600">We could not load details for this company right now.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/companies" className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <FaArrowLeft /> Back to companies
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">{currentCompany?.name || 'Unnamed Company'}</h1>
                <p className="mt-2 text-blue-100">{currentCompany?.industry || 'Industry not listed'}</p>
              </div>
              <div className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
                {currentCompany?.verificationStatus || 'Pending'}
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">About the company</h2>
              <p className="mt-3 text-gray-600 leading-7">
                {currentCompany?.description || 'No company description available yet.'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1 flex items-center gap-2 text-gray-700">
                    <FaMapMarkerAlt /> {currentCompany?.location?.city || 'Location unavailable'}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-500">Company size</p>
                  <p className="mt-1 flex items-center gap-2 text-gray-700">
                    <FaUsers /> {currentCompany?.size || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">Quick info</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li><span className="font-medium text-gray-700">Founded:</span> {currentCompany?.foundedYear || 'Not listed'}</li>
                  <li><span className="font-medium text-gray-700">Applications:</span> {currentCompany?.totalApplications || 0}</li>
                  <li><span className="font-medium text-gray-700">Website:</span> {currentCompany?.website ? (
                    <a href={currentCompany.website} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:text-blue-700">
                      <FaGlobe className="mr-1 inline" /> Visit site
                    </a>
                  ) : 'Not provided'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
