import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  currentJob: null,
  latestJobs: [],
  categories: [],
  searchResults: [],
  filters: {
    category: '',
    company_name: '',
    search: '',
    limit: 20
  },
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_jobs: 0,
    per_page: 20,
    has_next_page: false,
    has_prev_page: false
  },
  isLoading: false,
  error: null
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
    
    // Set jobs data
    setJobs: (state, action) => {
      state.jobs = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addJobs: (state, action) => {
      const newJobs = action.payload;
      const existingIds = new Set(state.jobs.map(job => job.id));
      
      // Only add jobs that don't already exist
      const uniqueNewJobs = newJobs.filter(job => !existingIds.has(job.id));
      state.jobs = [...state.jobs, ...uniqueNewJobs];
      state.isLoading = false;
      state.error = null;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    
    // Set latest jobs
    setLatestJobs: (state, action) => {
      state.latestJobs = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Set job categories
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Set search results
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    
    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Pagination
    setPage: (state, action) => {
      state.pagination.current_page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.per_page = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Clear all jobs data
    clearJobs: (state) => {
      state.jobs = [];
      state.latestJobs = [];
      state.searchResults = [];
      state.currentJob = null;
      state.pagination = initialState.pagination;
      state.filters = initialState.filters;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setJobs,
  addJobs,
  setCurrentJob,
  setLatestJobs,
  setCategories,
  setSearchResults,
  clearSearchResults,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  setPagination,
  clearJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;
