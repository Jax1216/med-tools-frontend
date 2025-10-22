import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:5000/api/patients'; 

const listPatients = (params = {}) => {
  return axios.get(`${API_URL}/`, { 
    headers: authHeader(), 
    params: params 
  });
};

const getPatientById = (patientId) => {
  return axios.get(`${API_URL}/${patientId}`, { headers: authHeader() });
};

const createPatient = (patientData) => {
  return axios.post(`${API_URL}/`, patientData, { headers: authHeader() });
};

const updatePatient = (patientId, updateData) => {
  return axios.put(`${API_URL}/${patientId}`, updateData, { headers: authHeader() });
};

const deletePatient = (patientId) => {
  return axios.delete(`${API_URL}/${patientId}`, { headers: authHeader() });
};

const patientService = {
  listPatients, 
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients: listPatients, 
};

export default patientService;