import { useEffect, useState } from 'react';
import {
  getAppointments,
  cancelAppointment
} from '../api/appointments';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    doctor: '',
    status: ''
  });
  const [message, setMessage] = useState('');

  const loadAppointments = async () => {
    try {
      const res = await getAppointments(filters);
      setAppointments(res.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to load appointments'
      );
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await cancelAppointment(id);
      setMessage('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to cancel appointment'
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Appointment List
      </h1>

      {message && (
        <p className="mb-4 text-blue-600">
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="doctor"
          placeholder="Doctor ID"
          value={filters.doctor}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Patient</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="border p-4 text-center"
                >
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="border p-2">
                    {appointment.patient?.name}
                  </td>

                  <td className="border p-2">
                    {appointment.doctor?.name}
                  </td>

                  <td className="border p-2">
                    {appointment.date}
                  </td>

                  <td className="border p-2">
                    {appointment.time}
                  </td>

                  <td className="border p-2">
                    {appointment.reason}
                  </td>

                  <td className="border p-2">
                    {appointment.status}
                  </td>

                  <td className="border p-2">
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() =>
                          handleCancel(appointment._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentList;