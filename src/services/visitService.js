import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:3000/api/v1/visit';

/**
 * Creates a new visit record.
 * @param {Object} visitData - The data for the new visit.
 * @returns {Promise} - The axios promise.
 */

const createVisit = (visitData) => {
  return axios.post(`${API_URL}/create`, visitData, { headers: authHeader() });
};

/**
 * Gets all visits for a specific patient.
 * @param {string} patientId - The ID of the patient.
 * @returns {Promise} - The axios promise.
 */

const getVisitsByPatient = (patientId) => {
  return axios.get(`${API_URL}/patient/${patientId}`, { headers: authHeader() });
};

const visitService = {
  createVisit,
  getVisitsByPatient,
};

export default visitService;
