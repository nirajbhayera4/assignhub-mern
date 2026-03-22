import api from './api';

// Get user wallet data
export const getWallet = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/wallet`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet:', error);
    throw error;
  }
};

// Get user transactions
export const getTransactions = async (userId, params = {}) => {
  try {
    const response = await api.get(`/users/${userId}/transactions`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Process withdrawal
export const processWithdrawal = async (userId, withdrawalData) => {
  try {
    const response = await api.post(`/users/${userId}/withdraw`, withdrawalData);
    return response.data;
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};