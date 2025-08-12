import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  currentJob: null,
  filteredJobs: [],
  filters: {
    title: '',
    location: '',
    category: '',
    job_type: '',
    min_salary: null,
    max_salary: null,
    city_id: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
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
    
    // Set all jobs
    setJobs: (state, action) => {
      state.jobs = action.payload;
      state.filteredJobs = action.payload;
      state.pagination.total = action.payload.length;
      state.isLoading = false;
      state.error = null;
    },
    
    // Set current job (for detail view)
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    
    // Add a single job
    addJob: (state, action) => {
      const job = action.payload;
      const existingIndex = state.jobs.findIndex(j => j.id === job.id);
      if (existingIndex >= 0) {
        state.jobs[existingIndex] = job;
      } else {
        state.jobs.push(job);
      }
    },
    
    // Update job data
    updateJob: (state, action) => {
      const { id, updates } = action.payload;
      const jobIndex = state.jobs.findIndex(j => j.id === id);
      if (jobIndex >= 0) {
        state.jobs[jobIndex] = { ...state.jobs[jobIndex], ...updates };
      }
    },
    
    // Remove job
    removeJob: (state, action) => {
      const jobId = action.payload;
      state.jobs = state.jobs.filter(j => j.id !== jobId);
      state.filteredJobs = state.filteredJobs.filter(j => j.id !== jobId);
    },
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredJobs = state.jobs;
      state.pagination.page = 1;
    },
    
    // Apply filters to jobs
    applyFilters: (state) => {
      let filtered = [...state.jobs];
      
      // Title filter
      if (state.filters.title) {
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(state.filters.title.toLowerCase())
        );
      }
      
      // Location filter
      if (state.filters.location) {
        filtered = filtered.filter(job => 
          job.location.toLowerCase().includes(state.filters.location.toLowerCase())
        );
      }
      
      // Category filter
      if (state.filters.category) {
        filtered = filtered.filter(job => 
          job.category === state.filters.category
        );
      }
      
      // Job type filter
      if (state.filters.job_type) {
        filtered = filtered.filter(job => 
          job.job_type === state.filters.job_type
        );
      }
      
      // Salary filters
      if (state.filters.min_salary !== null) {
        filtered = filtered.filter(job => 
          job.min_salary >= state.filters.min_salary
        );
      }
      if (state.filters.max_salary !== null) {
        filtered = filtered.filter(job => 
          job.max_salary <= state.filters.max_salary
        );
      }
      
      // City filter
      if (state.filters.city_id) {
        filtered = filtered.filter(job => 
          job.city_id === state.filters.city_id
        );
      }
      
      state.filteredJobs = filtered;
      state.pagination.total = filtered.length;
      state.pagination.page = 1;
    },
    
    // Pagination
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    
    // Clear jobs data
    clearJobs: (state) => {
      state.jobs = [];
      state.filteredJobs = [];
      state.currentJob = null;
      state.pagination.total = 0;
      state.pagination.page = 1;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setJobs,
  setCurrentJob,
  addJob,
  updateJob,
  removeJob,
  setFilters,
  clearFilters,
  applyFilters,
  setPage,
  setLimit,
  clearJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;
