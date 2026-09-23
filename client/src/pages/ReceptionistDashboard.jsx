import { Link } from 'react-router-dom';

const ReceptionistDashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-surface-900 mb-2">Receptionist Dashboard</h1>
        <p className="text-surface-600 text-lg">Manage clinic operations, appointments, and patients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/receptionist/appointments" className="block group">
          <div className="bg-white/70 backdrop-blur-md border border-surface-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 transition-colors duration-300">
              <svg className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Appointment Applications</h3>
            <p className="text-surface-500">Review user applications, approve appointments, and assign reporting times.</p>
          </div>
        </Link>

        <Link to="/receptionist/patients" className="block group">
          <div className="bg-white/70 backdrop-blur-md border border-surface-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-accent-500/10 hover:border-accent-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-500 transition-colors duration-300">
              <svg className="w-7 h-7 text-accent-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Patient Management</h3>
            <p className="text-surface-500">Add, edit, view, and delete patient records and medical history.</p>
          </div>
        </Link>

        <Link to="/receptionist/doctors" className="block group">
          <div className="bg-white/70 backdrop-blur-md border border-surface-200/60 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-success-500/10 hover:border-success-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-success-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-success-500 transition-colors duration-300">
              <svg className="w-7 h-7 text-success-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Doctor Management</h3>
            <p className="text-surface-500">Manage doctors' profiles, schedules, and information displayed to users.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
