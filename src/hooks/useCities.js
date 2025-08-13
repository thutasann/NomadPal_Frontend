import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setCities, 
  setCurrentCity,
  setLoading, 
  setError, 
  clearError, 
  setFilters, 
  applyFilters,
  setPage,
  setLimit,
  clearCities,
  addCities,
  setPagination
} from '../store/slices/citiesSlice';
import citiesService from '../services/cities.service';
import { toast } from 'react-hot-toast';

export const useCities = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(state => state.cities);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to extract cities from API response
  const extractCitiesFromResponse = (response) => {
    console.log('API Response:', response); // Added debug log
    
    // Handle the actual API response structure
    if (response.data && response.data.cities) {
      console.log('Extracting cities from response.data.cities:', response.data.cities.length); // Added debug log
      return response.data.cities;
    }
    
    // Fallback for other response formats
    if (response.cities) {
      console.log('Extracting cities from response.cities:', response.cities.length); // Added debug log
      return response.cities;
    }
    
    if (Array.isArray(response)) {
      console.log('Extracting cities from array response:', response.length); // Added debug log
      return response;
    }
    
    console.log('No cities found in response, returning empty array'); // Added debug log
    return [];
  };

  // Load all cities
  const loadCities = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getCities(params);
      const citiesData = extractCitiesFromResponse(response);
      dispatch(setCities(citiesData));
      
      // Store pagination info in Redux
      if (response.data && response.data.pagination) {
        dispatch(setPagination(response.data.pagination));
      }
      
    } catch (error) {
      console.error('Error loading cities:', error);
      dispatch(setError(error.message || 'Failed to load cities'));
      toast.error(error.message || 'Failed to load cities');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load a single city by slug
  const loadCityBySlug = useCallback(async (slug) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getCityBySlug(slug);
      const cityData = response.data;
      
      if (cityData) {
        dispatch(setCurrentCity(cityData));
        return cityData;
      } else {
        throw new Error('City not found');
      }
      
    } catch (error) {
      console.error('Error loading city by slug:', error);
      dispatch(setError(error.message || 'Failed to load city'));
      toast.error(error.message || 'Failed to load city');
      throw error;
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load more cities for pagination
  const loadMoreCities = useCallback(async (page = 1, params = {}) => {
    try {
      const response = await citiesService.getCities({ ...params, page });
      const newCities = extractCitiesFromResponse(response);
      
      if (newCities && newCities.length > 0) {
        // Add new cities to existing ones instead of replacing
        dispatch(addCities(newCities));
        
        // Update pagination info
        if (response.data && response.data.pagination) {
          dispatch(setPagination(response.data.pagination));
        }
        
        return true; // Success
      }
      
      return false; // No more cities
      
    } catch (error) {
      console.error('Error loading more cities:', error);
      toast.error(error.message || 'Failed to load more cities');
      return false;
    }
  }, [dispatch]);

  // Search cities
  const searchCities = useCallback(async (query, params = {}) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.searchCities(query, params);
      const citiesData = extractCitiesFromResponse(response);
      dispatch(setCities(citiesData));
      
    } catch (error) {
      console.error('Error searching cities:', error);
      dispatch(setError(error.message || 'Failed to search cities'));
      toast.error(error.message || 'Failed to search cities');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load cities with filters
  const loadCitiesWithFilters = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getCitiesWithFilters(filters);
      const citiesData = extractCitiesFromResponse(response);
      dispatch(setCities(citiesData));
      
    } catch (error) {
      console.error('Error loading cities with filters:', error);
      dispatch(setError(error.message || 'Failed to load cities with filters'));
      toast.error(error.message || 'Failed to load cities with filters');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load popular cities
  const loadPopularCities = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getPopularCities(params);
      const citiesData = extractCitiesFromResponse(response);
      dispatch(setCities(citiesData));
      
    } catch (error) {
      console.error('Error loading popular cities:', error);
      dispatch(setError(error.message || 'Failed to load popular cities'));
      toast.error(error.message || 'Failed to load popular cities');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load cities by country
  const loadCitiesByCountry = useCallback(async (country, params = {}) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getCitiesByCountry(country, params);
      const citiesData = extractCitiesFromResponse(response);
      dispatch(setCities(citiesData));
      
    } catch (error) {
      console.error('Error loading cities by country:', error);
      dispatch(setError(error.message || 'Failed to load cities by country'));
      toast.error(error.message || 'Failed to load cities by country');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear all cities
  const clearAllCities = useCallback(() => {
    dispatch(clearCities());
  }, [dispatch]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return {
    cities: cities.cities || [],
    pagination: cities.pagination,
    isLoading: isLoading || cities.isLoading,
    error: cities.error,
    loadCities,
    loadCityBySlug,
    loadMoreCities,
    searchCities,
    loadCitiesWithFilters,
    loadPopularCities,
    loadCitiesByCountry,
    clearErrors,
    clearAllCities,
    clearAllFilters,
  };
};
