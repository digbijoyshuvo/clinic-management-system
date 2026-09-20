import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

// Admin API
export const getStaff = async () => {
  const response = await axiosInstance.get('/admin/staff');
  return response.data;
};

export const createStaff = async (staffData) => {
  const response = await axiosInstance.post('/admin/staff', staffData);
  return response.data;
};

export const updateStaff = async (id, staffData) => {
  const response = await axiosInstance.put(`/admin/staff/${id}`, staffData);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await axiosInstance.delete(`/admin/staff/${id}`);
  return response.data;
};

export default axiosInstance;
