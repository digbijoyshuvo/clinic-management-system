import { useState, useEffect } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../api/doctors';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states for Receptionist
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    speciality: '',
    education: '',
    experience: '',
    availableSchedule: '',
    contactInformation: ''
  });

  const userString = localStorage.getItem('user');
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {}
  }
  
  const isReceptionist = user?.role === 'receptionist';

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getDoctors();
      setDoctors(data);
    } catch (err) {
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        designation: doctor.designation,
        speciality: doctor.speciality,
        education: doctor.education,
        experience: doctor.experience,
        availableSchedule: doctor.availableSchedule,
        contactInformation: doctor.contactInformation
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '', designation: '', speciality: '', education: '', experience: '', availableSchedule: '', contactInformation: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor._id, formData);
      } else {
        await createDoctor(formData);
      }
      setIsModalOpen(false);
      fetchDoctors();
    } catch (err) {
      alert('Failed to save doctor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        fetchDoctors();
      } catch (err) {
        alert('Failed to delete doctor');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading doctors...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Doctors</h1>
          <p className="text-surface-600 mt-1">{isReceptionist ? 'Manage clinic doctors' : 'Our experienced specialists'}</p>
        </div>
        {isReceptionist && (
          <button 
            onClick={() => handleOpenModal()} 
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-colors"
          >
            Add Doctor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div key={doc._id} className="bg-white rounded-3xl p-6 shadow-sm border border-surface-200/60 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
            <div className="w-24 h-24 rounded-full mb-4 shadow-md bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-800">{doc.name}</h3>
            <p className="text-primary-600 font-medium mb-1">{doc.speciality}</p>
            <p className="text-surface-500 text-sm mb-4">{doc.designation}</p>
            
            <div className="text-left w-full space-y-2 mb-6">
              <p className="text-sm"><span className="font-semibold text-surface-700">Education:</span> {doc.education}</p>
              <p className="text-sm"><span className="font-semibold text-surface-700">Experience:</span> {doc.experience}</p>
              <p className="text-sm"><span className="font-semibold text-surface-700">Schedule:</span> {doc.availableSchedule}</p>
              {isReceptionist && (
                <p className="text-sm"><span className="font-semibold text-surface-700">Contact:</span> {doc.contactInformation}</p>
              )}
            </div>

            {isReceptionist && (
              <div className="mt-auto flex gap-3 w-full">
                <button onClick={() => handleOpenModal(doc)} className="flex-1 py-2 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors font-medium">Edit</button>
                <button onClick={() => handleDelete(doc._id)} className="flex-1 py-2 bg-danger-50 text-danger-600 rounded-lg hover:bg-danger-100 transition-colors font-medium">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-surface-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                    value={formData[key]}
                    onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                  />
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
