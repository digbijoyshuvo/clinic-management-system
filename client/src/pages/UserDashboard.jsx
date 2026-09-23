import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] animate-fade-in-up">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-surface-900 mb-2">Welcome to ClinicPro</h1>
        <p className="text-surface-600 text-lg">Your health, our priority. Book appointments and find the best doctors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        <Link to="/user/appointments/book" className="block group">
          <div className="bg-white/70 backdrop-blur-md border border-surface-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 transition-colors duration-300">
              <svg className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Book Appointment</h3>
            <p className="text-surface-500">Request an appointment with your preferred doctor and time.</p>
          </div>
        </Link>

        <Link to="/user/appointments" className="block group">
          <div className="bg-white/70 backdrop-blur-md border border-surface-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-accent-500/10 hover:border-accent-200 transition-all duration-300 transform hover:-translate-y-1 text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-500 transition-colors duration-300">
              <svg className="w-8 h-8 text-accent-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Appointment Status</h3>
            <p className="text-surface-500">View the status of your applications and the assigned reporting times.</p>
          </div>
        </Link>

        <Link to="/user/doctors" className="block group">
          <div className="bg-white/70 backdrop-blur-md border border-surface-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-success-500/10 hover:border-success-200 transition-all duration-300 transform hover:-translate-y-1 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-success-500 transition-colors duration-300">
              <svg className="w-8 h-8 text-success-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Available Doctors</h3>
            <p className="text-surface-500">Browse through our experienced doctors, their specialities, and schedules.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
