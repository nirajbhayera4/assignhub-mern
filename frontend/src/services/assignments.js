import api from './api';

// Get all assignments with optional filters
export const getAssignments = async (params = {}) => {
  try {
    const response = await api.get('/assignments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

// Get single assignment by ID
export const getAssignment = async (id) => {
  try {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    throw error;
  }
};

// Create new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

// Update assignment
export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};

// Delete assignment
export const deleteAssignment = async (id) => {
  try {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};

// Apply to assignment
export const applyToAssignment = async (id, applicationData) => {
  try {
    const response = await api.post(`/assignments/${id}/apply`, applicationData);
    return response.data;
  } catch (error) {
    console.error('Error applying to assignment:', error);
    throw error;
  }
};

// Get assignments by provider
export const getProviderAssignments = async (providerId) => {
  try {
    const response = await api.get(`/assignments?provider=${providerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provider assignments:', error);
    throw error;
  }
};