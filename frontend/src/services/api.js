import axios from 'axios';

const API_URL = '/api';

// Configure axios
// Use environment variable if provided, otherwise let Vite proxy handle requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Patients API
export const patientsAPI = {
  getAll: () => axios.get(`${API_URL}/patients`),
  getById: (id) => axios.get(`${API_URL}/patients/${id}`),
  create: (data) => axios.post(`${API_URL}/patients`, data),
  update: (id, data) => axios.put(`${API_URL}/patients/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/patients/${id}`),
  search: (query) => axios.get(`${API_URL}/patients/search?search=${query}`),
  getMedicalHistory: (id) => axios.get(`${API_URL}/patients/${id}/medical-history`)
};

// Doctors API
export const doctorsAPI = {
  getAll: () => axios.get(`${API_URL}/doctors`),
  getById: (id) => axios.get(`${API_URL}/doctors/${id}`),
  create: (data) => axios.post(`${API_URL}/doctors`, data),
  update: (id, data) => axios.put(`${API_URL}/doctors/${id}`, data),
  getBySpecialization: (spec) => axios.get(`${API_URL}/doctors/specialization/${spec}`),
  getAppointments: (id, params) => axios.get(`${API_URL}/doctors/${id}/appointments`, { params })
};

// Appointments API
export const appointmentsAPI = {
  getAll: (params) => axios.get(`${API_URL}/appointments`, { params }),
  getById: (id) => axios.get(`${API_URL}/appointments/${id}`),
  create: (data) => axios.post(`${API_URL}/appointments`, data),
  update: (id, data) => axios.put(`${API_URL}/appointments/${id}`, data),
  cancel: (id, data) => axios.put(`${API_URL}/appointments/${id}/cancel`, data),
  getUpcoming: (params) => axios.get(`${API_URL}/appointments/upcoming`, { params })
};

// Prescriptions API
export const prescriptionsAPI = {
  getAll: () => axios.get(`${API_URL}/prescriptions`),
  getById: (id) => axios.get(`${API_URL}/prescriptions/${id}`),
  create: (data) => axios.post(`${API_URL}/prescriptions`, data),
  getByPatient: (patientId) => axios.get(`${API_URL}/prescriptions/patient/${patientId}`)
};

// Medical Records API
export const medicalRecordsAPI = {
  getAll: () => axios.get(`${API_URL}/medical-records`),
  getById: (id) => axios.get(`${API_URL}/medical-records/${id}`),
  create: (data) => axios.post(`${API_URL}/medical-records`, data),
  update: (id, data) => axios.put(`${API_URL}/medical-records/${id}`, data),
  getByPatient: (patientId) => axios.get(`${API_URL}/medical-records/patient/${patientId}`)
};

// Lab Tests API
export const labTestsAPI = {
  getAll: (params) => axios.get(`${API_URL}/lab-tests`, { params }),
  getById: (id) => axios.get(`${API_URL}/lab-tests/${id}`),
  create: (data) => axios.post(`${API_URL}/lab-tests`, data)
};

// Invoices API
export const invoicesAPI = {
  getAll: (params) => axios.get(`${API_URL}/invoices`, { params }),
  getById: (id) => axios.get(`${API_URL}/invoices/${id}`),
  create: (data) => axios.post(`${API_URL}/invoices`, data)
};

export default {
  patients: patientsAPI,
  doctors: doctorsAPI,
  appointments: appointmentsAPI,
  prescriptions: prescriptionsAPI,
  medicalRecords: medicalRecordsAPI,
  labTests: labTestsAPI,
  invoices: invoicesAPI
};
