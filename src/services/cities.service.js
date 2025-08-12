import { apiClient } from "./apiClient";

// Get all cities with optional filters
async function getCities(params = {}) {
  try {
    const response = await apiClient.get('/cities', { params });
    // The API returns { data: { cities: [...], pagination: {...} } }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get city by ID
async function getCityById(id) {
  try {
    const response = await apiClient.get(`/cities/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get city by slug
async function getCityBySlug(slug) {
  try {
    const response = await apiClient.get(`/cities/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Search cities
async function searchCities(query, params = {}) {
  try {
    const response = await apiClient.get(`/cities/search/${query}`, { params });
    // The API returns { data: { cities: [...], pagination: {...} } }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get cities by country
async function getCitiesByCountry(country) {
  try {
    const response = await apiClient.get(`/cities/country/${country}`);
    // The API returns { data: { cities: [...], pagination: {...} } }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get popular cities
async function getPopularCities() {
  try {
    const response = await apiClient.get('/cities/popular');
    // The API returns { data: [...] } for popular cities
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get cities with filters (budget, climate, etc.)
async function getCitiesWithFilters(filters = {}) {
  try {
    const response = await apiClient.get('/cities/filter', { params: filters });
    // The API returns { data: { cities: [...], pagination: {...} } }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

const citiesService = {
  getCities,
  getCityById,
  getCityBySlug,
  searchCities,
  getCitiesByCountry,
  getPopularCities,
  getCitiesWithFilters,
};

export default citiesService;