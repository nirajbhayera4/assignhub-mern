import api from './api';

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;

    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;

    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Get current user
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    const user = response.data;

    // Update stored user data
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Update user details
export const updateUserDetails = async (userData) => {
  try {
    const response = await api.put('/auth/updatedetails', userData);
    const user = response.data;

    // Update stored user data
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get stored user data
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};