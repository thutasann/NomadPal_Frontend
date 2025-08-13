import { apiClient } from "./apiClient";

// Get all jobs with optional filters
async function getAllJobs(params = {}) {
  try {
    const response = await apiClient.get('/jobs', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get jobs by category
async function getJobsByCategory(categorySlug, params = {}) {
  try {
    const response = await apiClient.get(`/jobs/category/${categorySlug}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get jobs by company
async function getJobsByCompany(companyName, params = {}) {
  try {
    const response = await apiClient.get(`/jobs/company/${companyName}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Search jobs by keywords
async function searchJobs(keywords, params = {}) {
  try {
    const response = await apiClient.get(`/jobs/search/${keywords}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get job categories
async function getJobCategories() {
  try {
    const response = await apiClient.get('/jobs/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Get latest jobs
async function getLatestJobs(params = {}) {
  try {
    const response = await apiClient.get('/jobs/latest', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Convenience functions with common filters

// Get software development jobs
async function getSoftwareJobs(params = {}) {
  try {
    return await getJobsByCategory('software-dev', params);
  } catch (error) {
    throw error;
  }
}

// Get design jobs
async function getDesignJobs(params = {}) {
  try {
    return await getJobsByCategory('design', params);
  } catch (error) {
    throw error;
  }
}

// Get marketing jobs
async function getMarketingJobs(params = {}) {
  try {
    return await getJobsByCategory('marketing', params);
  } catch (error) {
    throw error;
  }
}

// Search jobs with advanced filters
async function searchJobsAdvanced(searchParams = {}) {
  try {
    const { keywords, category, company_name, limit } = searchParams;
    
    if (keywords) {
      // Use search endpoint if keywords provided
      const params = {};
      if (category) params.category = category;
      if (limit) params.limit = limit;
      
      return await searchJobs(keywords, params);
    } else {
      // Use general jobs endpoint with filters
      const params = {};
      if (category) params.category = category;
      if (company_name) params.company_name = company_name;
      if (limit) params.limit = limit;
      
      return await getAllJobs(params);
    }
  } catch (error) {
    throw error;
  }
}

// Get jobs with pagination support
async function getJobsPaginated(page = 1, limit = 20, filters = {}) {
  try {
    const params = {
      ...filters,
      limit
    };
    
    const response = await getAllJobs(params);
    
    // Calculate pagination info (since the API doesn't provide it directly)
    const totalJobs = response.data?.total_jobs || 0;
    const totalPages = Math.ceil(totalJobs / limit);
    
    return {
      ...response,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_jobs: totalJobs,
        per_page: limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    };
  } catch (error) {
    throw error;
  }
}

// Get popular job categories (those with most jobs)
async function getPopularCategories() {
  try {
    const categories = await getJobCategories();
    
    // Get job counts for each category (you might want to cache this)
    const categoriesWithCounts = await Promise.all(
      categories.data?.slice(0, 10).map(async (category) => {
        try {
          const jobs = await getJobsByCategory(category.slug || category.name, { limit: 1 });
          return {
            ...category,
            job_count: jobs.data?.total_jobs || 0
          };
        } catch (error) {
          return {
            ...category,
            job_count: 0
          };
        }
      }) || []
    );
    
    // Sort by job count
    categoriesWithCounts.sort((a, b) => b.job_count - a.job_count);
    
    return {
      success: true,
      data: categoriesWithCounts,
      message: 'Popular categories retrieved successfully'
    };
  } catch (error) {
    throw error;
  }
}

// Filter jobs by salary range (client-side filtering)
function filterJobsBySalary(jobs, minSalary, maxSalary) {
  if (!jobs || !Array.isArray(jobs)) return [];
  
  return jobs.filter(job => {
    if (!job.salary) return false;
    
    // Extract numbers from salary string (e.g., "$40,000 - $60,000")
    const salaryNumbers = job.salary.match(/[\d,]+/g);
    if (!salaryNumbers || salaryNumbers.length === 0) return false;
    
    // Get the minimum salary from the range
    const jobMinSalary = parseInt(salaryNumbers[0].replace(/,/g, ''));
    
    if (minSalary && jobMinSalary < minSalary) return false;
    if (maxSalary && jobMinSalary > maxSalary) return false;
    
    return true;
  });
}

// Format job data for display
function formatJobData(job) {
  if (!job) return null;
  
  return {
    ...job,
    // Format publication date
    publication_date_formatted: new Date(job.publication_date).toLocaleDateString(),
    // Extract salary range
    salary_min: job.salary ? extractMinSalary(job.salary) : null,
    salary_max: job.salary ? extractMaxSalary(job.salary) : null,
    // Check if job is recent (within last 7 days)
    is_recent: job.publication_date ? 
      (new Date() - new Date(job.publication_date)) / (1000 * 60 * 60 * 24) <= 7 : false,
    // Create search-friendly title
    search_title: `${job.title} at ${job.company_name}`.toLowerCase()
  };
}

// Helper functions
function extractMinSalary(salaryString) {
  if (!salaryString) return null;
  const numbers = salaryString.match(/[\d,]+/g);
  return numbers && numbers.length > 0 ? parseInt(numbers[0].replace(/,/g, '')) : null;
}

function extractMaxSalary(salaryString) {
  if (!salaryString) return null;
  const numbers = salaryString.match(/[\d,]+/g);
  return numbers && numbers.length > 1 ? parseInt(numbers[1].replace(/,/g, '')) : null;
}

const jobsService = {
  // Main API functions
  getAllJobs,
  getJobsByCategory,
  getJobsByCompany,
  searchJobs,
  getJobCategories,
  getLatestJobs,
  
  // Convenience functions
  getSoftwareJobs,
  getDesignJobs,
  getMarketingJobs,
  searchJobsAdvanced,
  getJobsPaginated,
  getPopularCategories,
  
  // Utility functions
  filterJobsBySalary,
  formatJobData,
  extractMinSalary,
  extractMaxSalary
};

export default jobsService;