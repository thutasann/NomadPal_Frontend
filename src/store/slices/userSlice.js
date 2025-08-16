import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Basic user info
  id: null,
  email: null,
  display_name: null,
  created_at: null,
  
  // Profile preferences
  preferred_language: null,
  country_city: null,
  timezone: null,
  passport: null,
  visa_flexibility: null,
  preferred_regions: null,
  
  // Job preferences
  job_title: null,
  target_salary_usd: null,
  salary_currency: 'USD',
  sources: null,
  work_style: null,
  
  // Budget preferences
  monthly_budget_min_usd: null,
  monthly_budget_max_usd: null,
  
  // Lifestyle preferences
  preferred_climate: null,
  internet_speed_requirement: null,
  lifestyle_priorities: [],
  
  // Consent
  newsletter_consent: false,
  research_consent: false,
  
  // Saved items
  saved_cities: [],
  saved_jobs: [],
  
  // UI state
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Set complete user profile
    setUserProfile: (state, action) => {
      const userData = action.payload;
      Object.keys(userData).forEach(key => {
        if (key in state) {
          state[key] = userData[key];
        }
      });
      state.isLoading = false;
      state.error = null;
    },
    
    // Update specific user fields
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      if (field in state) {
        state[field] = value;
      }
    },
    
    // Update multiple user fields
    updateUserFields: (state, action) => {
      const updates = action.payload;
      Object.keys(updates).forEach(key => {
        if (key in state) {
          state[key] = updates[key];
        }
      });
    },
    
    // Clear user data
    clearUser: (state) => {
      Object.keys(initialState).forEach(key => {
        if (key !== 'isLoading' && key !== 'error') {
          state[key] = initialState[key];
        }
      });
    },
    

    setSavedCities: (state, action) => {
      state.saved_cities = action.payload;
    },
    
    // Saved jobs management
    addSavedJob: (state, action) => {
      const { jobId, status = 'Interested' } = action.payload;
      const existingIndex = state.saved_jobs.findIndex(job => job.jobId === jobId);
      if (existingIndex >= 0) {
        state.saved_jobs[existingIndex].status = status;
      } else {
        state.saved_jobs.push({ jobId, status });
      }
    },
    removeSavedJob: (state, action) => {
      const jobId = action.payload;
      state.saved_jobs = state.saved_jobs.filter(job => job.jobId !== jobId);
    },
    updateSavedJobStatus: (state, action) => {
      const { jobId, status } = action.payload;
      const job = state.saved_jobs.find(job => job.jobId === jobId);
      if (job) {
        job.status = status;
      }
    },
    setSavedJobs: (state, action) => {
      state.saved_jobs = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setUserProfile,
  updateUserField,
  updateUserFields,
  clearUser,
  setSavedCities,
  addSavedJob,
  removeSavedJob,
  updateSavedJobStatus,
  setSavedJobs,
} = userSlice.actions;

export default userSlice.reducer;
