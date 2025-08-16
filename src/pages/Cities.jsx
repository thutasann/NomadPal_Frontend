import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import CityCard from "../components/CityCard";
import BudgetFilter from "../components/BudgetFilter";
import { useCities } from "../hooks/useCities";
import { useAuth } from "../hooks/useAuth";

export default function Cities() {
  const { isAuthenticated } = useAuth();
  const {
    cities,
    pagination,
    isLoading,
    error,
    loadCities,
    loadMoreCities,
    loadPersonalizedCities,
    loadMorePersonalizedCities,
    clearAllFilters,
    clearErrors,
    refreshCities,
    getCacheInfo
  } = useCities();

  // Local state for search and filters
  const [q, setQ] = useState("");
  const [climate, setClimate] = useState("any");
  const [maxCost, setMaxCost] = useState(2500);
  const [sort, setSort] = useState("score-desc");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Load cities when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      // Load personalized cities for logged-in users
      loadPersonalizedCities({ limit: 25 }).then(responseData => {
        if (responseData && responseData.pagination) {
          console.log('🎯 Initial personalized cities loaded:', {
            cities: responseData.cities?.length,
            currentPage: responseData.pagination.current_page,
            totalPages: responseData.pagination.total_pages,
            hasNext: responseData.pagination.has_next_page
          });
        }
      });
    } else {
      // Load general cities for non-logged-in users
      loadCities();
    }
    setCurrentPage(1);
  }, [loadCities, loadPersonalizedCities, isAuthenticated]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Handle page change
  const handlePageChange = async (newPage) => {
    if (isLoadingMore || newPage === currentPage) return;
    
    try {
      setIsLoadingMore(true);
      
      console.log('📄 Loading page', newPage, '(authenticated:', isAuthenticated + ')');
      
      let success;
      let responseData;
      
      if (isAuthenticated) {
        // For personalized cities, load the specific page
        responseData = await loadPersonalizedCities({ 
          limit: 25, 
          page: newPage 
        });
        success = !!responseData;
        console.log('✅ Personalized cities loaded page', newPage, ':', {
          success,
          cities: responseData?.cities?.length,
          hasNext: responseData?.pagination?.has_next_page
        });
      } else {
        // For general cities, use the loadMoreCities function
        success = await loadMoreCities(newPage);
        console.log('✅ General cities loaded:', success);
      }
      
      if (success) {
        setCurrentPage(newPage);
        // For personalized cities, check the response data directly
        if (isAuthenticated && responseData) {
          console.log('🔄 Updated pagination from response:', { newPage });
        } else {
          // For general cities, check Redux state
          console.log('🔄 Updated pagination from Redux:', { newPage });
        }
      } else {
        console.log('❌ No more cities available');
      }
    } catch (error) {
      toast.error('Failed to load cities');
      console.error('Load page error:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Apply local filters to the cities from Redux
  const filtered = useMemo(() => {
    if (!cities || cities.length === 0) {
      return [];
    }
    
    let list = cities.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.country.toLowerCase().includes(q.toLowerCase())
    );
    
    if (climate !== "any") {
      list = list.filter(c => c.climate_summary?.toLowerCase() === climate.toLowerCase());
    }
    
    // Budget filter - handle missing monthly_cost_usd field
    list = list.filter(c => {
      if (c.monthly_cost_usd === undefined || c.monthly_cost_usd === null) {
        return true; // Include cities without cost data for now
      }
      return c.monthly_cost_usd <= maxCost;
    });

    const by = {
      "score-desc": (a, b) => (b.safety_score || 0) - (a.safety_score || 0),
      "cost-asc": (a, b) => (a.monthly_cost_usd || 0) - (b.monthly_cost_usd || 0),
      "internet-desc": (a, b) => (b.internet_speed || 0) - (a.internet_speed || 0),
      "safety-desc": (a, b) => (b.safety_score || 0) - (a.safety_score || 0),
    }[sort];

    const sorted = [...list].sort(by);
    
    // If no cities after filtering, return all cities (for debugging)
    if (sorted.length === 0 && cities.length > 0) {
      console.log('⚠️ No cities match filters, showing all cities');
      return cities;
    }
    
    console.log('🎯 Filtered to', sorted.length, 'cities from', cities.length, 'total');
    return sorted;
  }, [cities, q, climate, maxCost, sort]);

  // Handle search input
  const handleSearch = (value) => {
    setQ(value);
  };

  // Handle climate filter
  const handleClimateChange = (value) => {
    setClimate(value);
  };

  // Handle budget filter
  const handleBudgetChange = (value) => {
    setMaxCost(value);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSort(value);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setCurrentPage(1);
      
      if (isAuthenticated) {
        await loadPersonalizedCities({ limit: 100 });  // Use same limit as initial load
        toast.success('Personalized recommendations refreshed successfully');
      } else {
        await loadCities();
        toast.success('Cities refreshed successfully');
      }
    } catch (error) {
      toast.error('Failed to refresh cities');
    }
  };

  // Show error if any
  if (error) {
    return (
      <div className="cities-bg">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Error Loading Cities</h2>
            <p className="muted">{error}</p>
            <button className="btn" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cities-bg">
      <div className="container">
        <header className="page-head">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>{isAuthenticated ? 'Personalized Cities' : 'Cities'}</h1>
              <p className="subtitle">
                {isAuthenticated 
                  ? 'Your personalized recommendations based on preferences.' 
                  : 'Compare cost, internet, safety, and climate.'
                }
              </p>
              {isAuthenticated && (
                <p className="muted" style={{ marginTop: '5px', fontSize: '0.9em' }}>
                  Based on your budget, climate preferences, and lifestyle priorities
                </p>
              )}
            </div>
            <button 
              className="btn small" 
              onClick={handleRefresh}
              disabled={isLoading}
              title={isAuthenticated ? "Refresh personalized recommendations" : "Refresh cities data"}
            >
              {isLoading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="input"
            placeholder="Search city or country…"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <BudgetFilter value={maxCost} onChange={handleBudgetChange} />

          <select className="input" value={climate} onChange={(e) => handleClimateChange(e.target.value)}>
            <option value="any">Any climate</option>
            <option value="warm">Warm</option>
            <option value="temperate">Temperate</option>
            <option value="cold">Cold</option>
          </select>

          <select className="input" value={sort} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="score-desc">Top score</option>
            <option value="cost-asc">Lowest cost</option>
            <option value="internet-desc">Fastest internet</option>
            <option value="safety-desc">Safest</option>
          </select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <p className="muted">
              {isAuthenticated ? 'Loading personalized recommendations…' : 'Loading cities…'}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <p className="muted">No cities match your filters.</p>
            <button className="btn small" onClick={clearAllFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {isAuthenticated ? (
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                padding: '15px 20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontWeight: '500' }}>
                  🎯 These cities are ranked based on your preferences
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', opacity: 0.9 }}>
                  Higher scores indicate better matches for your budget, climate, and lifestyle preferences
                </p>
              </div>
            ) : (
              <div style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                color: 'white', 
                padding: '15px 20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontWeight: '500' }}>
                  🔓 Get personalized recommendations
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', opacity: 0.9 }}>
                  <a href="/login" style={{ color: 'white', textDecoration: 'underline' }}>Log in</a> to see cities ranked based on your preferences
                </p>
              </div>
            )}
            <div className="grid">
              {filtered.map((city, index) => (
                <div key={city.id}>
                  <CityCard city={city} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {filtered.length > 0 && pagination && pagination.total_pages > 1 && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <div className="pagination" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <button 
                className="btn small"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoadingMore}
                style={{
                  opacity: (currentPage <= 1 || isLoadingMore) ? 0.5 : 1,
                  cursor: (currentPage <= 1 || isLoadingMore) ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>
              
              <span className="pagination-info" style={{
                fontSize: '14px',
                color: '#666',
                fontWeight: '500',
                minWidth: '120px'
              }}>
                Page {currentPage} of {pagination.total_pages}
              </span>
              
              <button 
                className="btn small"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.total_pages || isLoadingMore}
                style={{
                  opacity: (currentPage >= pagination.total_pages || isLoadingMore) ? 0.5 : 1,
                  cursor: (currentPage >= pagination.total_pages || isLoadingMore) ? 'not-allowed' : 'pointer'
                }}
              >
                Next →
              </button>
            </div>
            
            {/* Page number input */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '15px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Go to page:</span>
              <input
                type="number"
                min="1"
                max={pagination.total_pages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= pagination.total_pages) {
                    handlePageChange(page);
                  }
                }}
                style={{
                  width: '60px',
                  padding: '5px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px'
                }}
                disabled={isLoadingMore}
              />
              <span style={{ fontSize: '14px', color: '#666' }}>of {pagination.total_pages}</span>
            </div>
            
            {isLoadingMore && (
              <p className="muted" style={{ marginTop: '10px' }}>
                Loading page {currentPage + 1}...
              </p>
            )}
          </div>
        )}

        {/* Results count and pagination info */}
        {filtered.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p className="muted">
              {isAuthenticated ? (
                <>
                  Showing {filtered.length} of {pagination?.total_items || cities.length} personalized recommendations
                  {pagination && (
                    <span> • Page {currentPage} of {pagination.total_pages} • Total: {pagination.total_items} cities</span>
                  )}
                </>
              ) : (
                <>
                  Showing {filtered.length} of {pagination?.total_items || cities.length} cities
                  {pagination && (
                    <span> • Page {currentPage} of {pagination.total_pages}</span>
                  )}
                </>
              )}
              {(() => {
                const cacheInfo = getCacheInfo();
                return cacheInfo.allCities.hasData && cacheInfo.allCities.isValid && (
                  <span> • Cached {new Date(cacheInfo.allCities.timestamp).toLocaleTimeString()}</span>
                );
              })()}
            </p>
            
            {/* Debug pagination info */}
            {isAuthenticated && pagination && (
              <p className="muted" style={{ marginTop: '5px', fontSize: '0.8em' }}>
                Debug: currentPage={currentPage}, totalPages={pagination.total_pages}, 
                totalItems={pagination.total_items}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
