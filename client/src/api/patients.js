import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patients';

const patientsApi = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach JWT token
patientsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getPatients = async (keyword = '') => {
  const response = await patientsApi.get(`/?keyword=${keyword}`);
  return response.data;
};

export const getPatient = async (id) => {
  const response = await patientsApi.get(`/${id}`);
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await patientsApi.post('/', patientData);
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await patientsApi.put(`/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await patientsApi.delete(`/${id}`);
  return response.data;
};

export const addMedicalHistory = async (id, historyData) => {
  const response = await patientsApi.post(`/${id}/history`, historyData);
  return response.data;
};

export default patientsApi;
