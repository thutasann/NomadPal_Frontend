import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cities: [],
  currentCity: null,
  filteredCities: [],
  filters: {
    budget_min: null,
    budget_max: null,
    climate: null,
    internet_speed: null,
    lifestyle_tags: [],
    country: null,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const citiesSlice = createSlice({
  name: 'cities',
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
    
    // Set all cities
    setCities: (state, action) => {
      state.cities = action.payload;
      state.filteredCities = action.payload;
      state.pagination.total = action.payload.length;
      state.isLoading = false;
      state.error = null;
    },
    
    // Set current city (for detail view)
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    
    // Add a single city
    addCity: (state, action) => {
      const city = action.payload;
      const existingIndex = state.cities.findIndex(c => c.id === city.id);
      if (existingIndex >= 0) {
        state.cities[existingIndex] = city;
      } else {
        state.cities.push(city);
      }
    },
    
    // Update city data
    updateCity: (state, action) => {
      const { id, updates } = action.payload;
      const cityIndex = state.cities.findIndex(c => c.id === id);
      if (cityIndex >= 0) {
        state.cities[cityIndex] = { ...state.cities[cityIndex], ...updates };
      }
    },
    
    // Remove city
    removeCity: (state, action) => {
      const cityId = action.payload;
      state.cities = state.cities.filter(c => c.id !== cityId);
      state.filteredCities = state.filteredCities.filter(c => c.id !== cityId);
    },
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredCities = state.cities;
      state.pagination.page = 1;
    },
    
    // Apply filters to cities
    applyFilters: (state) => {
      let filtered = [...state.cities];
      
      // Budget filter
      if (state.filters.budget_min !== null) {
        filtered = filtered.filter(city => 
          city.monthly_cost_usd >= state.filters.budget_min
        );
      }
      if (state.filters.budget_max !== null) {
        filtered = filtered.filter(city => 
          city.monthly_cost_usd <= state.filters.budget_max
        );
      }
      
      // Climate filter
      if (state.filters.climate) {
        filtered = filtered.filter(city => 
          city.climate_summary === state.filters.climate
        );
      }
      
      // Internet speed filter
      if (state.filters.internet_speed) {
        // This would need to be implemented based on your internet speed data
        // For now, we'll skip this filter
      }
      
      // Lifestyle tags filter
      if (state.filters.lifestyle_tags.length > 0) {
        filtered = filtered.filter(city => {
          if (!city.lifestyle_tags) return false;
          const cityTags = JSON.parse(city.lifestyle_tags);
          return state.filters.lifestyle_tags.some(tag => 
            cityTags.includes(tag)
          );
        });
      }
      
      // Country filter
      if (state.filters.country) {
        filtered = filtered.filter(city => 
          city.country === state.filters.country
        );
      }
      
      state.filteredCities = filtered;
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
    
    // Clear cities data
    clearCities: (state) => {
      state.cities = [];
      state.filteredCities = [];
      state.currentCity = null;
      state.pagination.total = 0;
      state.pagination.page = 1;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCities,
  setCurrentCity,
  addCity,
  updateCity,
  removeCity,
  setFilters,
  clearFilters,
  applyFilters,
  setPage,
  setLimit,
  clearCities,
} = citiesSlice.actions;

export default citiesSlice.reducer;
