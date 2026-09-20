import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../api/auth';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const userString = localStorage.getItem('user');
  let user = null;

  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error('Error parsing user', e);
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-primary-500/5' 
        : 'bg-white/60 backdrop-blur-md'
    } border-b border-surface-200/50`}>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-surface-800 tracking-tight">ClinicPro</span>
              <span className="block text-[10px] text-surface-400 font-medium tracking-wider uppercase -mt-1">Management System</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/admin/dashboard')
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Manage Staff
                    </span>
                  </Link>
                )}
                {user.role === 'doctor' && (
                  <span className="px-4 py-2 rounded-lg text-sm font-medium text-surface-400 cursor-not-allowed flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Appointments
                  </span>
                )}
                {user.role === 'receptionist' && (
                  <span className="px-4 py-2 rounded-lg text-sm font-medium text-surface-400 cursor-not-allowed flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Manage Patients
                  </span>
                )}

                <div className="w-px h-8 bg-surface-200 mx-2"></div>

                {/* User badge */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/20">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-surface-700 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-surface-400 capitalize">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all duration-200"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/login')
                      ? 'text-primary-700'
                      : 'text-surface-600 hover:text-surface-800'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
