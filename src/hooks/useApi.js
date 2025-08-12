import { useState, useCallback } from 'react';
import api from '../services/apiClient';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { showLoading = true, onSuccess, onError, onFinally } = options;
    
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) onError(err);
      throw err;
    } finally {
      if (showLoading) setLoading(false);
      if (onFinally) onFinally();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
};

// Specific hooks for common operations
export const useAuth = () => {
  const { loading, error, execute, clearError } = useApi();

  const login = useCallback((credentials) => {
    return execute(api.auth.login(credentials), {
      onSuccess: (response) => {
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }
      },
    });
  }, [execute]);

  const register = useCallback((userData) => {
    return execute(api.auth.register(userData), {
      onSuccess: (response) => {
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }
      },
    });
  }, [execute]);

  const logout = useCallback(() => {
    return execute(api.auth.logout(), {
      onSuccess: () => {
        localStorage.removeItem('authToken');
      },
    });
  }, [execute]);

  return {
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};

export const useCities = () => {
  const { loading, error, execute, clearError } = useApi();

  const getCities = useCallback((params) => {
    return execute(api.cities.getAll(params));
  }, [execute]);

  const getCityById = useCallback((id) => {
    return execute(api.cities.getById(id));
  }, [execute]);

  const searchCities = useCallback((query) => {
    return execute(api.cities.search(query));
  }, [execute]);

  return {
    loading,
    error,
    getCities,
    getCityById,
    searchCities,
    clearError,
  };
};

export const useJobs = () => {
  const { loading, error, execute, clearError } = useApi();

  const getJobs = useCallback((params) => {
    return execute(api.jobs.getAll(params));
  }, [execute]);

  const getJobById = useCallback((id) => {
    return execute(api.jobs.getById(id));
  }, [execute]);

  const searchJobs = useCallback((query) => {
    return execute(api.jobs.search(query));
  }, [execute]);

  const applyToJob = useCallback((jobId, applicationData) => {
    return execute(api.jobs.apply(jobId, applicationData));
  }, [execute]);

  return {
    loading,
    error,
    getJobs,
    getJobById,
    searchJobs,
    applyToJob,
    clearError,
  };
};

export const useUser = () => {
  const { loading, error, execute, clearError } = useApi();

  const getProfile = useCallback(() => {
    return execute(api.users.getProfile());
  }, [execute]);

  const updateProfile = useCallback((userData) => {
    return execute(api.users.updateProfile(userData));
  }, [execute]);

  const updatePreferences = useCallback((preferences) => {
    return execute(api.users.updatePreferences(preferences));
  }, [execute]);

  return {
    loading,
    error,
    getProfile,
    updateProfile,
    updatePreferences,
    clearError,
  };
};
