import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
// Split imports: FA5 for standard icons, FA6 for the columns icon
import { FaUser, FaBriefcase } from 'react-icons/fa';
import { FaBuildingColumns } from 'react-icons/fa6';

export default function Navigation() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
                Jobs
              </Link>
              <Link to="/companies" className="text-gray-700 hover:text-blue-600">
                Companies
              </Link>
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn-secondary">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
                Jobs
              </Link>
              <Link to="/companies" className="text-gray-700 hover:text-blue-600">
                Companies
              </Link>

              {user.role === 'candidate' && (
                <Link to="/applications" className="text-gray-700 hover:text-blue-600 flex items-center gap-2">
                  <FaUser /> Applications
                </Link>
              )}

              {user.role === 'recruiter' && (
                <Link to="/recruiter" className="text-gray-700 hover:text-blue-600 flex items-center gap-2">
                  <FaBriefcase /> Recruiter
                </Link>
              )}

              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 flex items-center gap-2">
                  <FaBuildingColumns /> Admin
                </Link>
              )}

              <div className="flex items-center gap-4">
                <span className="text-gray-700">{user.name}</span>
                <Link to="/profile" className="text-blue-600 hover:text-blue-700">
                  <FaUser />
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-danger text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}