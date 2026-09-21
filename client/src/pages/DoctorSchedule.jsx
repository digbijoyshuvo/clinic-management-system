import { useEffect, useState } from 'react';
import {
  getDoctorAppointments,
  completeAppointment
} from '../api/appointments';

function DoctorSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const loadAppointments = async () => {
    try {
      const res = await getDoctorAppointments(user._id);
      setAppointments(res.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to load appointments'
      );
    }
  };

  useEffect(() => {
    if (user?._id) {
      loadAppointments();
    }
  }, []);

  const handleComplete = async (id) => {
    try {
      await completeAppointment(id);
      setMessage('Appointment marked as completed');
      loadAppointments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to complete appointment'
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Doctor Schedule
      </h1>

      {message && (
        <p className="mb-4 text-blue-600">
          {message}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Patient</th>
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
                  colSpan="6"
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
                          handleComplete(appointment._id)
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Complete
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

export default DoctorSchedule;