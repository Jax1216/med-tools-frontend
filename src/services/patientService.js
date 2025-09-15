import axios from 'axios';
import authHeader from './authHeader'; // Helper to get the auth token

const API_URL = 'http://localhost:3000/api/v1/patient';

/**
 * Searches for patients based on query parameters.
 * @param {Object} params - The search criteria (e.g., { first_name: 'Bruce' }).
 * @returns {Promise} - The axios promise.
 */

const searchPatients = (params) => {
  return axios.get(`${API_URL}/search`, { 
    headers: authHeader(), 
    params: params 
  });
};

/**
 * Retrieves a single patient by their ID.
 * @param {string} id - The patient's ID.
 * @returns {Promise} - The axios promise.
 */

const getPatientById = (id) => {
  return axios.get(`${API_URL}/id/${id}`, { headers: authHeader() });
};

const patientService = {
  searchPatients,
  getPatientById,
};

export default patientService;
