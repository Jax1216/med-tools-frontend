import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:5000/api/visits'; 

const createVisit = (visitData) => {
  return axios.post(`${API_URL}/`, visitData, { headers: authHeader() });
};

const getVisits = (patientId) => {
  const params = patientId ? { patient_id: patientId } : {};
  return axios.get(`${API_URL}/`, { 
    headers: authHeader(), 
    params: params 
  });
};

const visitService = {
  createVisit,
  getVisits,
  getVisitsByPatient: getVisits, 
};

export default visitService;