import axiosInstance from './auth';

export const getDoctors = async () => {
  const response = await axiosInstance.get('/doctors');
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await axiosInstance.get(`/doctors/${id}`);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await axiosInstance.post('/doctors', doctorData);
  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await axiosInstance.put(`/doctors/${id}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await axiosInstance.delete(`/doctors/${id}`);
  return response.data;
};
