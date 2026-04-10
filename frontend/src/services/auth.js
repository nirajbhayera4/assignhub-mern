import api from './api';

const getStoredToken = () => {
  const token = localStorage.getItem('token');

  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }

  return token;
};

const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const persistToken = (token) => {
  if (!token || typeof token !== 'string') {
    clearStoredAuth();
    throw new Error('Authentication response did not include a valid token.');
  }

  localStorage.setItem('token', token);
};

const persistStoredUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.warn('Failed to persist full user in localStorage, retrying without avatar.', error);

    if (!user) {
      return;
    }

    const fallbackUser = {
      ...user,
      avatar: '',
    };

    localStorage.setItem('user', JSON.stringify(fallbackUser));
  }
};

const normalizeStoredUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    _id: user._id || user.id,
  };
};

export const isProfileComplete = (user) => {
  if (!user) {
    return false;
  }

  const hasName = Boolean(user.name?.trim());
  const hasBio = Boolean(user.bio?.trim());
  const hasCollegeId = Boolean(user.collegeId?.trim());
  const hasSkills = Array.isArray(user.skills)
    ? user.skills.some((skill) => Boolean(skill?.trim()))
    : Boolean(user.skills?.trim());

  return hasName && hasBio && hasCollegeId && hasSkills;
};

export const getPostAuthRedirectPath = (user) => {
  return isProfileComplete(user) ? '/marketplace' : '/profile?setup=1';
};

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const token = response.data?.token;
    const user = normalizeStoredUser(response.data?.data);

    // Store token and user data
    persistToken(token);
    persistStoredUser(user);

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
    persistToken(token);
    persistStoredUser(user);

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
    persistStoredUser(user);

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
    persistStoredUser(user);

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

    persistToken(token);
    persistStoredUser(user);

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
  clearStoredAuth();
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getStoredToken();
};

// Get stored user data
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? normalizeStoredUser(JSON.parse(user)) : null;
};
