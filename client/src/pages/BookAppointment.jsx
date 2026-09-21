
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createAppointment,
  getPatients,
  getDoctors
} from '../api/appointments';

function BookAppointment() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });
  const [message, setMessage] = useState('');

 useEffect(() => {
  const loadData = async () => {
    try {
      const patientRes = await getPatients();
      const doctorRes = await getDoctors();

      setPatients(patientRes.data);
      setDoctors(doctorRes.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Failed to load patients or doctors'
      );
    }
  };

  loadData();
}, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await createAppointment(form);
      setMessage('Appointment booked successfully');
      setForm({
        patient: '',
        doctor: '',
        date: '',
        time: '',
        reason: ''
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to book appointment'
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Book Appointment
      </h1>

      {message && (
        <p className="mb-4 text-blue-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="patient"
          value={form.patient}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Patient</option>

          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name}
            </option>
          ))}
        </select>

        <select
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Doctor</option>

           {doctors.map((doctor) => (
             <option key={doctor._id} value={doctor._id}>
               {doctor.name}
             </option>
           ))}
        </select>

        <input
          type="text"
          name="doctor"
          placeholder="Doctor ID"
          value={form.doctor}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="reason"
          placeholder="Reason for appointment"
          value={form.reason}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;