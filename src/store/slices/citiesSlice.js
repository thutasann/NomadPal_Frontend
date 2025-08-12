import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cities: [],
  currentCity: null,
  filters: {
    country: '',
    climate: '',
    min_cost: null,
    max_cost: null,
    min_safety: null,
    sort_by: 'name',
    sort_order: 'ASC'
  },
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
    has_next_page: false,
    has_prev_page: false
  },
  isLoading: false,
  error: null
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
    setCities: (state, action) => {
      state.cities = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addCities: (state, action) => {
      // Add new cities to existing ones (for pagination)
      const newCities = action.payload;
      const existingIds = new Set(state.cities.map(city => city.id));
      
      // Only add cities that don't already exist
      const uniqueNewCities = newCities.filter(city => !existingIds.has(city.id));
      state.cities = [...state.cities, ...uniqueNewCities];
      state.isLoading = false;
      state.error = null;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    addCity: (state, action) => {
      state.cities.push(action.payload);
    },
    updateCity: (state, action) => {
      const { id, updates } = action.payload;
      const cityIndex = state.cities.findIndex(city => city.id === id);
      if (cityIndex !== -1) {
        state.cities[cityIndex] = { ...state.cities[cityIndex], ...updates };
      }
    },
    removeCity: (state, action) => {
      state.cities = state.cities.filter(city => city.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    applyFilters: (state) => {
      // Filter logic can be implemented here if needed
      state.isLoading = false;
    },
    setPage: (state, action) => {
      state.pagination.current_page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.items_per_page = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCities: (state) => {
      state.cities = [];
      state.currentCity = null;
      state.pagination = initialState.pagination;
      state.filters = initialState.filters;
      state.isLoading = false;
      state.error = null;
    }
  }
});

export const { 
  setLoading, 
  setError, 
  clearError, 
  setCities, 
  addCities,
  setCurrentCity, 
  addCity, 
  updateCity, 
  removeCity, 
  setFilters, 
  clearFilters, 
  applyFilters, 
  setPage, 
  setLimit, 
  setPagination,
  clearCities 
} = citiesSlice.actions;

export default citiesSlice.reducer;
