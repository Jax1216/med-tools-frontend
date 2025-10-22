import authService from './authService';

const authHeader = () => {
  const user = authService.getCurrentUser();

  if (user && user.token) {
    return {};
  }
  return {};
};

export default authHeader;