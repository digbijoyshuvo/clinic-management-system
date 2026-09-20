import { useState, useEffect } from 'react';
import { getStaff, createStaff, deleteStaff } from '../api/auth';

const AdminDashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'doctor' });
  const [error, setError] = useState('');

  const fetchStaff = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await createStaff(newStaff);
      setShowAddModal(false);
      setNewStaff({ name: '', email: '', password: '', role: 'doctor' });
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaff(id);
        fetchStaff();
      } catch (err) {
        setError('Failed to delete staff member.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Staff</h3>
          <p className="text-3xl font-bold text-gray-800">{staffList.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-md border-l-4 border-green-500 opacity-70">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-800">--</p>
          <span className="text-xs text-gray-400">Placeholder</span>
        </div>
        <div className="bg-white p-6 rounded shadow-md border-l-4 border-yellow-500 opacity-70">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Appointments</h3>
          <p className="text-3xl font-bold text-gray-800">--</p>
          <span className="text-xs text-gray-400">Placeholder</span>
        </div>
      </div>

      <div className="bg-white rounded shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-700">Staff Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Staff
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">Role</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{staff.name}</td>
                  <td className="p-4 text-gray-600">{staff.email}</td>
                  <td className="p-4 text-gray-600 capitalize">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${staff.role === 'doctor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(staff._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">No staff found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Staff</h2>
            <form onSubmit={handleAddStaff}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded focus:ring focus:border-blue-300"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded focus:ring focus:border-blue-300"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full border px-3 py-2 rounded focus:ring focus:border-blue-300"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  className="w-full border px-3 py-2 rounded focus:ring focus:border-blue-300"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                >
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Save Staff
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
