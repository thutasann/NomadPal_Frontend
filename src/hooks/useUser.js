import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setUserProfile, 
  updateUserFields, 
  addSavedJob, 
  removeSavedJob, 
  updateSavedJobStatus,
  setLoading,
  setError,
  clearError
} from '../store/slices/userSlice';
import userService from '../services/user.service';
import { toast } from 'react-hot-toast';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const { token } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  // Load user profile from API
  const loadProfile = useCallback(async () => {
    if (!token) {
      console.log('No token available, skipping profile load');
      return;
    }
    
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await userService.getProfile();
      dispatch(setUserProfile(response.data));
      
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error.message === 'Failed to fetch') {
        // Network error - backend might not be running
        toast.error('Unable to connect to server. Please check if the backend is running.');
      } else {
        dispatch(setError(error.message || 'Failed to load profile'));
        toast.error(error.message || 'Failed to load profile');
      }
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [token, dispatch]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await userService.updateProfile(profileData);
      dispatch(setUserProfile(response.data));
      
      toast.success('Profile updated successfully');
      return response.data;
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      dispatch(setError(error.message || 'Failed to update profile'));
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [token, dispatch]);

  // Load saved cities
  const loadSavedCities = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await userService.getSavedCities();
      // Update the saved cities in the user slice
      // Note: This would need to be implemented in the user slice
      return response.data;
    } catch (error) {
      console.error('Failed to load saved cities:', error);
      toast.error(error.message || 'Failed to load saved cities');
      throw error;
    }
  }, [token]);



  // Load saved jobs
  const loadSavedJobs = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await userService.getSavedJobs();
      // Update the saved jobs in the user slice
      // Note: This would need to be implemented in the user slice
      return response.data;
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
      toast.error(error.message || 'Failed to load saved jobs');
      throw error;
    }
  }, [token]);

  // Save job
  const saveJob = useCallback(async (jobId, status = 'Interested') => {
    if (!token) return;
    
    try {
      await userService.saveJob(jobId, status);
      dispatch(addSavedJob({ jobId, status }));
      toast.success('Job saved successfully');
    } catch (error) {
      console.error('Failed to save job:', error);
      toast.error(error.message || 'Failed to save job');
      throw error;
    }
  }, [token, dispatch]);

  // Update saved job status
  const updateJobStatus = useCallback(async (jobId, status) => {
    if (!token) return;
    
    try {
      await userService.updateSavedJobStatus(jobId, status);
      dispatch(updateSavedJobStatus({ jobId, status }));
      toast.success('Job status updated successfully');
    } catch (error) {
      console.error('Failed to update job status:', error);
      toast.error(error.message || 'Failed to update job status');
      throw error;
    }
  }, [token, dispatch]);

  // Remove saved job
  const removeJob = useCallback(async (jobId) => {
    if (!token) return;
    
    try {
      await userService.removeSavedJob(jobId);
      dispatch(removeSavedJob(jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      console.error('Failed to remove job:', error);
      toast.error(error.message || 'Failed to remove job');
      throw error;
    }
  }, [token, dispatch]);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isLoading,
    loadProfile,
    updateProfile,
    loadSavedCities,
    loadSavedJobs,
    saveJob,
    updateJobStatus,
    removeJob,
    clearErrors,
  };
};
