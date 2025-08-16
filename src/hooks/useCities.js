import { useCallback, useEffect, useState, useRef } from 'react';
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

// In-memory cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Global cache object (shared across all hook instances)
const memoryCache = {
  allCities: { data: null, timestamp: null, params: null },
  citiesById: {},
  searchResults: {},
  filteredResults: {},
  citiesByCountry: {},
  popularCities: { data: null, timestamp: null },
  personalizedCities: { data: null, timestamp: null, params: null }
};

// Helper functions
const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
};

const generateCacheKey = (params) => {
  return JSON.stringify(params || {});
};

export const useCities = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(state => state.cities);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to extract cities from API response
  const extractCitiesFromResponse = (response) => {
    console.log('🔍 extractCitiesFromResponse called with:', response);
    
    // Handle personalized cities response structure (from citiesService.getPersonalizedCities)
    if (response.cities && Array.isArray(response.cities)) {
      console.log('✅ Extracting cities from response.cities:', response.cities.length);
      return response.cities;
    }
    
    // Handle the actual API response structure (from citiesService.getCities)
    if (response.data && response.data.cities) {
      console.log('✅ Extracting cities from response.data.cities:', response.data.cities.length);
      return response.data.cities;
    }
    
    // Fallback for other response formats
    if (Array.isArray(response)) {
      console.log('✅ Extracting cities from array response:', response.length);
      return response;
    }
    
    console.log('❌ No cities found in response, returning empty array');
    console.log('Response keys:', Object.keys(response));
    return [];
  };

  // Load all cities with in-memory cache
  const loadCities = useCallback(async (params = {}, forceRefresh = false) => {
    try {
      const cacheKey = generateCacheKey(params);
      
      // Check cache first unless force refresh is requested
      if (!forceRefresh && memoryCache.allCities.data && 
          isCacheValid(memoryCache.allCities.timestamp) &&
          generateCacheKey(memoryCache.allCities.params) === cacheKey) {
        console.log('🚀 Loading cities from memory cache:', memoryCache.allCities.data.length);
        dispatch(setCities(memoryCache.allCities.data));
        return memoryCache.allCities.data;
      }
      
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getCities(params);
      const citiesData = extractCitiesFromResponse(response);
      
      // Cache the data in memory
      memoryCache.allCities = {
        data: citiesData,
        timestamp: Date.now(),
        params: params
      };
      
      // Also cache individual cities by ID and slug
      citiesData.forEach(city => {
        const timestamp = Date.now();
        if (city.id) {
          memoryCache.citiesById[city.id] = { data: city, timestamp };
        }
        if (city.slug) {
          memoryCache.citiesById[city.slug] = { data: city, timestamp };
        }
      });
      
      dispatch(setCities(citiesData));
      
      // Store pagination info in Redux
      if (response.data && response.data.pagination) {
        dispatch(setPagination(response.data.pagination));
      }
      
      return citiesData;
      
    } catch (error) {
      console.error('Error loading cities:', error);
      dispatch(setError(error.message || 'Failed to load cities'));
      toast.error(error.message || 'Failed to load cities');
      throw error;
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load a single city by slug with cache
  const loadCityBySlug = useCallback(async (slug, forceRefresh = false) => {
    try {
      // Check cache first unless force refresh is requested
      if (!forceRefresh && memoryCache.citiesById[slug] && 
          isCacheValid(memoryCache.citiesById[slug].timestamp)) {
        console.log('🚀 Loading city from memory cache:', slug);
        dispatch(setCurrentCity(memoryCache.citiesById[slug].data));
        return memoryCache.citiesById[slug].data;
      }
      
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getCityBySlug(slug);
      const cityData = response.data;
      
      if (cityData) {
        // Cache the city data
        const timestamp = Date.now();
        if (cityData.id) {
          memoryCache.citiesById[cityData.id] = { data: cityData, timestamp };
        }
        if (cityData.slug) {
          memoryCache.citiesById[cityData.slug] = { data: cityData, timestamp };
        }
        
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

  // Search cities with cache
  const searchCities = useCallback(async (query, params = {}, forceRefresh = false) => {
    try {
      const cacheKey = generateCacheKey({ query, ...params });
      
      // Check cache first unless force refresh is requested
      if (!forceRefresh && memoryCache.searchResults[cacheKey] && 
          isCacheValid(memoryCache.searchResults[cacheKey].timestamp)) {
        console.log('🚀 Loading search results from memory cache:', query);
        dispatch(setCities(memoryCache.searchResults[cacheKey].data));
        return memoryCache.searchResults[cacheKey].data;
      }
      
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.searchCities(query, params);
      const citiesData = extractCitiesFromResponse(response);
      
      // Cache the search results
      memoryCache.searchResults[cacheKey] = {
        data: citiesData,
        timestamp: Date.now()
      };
      
      dispatch(setCities(citiesData));
      return citiesData;
      
    } catch (error) {
      console.error('Error searching cities:', error);
      dispatch(setError(error.message || 'Failed to search cities'));
      toast.error(error.message || 'Failed to search cities');
      throw error;
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load cities with filters and cache
  const loadCitiesWithFilters = useCallback(async (filters = {}, forceRefresh = false) => {
    try {
      const cacheKey = generateCacheKey(filters);
      
      // Check cache first unless force refresh is requested
      if (!forceRefresh && memoryCache.filteredResults[cacheKey] && 
          isCacheValid(memoryCache.filteredResults[cacheKey].timestamp)) {
        console.log('🚀 Loading filtered results from memory cache:', filters);
        dispatch(setCities(memoryCache.filteredResults[cacheKey].data));
        return memoryCache.filteredResults[cacheKey].data;
      }
      
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getCitiesWithFilters(filters);
      const citiesData = extractCitiesFromResponse(response);
      
      // Cache the filtered results
      memoryCache.filteredResults[cacheKey] = {
        data: citiesData,
        timestamp: Date.now()
      };
      
      dispatch(setCities(citiesData));
      return citiesData;
      
    } catch (error) {
      console.error('Error loading cities with filters:', error);
      dispatch(setError(error.message || 'Failed to load cities with filters'));
      toast.error(error.message || 'Failed to load cities with filters');
      throw error;
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

  // Save/unsave city
  const toggleSaveCity = useCallback(async (cityId) => {
    try {
      const response = await citiesService.toggleSaveCity(cityId);
      return response.data;
    } catch (error) {
      console.error('Error toggling save city:', error);
      throw error;
    }
  }, []);

  // Load saved cities
  const loadSavedCities = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getSavedCities(params);
      const citiesData = extractCitiesFromResponse(response);
      dispatch(setCities(citiesData));
      
      // Store pagination info in Redux
      if (response.data && response.data.pagination) {
        dispatch(setPagination(response.data.pagination));
      }
      
      return citiesData;
      
    } catch (error) {
      console.error('Error loading saved cities:', error);
      dispatch(setError(error.message || 'Failed to load saved cities'));
      throw error;
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load personalized city recommendations
  const loadPersonalizedCities = useCallback(async (params = {}, forceRefresh = false) => {
    try {
      const cacheKey = generateCacheKey(params);
      
      // Check cache first unless force refresh is requested
      if (!forceRefresh && memoryCache.personalizedCities.data && 
          isCacheValid(memoryCache.personalizedCities.timestamp) &&
          generateCacheKey(memoryCache.personalizedCities.params) === cacheKey) {
        console.log('🚀 Loading personalized cities from memory cache:', memoryCache.personalizedCities.data.length);
        dispatch(setCities(memoryCache.personalizedCities.data));
        if (memoryCache.personalizedCities.pagination) {
          dispatch(setPagination(memoryCache.personalizedCities.pagination));
        }
        return {
          cities: memoryCache.personalizedCities.data,
          userPreferences: memoryCache.personalizedCities.userPreferences
        };
      }
      
      setIsLoading(true);
      dispatch(setLoading(true));
      
      const response = await citiesService.getPersonalizedCities(params);
      console.log('🔍 Personalized cities response:', response);
      console.log('🔍 Response structure:', {
        hasData: !!response.data,
        hasCities: !!response.cities,
        hasPagination: !!response.pagination,
        paginationKeys: response.pagination ? Object.keys(response.pagination) : 'none',
        total: response.pagination?.total,
        totalPages: response.pagination?.total_pages,
        hasNextPage: response.pagination?.has_next_page
      });
      
      const citiesData = extractCitiesFromResponse(response);
      
      // Cache the data in memory
      memoryCache.personalizedCities = {
        data: citiesData,
        timestamp: Date.now(),
        params: params,
        pagination: response.pagination,
        userPreferences: response.user_preferences
      };
      
      dispatch(setCities(citiesData));
      
      // Store pagination info in Redux
      if (response.pagination) {
        console.log('✅ Setting pagination in Redux:', response.pagination);
        dispatch(setPagination(response.pagination));
      } else {
        console.log('❌ No pagination data in response');
      }
      
      return {
        cities: citiesData,
        userPreferences: response.user_preferences
      };
      
    } catch (error) {
      console.error('Error loading personalized cities:', error);
      dispatch(setError(error.message || 'Failed to load personalized cities'));
      throw error;
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Load more personalized cities (for pagination)
  const loadMorePersonalizedCities = useCallback(async (page) => {
    try {
      const currentParams = memoryCache.personalizedCities.params || {};
      const newParams = { ...currentParams, page };
      
      const response = await citiesService.getPersonalizedCities(newParams);
      const newCitiesData = extractCitiesFromResponse(response);
      
      // For personalized cities, we need to replace the data, not append
      // because each page contains different cities based on ranking
      memoryCache.personalizedCities = {
        data: newCitiesData,  // Replace with new page data
        timestamp: Date.now(),
        params: newParams,
        pagination: response.pagination,
        userPreferences: response.user_preferences
      };
      
      dispatch(setCities(newCitiesData));  // Replace cities in Redux
      if (response.pagination) {
        dispatch(setPagination(response.pagination));
      }
      
      return true;
    } catch (error) {
      console.error('Error loading more personalized cities:', error);
      dispatch(setError(error.message || 'Failed to load more personalized cities'));
      return false;
    }
  }, [dispatch]);

  // Cache management functions
  const clearAllCache = useCallback(() => {
    memoryCache.allCities = { data: null, timestamp: null, params: null };
    memoryCache.citiesById = {};
    memoryCache.searchResults = {};
    memoryCache.filteredResults = {};
    memoryCache.citiesByCountry = {};
    memoryCache.popularCities = { data: null, timestamp: null };
    memoryCache.personalizedCities = { data: null, timestamp: null, params: null };
    console.log('🗑️ All memory cache cleared');
  }, []);

  const refreshCities = useCallback(async (params = {}) => {
    return await loadCities(params, true); // Force refresh
  }, [loadCities]);

  const refreshCity = useCallback(async (slug) => {
    return await loadCityBySlug(slug, true); // Force refresh
  }, [loadCityBySlug]);

  // Get cache info for debugging
  const getCacheInfo = useCallback(() => {
    return {
      allCities: {
        hasData: !!memoryCache.allCities.data,
        count: memoryCache.allCities.data?.length || 0,
        timestamp: memoryCache.allCities.timestamp,
        isValid: isCacheValid(memoryCache.allCities.timestamp)
      },
      citiesById: Object.keys(memoryCache.citiesById).length,
      searchResults: Object.keys(memoryCache.searchResults).length,
      filteredResults: Object.keys(memoryCache.filteredResults).length,
      citiesByCountry: Object.keys(memoryCache.citiesByCountry).length,
      popularCities: {
        hasData: !!memoryCache.popularCities.data,
        count: memoryCache.popularCities.data?.length || 0,
        timestamp: memoryCache.popularCities.timestamp,
        isValid: isCacheValid(memoryCache.popularCities.timestamp)
      },
      personalizedCities: {
        hasData: !!memoryCache.personalizedCities.data,
        count: memoryCache.personalizedCities.data?.length || 0,
        timestamp: memoryCache.personalizedCities.timestamp,
        isValid: isCacheValid(memoryCache.personalizedCities.timestamp)
      }
    };
  }, []);

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
    // Save functionality
    toggleSaveCity,
    loadSavedCities,
    loadPersonalizedCities,
    loadMorePersonalizedCities,
    // Cache management
    clearAllCache,
    refreshCities,
    refreshCity,
    getCacheInfo
  };
};
