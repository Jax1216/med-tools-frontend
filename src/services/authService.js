import axios from 'axios';

// The base URL for your backend's authentication routes
const API_URL = 'http://localhost:3000/api/v1/auth';

/**
 * --- DEVELOPMENT LOGIN ---
 * This function is modified to always return a successful login for testing purposes.
 * It does NOT send a request to the backend.
 * @param {string} email - The user's email (ignored).
 * @param {string} password - The user's password (ignored).
 * @returns {Promise} - A promise that resolves with a mock user object.
 */

const login = (email, password) => {
  console.warn("--- DEVELOPMENT MODE: Login is being bypassed and will always succeed. ---");

  // This is a mock login that always succeeds.
  // It returns a promise that resolves immediately.
  return new Promise((resolve) => {
    const mockUserData = {
      user: {
        id: 1,
        email: email || "test.user@example.com",
        name: "Test User",
        role: 1 // Assuming 1 is a valid role, like an admin or doctor
      },
      token: "fake-jwt-token-for-testing" // A fake token for the authHeader to use
    };

    // Store the mock user data in localStorage, just like a real login would.
    localStorage.setItem('user', JSON.stringify(mockUserData));
    
    // Resolve the promise with the mock user data.
    resolve(mockUserData);
  });
};


/*
// --- ORIGINAL LOGIN KEEP FOR REAL IMPLEMENTATION---
// The original login function is commented out below.
// You can switch back to this when you want to test with the real backend.

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    // Note: The backend expects 'encrypted_password', but it's just the plain text password from the form.
    encrypted_password: password, 
  }).then(response => {
    // If the login is successful and a token is returned, store it.
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};
*/

/**
 * Handles user logout by removing user data from local storage.
 */
const logout = () => {
  localStorage.removeItem('user');
};

/**
 * Gets the current user's data from local storage.
 * @returns {Object|null} - The parsed user object or null.
 */

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;

