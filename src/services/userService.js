import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:5000/api/users';

const listUsers = () => {
  return axios.get(`${API_URL}/`, { headers: authHeader() });
};

const userService = {
  listUsers,
};

export default userService;