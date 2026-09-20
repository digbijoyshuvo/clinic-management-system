import { useState, useEffect } from 'react';
import { getStaff, createStaff, updateStaff, deleteStaff } from '../api/auth';

const AdminDashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'doctor' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStaff = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch (err) {
      setError('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Auto-dismiss success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: '', email: '', password: '', role: 'doctor' });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({ name: staff.name, email: staff.email, password: '', role: staff.role });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const updateData = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) updateData.password = formData.password;
        await updateStaff(editingStaff._id, updateData);
        setSuccessMsg('Staff member updated successfully!');
      } else {
        await createStaff(formData);
        setSuccessMsg('Staff member added successfully!');
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        await deleteStaff(id);
        setSuccessMsg(`${name} has been removed.`);
        fetchStaff();
      } catch (err) {
        setError('Failed to delete staff member.');
      }
    }
  };

  const doctorCount = staffList.filter(s => s.role === 'doctor').length;
  const receptionistCount = staffList.filter(s => s.role === 'receptionist').length;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-surface-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-surface-50 via-primary-50/20 to-surface-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-surface-800">Admin Dashboard</h1>
          <p className="text-surface-500 mt-1">Manage your clinic's staff members and resources</p>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl flex items-center gap-3 animate-slide-down">
            <svg className="w-5 h-5 text-accent-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-accent-600 font-medium">{successMsg}</p>
          </div>
        )}

        {/* Error Message */}
        {error && !showModal && (
          <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl flex items-center gap-3 animate-slide-down">
            <svg className="w-5 h-5 text-danger-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-danger-600">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* Total Staff */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-surface-900/5 border border-surface-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-surface-800">{staffList.length}</p>
            <p className="text-sm text-surface-500 font-medium mt-1">Total Staff</p>
          </div>

          {/* Doctors */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-surface-900/5 border border-surface-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-surface-800">{doctorCount}</p>
            <p className="text-sm text-surface-500 font-medium mt-1">Doctors</p>
          </div>

          {/* Receptionists */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-surface-900/5 border border-surface-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-400 to-warning-500 rounded-xl flex items-center justify-center shadow-lg shadow-warning-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-surface-800">{receptionistCount}</p>
            <p className="text-sm text-surface-500 font-medium mt-1">Receptionists</p>
          </div>

          {/* Placeholder */}
          <div className="bg-white/60 rounded-2xl p-6 shadow-lg shadow-surface-900/5 border border-dashed border-surface-300 hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-surface-400">--</p>
            <p className="text-sm text-surface-400 font-medium mt-1">Appointments</p>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-surface-900/5 border border-surface-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-surface-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-surface-800">Staff Members</h2>
              <p className="text-sm text-surface-500 mt-0.5">A list of all doctors and receptionists</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Staff
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50/80">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Member</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Role</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-primary-50/30 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${
                          staff.role === 'doctor'
                            ? 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-accent-500/20'
                            : 'bg-gradient-to-br from-warning-400 to-warning-500 shadow-warning-500/20'
                        }`}>
                          {staff.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-surface-800">{staff.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-surface-500 text-sm">{staff.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        staff.role === 'doctor'
                          ? 'bg-accent-500/10 text-accent-600'
                          : 'bg-warning-400/15 text-warning-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          staff.role === 'doctor' ? 'bg-accent-500' : 'bg-warning-500'
                        }`}></span>
                        {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(staff)}
                          className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(staff._id, staff.name)}
                          className="p-2 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all duration-200"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {staffList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-surface-500 font-medium">No staff members yet</p>
                        <p className="text-surface-400 text-sm mt-1">Click "Add Staff" to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-surface-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-surface-100 flex justify-between items-center bg-surface-50/50">
              <div>
                <h2 className="text-lg font-bold text-surface-800">
                  {editingStaff ? 'Edit Staff Member' : 'Add New Staff'}
                </h2>
                <p className="text-sm text-surface-500 mt-0.5">
                  {editingStaff ? 'Update the information below' : 'Fill in the details to add a new member'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && showModal && (
                <div className="p-3 bg-danger-500/10 border border-danger-500/20 rounded-xl">
                  <p className="text-sm text-danger-600">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  placeholder="jane@clinic.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">
                  Password {editingStaff && <span className="text-surface-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  placeholder={editingStaff ? '••••••••' : 'Create a password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingStaff}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Role</label>
                <select
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-surface-200 text-surface-600 font-semibold rounded-xl hover:bg-surface-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all duration-300"
                >
                  {editingStaff ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
