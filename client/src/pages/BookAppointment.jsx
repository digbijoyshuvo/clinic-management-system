import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAppointment } from '../api/appointments';
import { getDoctors } from '../api/doctors';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: '',
    preferredDate: '',
    preferredTime: '',
    patientName: '',
    patientAge: '',
    patientPhone: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error('Failed to load doctors', err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const submitData = {
        ...formData,
        patientAge: Number(formData.patientAge)
      };
      await createAppointment(submitData);
      setSuccess('Appointment booked successfully! Redirecting...');
      setTimeout(() => navigate('/user/appointments'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-[calc(100vh-64px)] animate-fade-in-up">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-surface-200/60">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Book an Appointment</h1>
        <p className="text-surface-600 mb-8">Please fill in your details and preferred time. The receptionist will review and assign your reporting time.</p>

        {error && (
          <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-danger-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-success-500/10 border border-success-500/20 rounded-xl text-success-600">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Patient Name</label>
              <input type="text" name="patientName" required value={formData.patientName} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" placeholder="Enter patient name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Patient Age</label>
              <input type="number" name="patientAge" required min="0" max="150" value={formData.patientAge} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" placeholder="Age" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Patient Phone</label>
            <input type="tel" name="patientPhone" required value={formData.patientPhone} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" placeholder="Enter phone number" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Select Doctor</label>
            <select name="doctor" required value={formData.doctor} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none appearance-none">
              <option value="">-- Select a Doctor --</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name} — {doc.speciality}</option>
              ))}
            </select>
            {doctors.length === 0 && (
              <p className="text-xs text-warning-600 mt-1">No doctors available. Ask the receptionist to add doctors first.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Preferred Date</label>
              <input type="date" name="preferredDate" required value={formData.preferredDate} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Preferred Time</label>
              <input type="time" name="preferredTime" required value={formData.preferredTime} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" />
              <p className="text-xs text-surface-500 mt-1">This is only a preference. The receptionist will assign the exact reporting time.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Reason for visit (optional)</label>
            <textarea name="reason" rows="3" value={formData.reason} onChange={handleChange} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" placeholder="Describe the reason for your visit"></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors disabled:opacity-60">
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;