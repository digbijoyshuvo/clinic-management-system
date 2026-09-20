import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  let user = null;

  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error('Error parsing user', e);
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Clinic Management
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="hover:text-gray-200">
                  Manage Staff
                </Link>
              )}
              {user.role === 'doctor' && (
                <a href="#" className="hover:text-gray-200 cursor-not-allowed text-gray-300" title="Placeholder">
                  My Appointments
                </a>
              )}
              {user.role === 'receptionist' && (
                <a href="#" className="hover:text-gray-200 cursor-not-allowed text-gray-300" title="Placeholder">
                  Manage Patients
                </a>
              )}
              <div className="border-l border-blue-400 h-6 mx-2"></div>
              <span className="font-semibold">{user.name} ({user.role})</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition-colors">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
