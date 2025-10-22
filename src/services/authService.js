import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 
const SYSTEM_URL = 'http://localhost:5000/api';

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password, 
  });
};

const loginMFA = (email, code) => {
  return axios.post(`${API_URL}/mfa`, {
    email,
    code,
  });
};

const register = (email, password, name) => {
  return axios.post(`${API_URL}/register`, {
    email,
    password,
    name,
  });
};

const refresh = () => {
  return axios.post(`${API_URL}/refresh`);
};

const logout = () => {
  return axios.post(`${API_URL}/logout`)
    .catch(error => {
      console.error("Logout server error (token might already be revoked):", error);
    })
    .finally(() => {
      localStorage.removeItem('user');
    });
};

const getHealth = () => {
  return axios.get(`${SYSTEM_URL}/health`);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  login, 
  loginMFA,
  register,
  refresh,
  logout,
  getHealth, 
  getCurrentUser,
};

export default authService;