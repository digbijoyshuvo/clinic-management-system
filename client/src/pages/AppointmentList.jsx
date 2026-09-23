
import { useState, useEffect } from 'react';
import { getAppointments, approveAppointment, cancelAppointment } from '../api/appointments';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // For receptionist assigning reporting time
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [reportingTime, setReportingTime] = useState('');

  const userString = localStorage.getItem('user');
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {}
  }
  const isReceptionist = user?.role === 'receptionist';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
        fetchAppointments();
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  const handleApproveClick = (appt) => {
    setSelectedAppt(appt);
    setReportingTime(appt.preferredTime || '');
    setIsModalOpen(true);
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    try {
      await approveAppointment(selectedAppt._id, reportingTime);
      setIsModalOpen(false);
      fetchAppointments();
    } catch (err) {
      alert('Failed to approve appointment');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] animate-fade-in-up">
      <h1 className="text-3xl font-bold text-surface-900 mb-2">Appointments</h1>
      <p className="text-surface-600 mb-8">{isReceptionist ? 'Manage all appointment applications' : 'Your appointment history and status'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {appointments.length === 0 ? (
          <p className="text-surface-500 col-span-full text-center py-12">No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt._id} className="bg-white rounded-3xl p-6 shadow-sm border border-surface-200/60 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${appt.status === 'pending' ? 'bg-warning-100 text-warning-700' : 
                    appt.status === 'approved' ? 'bg-success-100 text-success-700' : 
                    appt.status === 'cancelled' ? 'bg-danger-100 text-danger-700' : 'bg-surface-100 text-surface-700'}`}>
                  {appt.status}
                </span>
                <span className="text-surface-500 text-sm font-medium">{new Date(appt.createdAt).toLocaleDateString()}</span>
              </div>
              
              <h3 className="text-xl font-bold text-surface-800 mb-1">{appt.patientName}</h3>
              <p className="text-surface-500 text-sm mb-4">Age: {appt.patientAge} | Phone: {appt.patientPhone}</p>

              {isReceptionist && appt.user && (
                <div className="mb-3 p-2 bg-surface-50 rounded-lg">
                  <p className="text-xs text-surface-500">Submitted by: <span className="font-semibold text-surface-700">{appt.user.name} ({appt.user.email})</span></p>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-surface-700">Doctor</p>
                    <p className="text-sm text-surface-600">{appt.doctor?.name || 'Unknown'}{appt.doctor?.designation ? ` — ${appt.doctor.designation}` : ''}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-primary-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-surface-700">Preferred Date & Time</p>
                    <p className="text-sm text-surface-600">{appt.preferredDate} at {appt.preferredTime}</p>
                  </div>
                </div>

                {appt.status === 'approved' && appt.reportingTime && (
                  <div className="flex items-start gap-2 p-3 bg-success-50 rounded-xl">
                    <svg className="w-5 h-5 text-success-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-success-700">Assigned Reporting Time</p>
                      <p className="text-sm text-success-600 font-bold">{appt.reportingTime}</p>
                    </div>
                  </div>
                )}

                {appt.status === 'pending' && !isReceptionist && (
                  <div className="flex items-start gap-2 p-3 bg-warning-50 rounded-xl">
                    <svg className="w-5 h-5 text-warning-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-warning-700">Reporting Time</p>
                      <p className="text-sm text-warning-600">Not assigned yet</p>
                    </div>
                  </div>
                )}
                
                {appt.reason && (
                  <div className="mt-4 pt-4 border-t border-surface-100">
                    <p className="text-sm font-semibold text-surface-700">Reason</p>
                    <p className="text-sm text-surface-600">{appt.reason}</p>
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-3 pt-4 border-t border-surface-100">
                {isReceptionist && appt.status === 'pending' && (
                  <button onClick={() => handleApproveClick(appt)} className="flex-1 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors font-medium">Approve</button>
                )}
                {appt.status !== 'cancelled' && appt.status !== 'approved' && (
                  <button onClick={() => handleCancel(appt._id)} className="flex-1 py-2 bg-danger-50 text-danger-600 rounded-lg hover:bg-danger-100 transition-colors font-medium">Cancel</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-surface-900">Approve Appointment</h2>
            <p className="text-sm text-surface-600 mb-2">Patient: <span className="font-bold">{selectedAppt?.patientName}</span></p>
            <p className="text-sm text-surface-600 mb-6">User's Preferred Time: <span className="font-bold">{selectedAppt?.preferredTime}</span></p>
            <form onSubmit={handleApproveSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-surface-700 mb-2">Assign Reporting Time</label>
                <input
                  type="time"
                  required
                  value={reportingTime}
                  onChange={(e) => setReportingTime(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-success-600 text-white rounded-xl font-medium hover:bg-success-700 transition-colors">Confirm Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default AppointmentList;