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

export const createAppointment = (data) =>
  API.post('/appointments', data);

export const approveAppointment = (id, reportingTime) =>
  API.put(`/appointments/${id}/approve`, { reportingTime });

export const cancelAppointment = (id) =>
  API.put(`/appointments/${id}/cancel`);

export default API;