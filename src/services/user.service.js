import { apiClient } from "./apiClient";

// Get user profile
async function getProfile() {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Update user profile
async function updateProfile(profileData) {
  try {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get saved cities
async function getSavedCities() {
  try {
    const response = await apiClient.get('/users/saved-cities');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get saved jobs
async function getSavedJobs() {
  try {
    const response = await apiClient.get('/users/saved-jobs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Save job
async function saveJob(jobId, status = 'Interested') {
  try {
    const response = await apiClient.post('/users/saved-jobs', { job_id: jobId, status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Update saved job status
async function updateSavedJobStatus(jobId, status) {
  try {
    const response = await apiClient.put(`/users/saved-jobs/${jobId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Remove saved job
async function removeSavedJob(jobId) {
  try {
    const response = await apiClient.delete(`/users/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

const userService = {
  getProfile,
  updateProfile,
  getSavedCities,
  getSavedJobs,
  saveJob,
  updateSavedJobStatus,
  removeSavedJob,
};

export default userService;