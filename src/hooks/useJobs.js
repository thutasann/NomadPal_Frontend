import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import jobsService from '../services/jobs.service';
import {
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
} from '../store/slices/jobsSlice';

export const useJobs = () => {
  const dispatch = useDispatch();
  const jobsState = useSelector((state) => state.jobs);

  // Fetch all jobs
  const fetchAllJobs = useCallback(async (params = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await jobsService.getAllJobs(params);
      
      if (response.success && response.data) {
        dispatch(setJobs(response.data.jobs || []));
        
        // Update pagination if provided
        if (response.data.total_jobs !== undefined) {
          dispatch(setPagination({
            total_jobs: response.data.total_jobs,
            total_pages: Math.ceil(response.data.total_jobs / (params.limit || 20)),
            per_page: params.limit || 20
          }));
        }
      }
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch jobs'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch jobs by category
  const fetchJobsByCategory = useCallback(async (categorySlug, params = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await jobsService.getJobsByCategory(categorySlug, params);
      
      if (response.success && response.data) {
        dispatch(setJobs(response.data.jobs || []));
        
        if (response.data.total_jobs !== undefined) {
          dispatch(setPagination({
            total_jobs: response.data.total_jobs,
            total_pages: Math.ceil(response.data.total_jobs / (params.limit || 20)),
            per_page: params.limit || 20
          }));
        }
      }
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch jobs by category'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch jobs by company
  const fetchJobsByCompany = useCallback(async (companyName, params = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await jobsService.getJobsByCompany(companyName, params);
      
      if (response.success && response.data) {
        dispatch(setJobs(response.data.jobs || []));
        
        if (response.data.total_jobs !== undefined) {
          dispatch(setPagination({
            total_jobs: response.data.total_jobs,
            total_pages: Math.ceil(response.data.total_jobs / (params.limit || 20)),
            per_page: params.limit || 20
          }));
        }
      }
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch jobs by company'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Search jobs
  const searchJobs = useCallback(async (keywords, params = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await jobsService.searchJobs(keywords, params);
      
      if (response.success && response.data) {
        dispatch(setSearchResults(response.data.jobs || []));
        
        if (response.data.total_jobs !== undefined) {
          dispatch(setPagination({
            total_jobs: response.data.total_jobs,
            total_pages: Math.ceil(response.data.total_jobs / (params.limit || 20)),
            per_page: params.limit || 20
          }));
        }
      }
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to search jobs'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch latest jobs
  const fetchLatestJobs = useCallback(async (params = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await jobsService.getLatestJobs(params);
      
      if (response.success && response.data) {
        dispatch(setLatestJobs(response.data.jobs || []));
        // Also set as main jobs if no jobs are loaded yet
        if (jobsState.jobs.length === 0) {
          dispatch(setJobs(response.data.jobs || []));
        }
      }
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch latest jobs'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch job categories
  const fetchJobCategories = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await jobsService.getJobCategories();
      
      if (response.success && response.data) {
        dispatch(setCategories(response.data || []));
      }
      
      return response;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch job categories'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Convenience functions
  const getSoftwareJobs = useCallback((params = {}) => {
    return fetchJobsByCategory('software-dev', params);
  }, [fetchJobsByCategory]);

  const getDesignJobs = useCallback((params = {}) => {
    return fetchJobsByCategory('design', params);
  }, [fetchJobsByCategory]);

  const getMarketingJobs = useCallback((params = {}) => {
    return fetchJobsByCategory('marketing', params);
  }, [fetchJobsByCategory]);

  // Filter and pagination helpers
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const changePage = useCallback((page) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const changeLimit = useCallback((limit) => {
    dispatch(setLimit(limit));
  }, [dispatch]);

  const clearAllJobs = useCallback(() => {
    dispatch(clearJobs());
  }, [dispatch]);

  const clearSearchData = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const setJobAsCurrentJob = useCallback((job) => {
    dispatch(setCurrentJob(job));
  }, [dispatch]);

  return {
    // State
    jobs: jobsState.jobs,
    currentJob: jobsState.currentJob,
    latestJobs: jobsState.latestJobs,
    categories: jobsState.categories,
    searchResults: jobsState.searchResults,
    filters: jobsState.filters,
    pagination: jobsState.pagination,
    isLoading: jobsState.isLoading,
    error: jobsState.error,

    // Actions
    fetchAllJobs,
    fetchJobsByCategory,
    fetchJobsByCompany,
    searchJobs,
    fetchLatestJobs,
    fetchJobCategories,
    
    // Convenience functions
    getSoftwareJobs,
    getDesignJobs,
    getMarketingJobs,
    
    // Helpers
    updateFilters,
    clearAllFilters,
    changePage,
    changeLimit,
    clearAllJobs,
    clearSearchData,
    setJobAsCurrentJob,
  };
};