import api from './api';

const normalizeStoredUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    _id: user._id || user.id,
  };
};

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const token = response.data?.token;
    const user = normalizeStoredUser(response.data?.data);

    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      ...response.data,
      user,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const token = response.data?.token;
    const user = normalizeStoredUser(response.data?.data);

    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      ...response.data,
      user,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Get current user
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    const user = normalizeStoredUser(response.data?.data);

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
    const user = normalizeStoredUser(response.data?.data);

    // Update stored user data
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const requestPasswordResetOtp = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset OTP:', error);
    throw error;
  }
};

export const resetPassword = async ({ email, otp, password }) => {
  try {
    const response = await api.post('/auth/reset-password', {
      email,
      otp,
      password,
    });
    const token = response.data?.token;
    const user = normalizeStoredUser(response.data?.data);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      ...response.data,
      user,
    };
  } catch (error) {
    console.error('Error resetting password:', error);
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
  return user ? normalizeStoredUser(JSON.parse(user)) : null;
};
