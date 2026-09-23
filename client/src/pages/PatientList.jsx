import { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../api/patients';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', phone: '', address: ''
  });

  // Detail view
  const [viewPatient, setViewPatient] = useState(null);
  const fetchPatients = async (searchKeyword = '') => {
    try {
      setLoading(true);
      const data = await getPatients(searchKeyword);
      setPatients(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(keyword);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        setPatients(patients.filter((p) => p._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete patient');
      }
    }
  };

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address
      });
    } else {
      setEditingPatient(null);
      setFormData({ name: '', age: '', gender: 'Male', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, age: Number(formData.age) };
      if (editingPatient) {
        await updatePatient(editingPatient._id, submitData);
      } else {
        await createPatient(submitData);
      }
      setIsModalOpen(false);
      fetchPatients(keyword);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save patient');
    }
  };

  if (loading && patients.length === 0) {
    return <div className="p-8 text-center text-surface-500">Loading patients...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Patient Management</h1>
          <p className="text-surface-600 mt-1">View, add, edit, and manage patient records</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:bg-primary-700 transition-colors"
        >
          + Add Patient
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-danger-600">
          {error}
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-md shadow-sm rounded-2xl p-6 mb-6 border border-surface-200/60">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-surface-100 hover:bg-surface-200 text-surface-800 font-semibold rounded-xl border border-surface-200 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="bg-white/70 backdrop-blur-md shadow-sm overflow-hidden rounded-2xl border border-surface-200/60">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Age / Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-100">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-surface-800">{patient.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-surface-600">
                    {patient.age} / {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-surface-600">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-surface-600 max-w-[200px] truncate">
                    {patient.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => setViewPatient(patient)} className="text-primary-600 hover:text-primary-800 font-semibold">View</button>
                    <button onClick={() => handleOpenModal(patient)} className="text-accent-600 hover:text-accent-800 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(patient._id)} className="text-danger-600 hover:text-danger-800 font-semibold">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-surface-500">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-surface-900">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Full Name</label>
                <input type="text" required className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1">Age</label>
                  <input type="number" required min="0" max="150" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1">Gender</label>
                  <select className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none appearance-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Phone</label>
                <input type="tel" required className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Address</label>
                <input type="text" required className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">{editingPatient ? 'Update Patient' : 'Add Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-surface-900">Patient Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-surface-100">
                <span className="font-semibold text-surface-600">Name</span>
                <span className="text-surface-800">{viewPatient.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-100">
                <span className="font-semibold text-surface-600">Age</span>
                <span className="text-surface-800">{viewPatient.age}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-100">
                <span className="font-semibold text-surface-600">Gender</span>
                <span className="text-surface-800">{viewPatient.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-100">
                <span className="font-semibold text-surface-600">Phone</span>
                <span className="text-surface-800">{viewPatient.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-100">
                <span className="font-semibold text-surface-600">Address</span>
                <span className="text-surface-800">{viewPatient.address}</span>
              </div>
              {viewPatient.registeredBy && (
                <div className="flex justify-between py-2 border-b border-surface-100">
                  <span className="font-semibold text-surface-600">Registered By</span>
                  <span className="text-surface-800">{viewPatient.registeredBy.name || viewPatient.registeredBy.email}</span>
                </div>
              )}
              {viewPatient.medicalHistory && viewPatient.medicalHistory.length > 0 && (
                <div className="pt-3">
                  <h3 className="font-semibold text-surface-700 mb-2">Medical History</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {viewPatient.medicalHistory.map((entry, i) => (
                      <div key={i} className="p-3 bg-surface-50 rounded-lg">
                        <p className="text-sm text-surface-700">{entry.note}</p>
                        <p className="text-xs text-surface-400 mt-1">{new Date(entry.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setViewPatient(null)} className="w-full mt-6 py-2.5 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
