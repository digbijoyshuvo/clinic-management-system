
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export const getAppointments = (filters = {}) =>
 API.get('/appointments', { params: filters });

export const getDoctorAppointments = (doctorId) =>
  API.get(`/appointments/doctor/${doctorId}`);

export const createAppointment = (data) =>
  API.post('/appointments', data);

export const approveAppointment = (id, reportingTime) =>
  API.put(`/appointments/${id}/approve`, { reportingTime });

export const updateAppointment = (id, data) =>
  API.put(`/appointments/${id}`, data);

export const cancelAppointment = (id) =>
  API.put(`/appointments/${id}/cancel`);

export const completeAppointment = (id) =>
  API.put(`/appointments/${id}/complete`);

export const getPatients = () =>
  API.get('/patients');

export const getDoctors = () =>
  API.get('/appointments/doctors');
export default API;