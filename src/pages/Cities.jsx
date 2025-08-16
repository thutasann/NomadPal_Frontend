import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Ref for scroll detection
  const observerRef = useRef();
  const lastCityRef = useCallback(node => {
    if (isLoading || isLoadingMore) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        handleLoadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore]);

  // Load cities when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      // Load personalized cities for logged-in users
      loadPersonalizedCities({ limit: 25 }).then(responseData => {
        if (responseData && responseData.pagination) {
          console.log('🎯 Initial personalized cities loaded with pagination:', responseData.pagination);
          setHasMore(responseData.pagination.has_next_page || false);
        }
      });
    } else {
      // Load general cities for non-logged-in users
      loadCities();
    }
    setCurrentPage(1);
    setHasMore(true);
  }, [loadCities, loadPersonalizedCities, isAuthenticated]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Handle loading more cities
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    console.log('🔄 handleLoadMore called:', { 
      isLoadingMore, 
      hasMore, 
      currentPage, 
      pagination: pagination?.has_next_page 
    });
    
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      
      console.log('📄 Loading page:', nextPage, 'for authenticated user:', isAuthenticated);
      
      let success;
      let responseData;
      if (isAuthenticated) {
        // For personalized cities, load the next page
        responseData = await loadPersonalizedCities({ 
          limit: 25, 
          page: nextPage 
        });
        success = !!responseData;
        console.log('✅ Personalized cities loaded:', success, responseData);
      } else {
        // For general cities, use the loadMoreCities function
        success = await loadMoreCities(nextPage);
        console.log('✅ General cities loaded:', success);
      }
      
      if (success) {
        setCurrentPage(nextPage);
        // For personalized cities, check the response data directly
        if (isAuthenticated && responseData) {
          const newHasMore = responseData.pagination?.has_next_page || false;
          setHasMore(newHasMore);
          console.log('🔄 Updated pagination from response:', { nextPage, newHasMore });
        } else {
          // For general cities, check Redux state
          const newHasMore = pagination?.has_next_page || false;
          setHasMore(newHasMore);
          console.log('🔄 Updated pagination from Redux:', { nextPage, newHasMore });
        }
      } else {
        setHasMore(false);
        console.log('❌ No more cities available');
      }
    } catch (error) {
      toast.error('Failed to load more cities');
      console.error('Load more error:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Apply local filters to the cities from Redux
  const filtered = useMemo(() => {
    console.log('Filtering cities:', { cities, citiesLength: cities?.length });
    
    if (!cities || cities.length === 0) {
      console.log('No cities to filter');
      return [];
    }
    
    let list = cities.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.country.toLowerCase().includes(q.toLowerCase())
    );
    
    console.log('After search filter:', list.length);
    
    if (climate !== "any") {
      list = list.filter(c => c.climate_summary?.toLowerCase() === climate.toLowerCase());
      console.log('After climate filter:', list.length);
    }
    
    // Budget filter - handle missing monthly_cost_usd field
    const beforeBudgetFilter = list.length;
    list = list.filter(c => {
      if (c.monthly_cost_usd === undefined || c.monthly_cost_usd === null) {
        console.log('City missing monthly_cost_usd:', c.name, c);
        return true; // Include cities without cost data for now
      }
      return c.monthly_cost_usd <= maxCost;
    });
    console.log('After budget filter:', list.length, '(before:', beforeBudgetFilter, ')');

    const by = {
      "score-desc": (a, b) => (b.safety_score || 0) - (a.safety_score || 0),
      "cost-asc": (a, b) => (a.monthly_cost_usd || 0) - (b.monthly_cost_usd || 0),
      "internet-desc": (a, b) => (b.internet_speed || 0) - (a.internet_speed || 0),
      "safety-desc": (a, b) => (b.safety_score || 0) - (a.safety_score || 0),
    }[sort];

    const sorted = [...list].sort(by);
    console.log('Final filtered result:', sorted.length);
    
    // If no cities after filtering, return all cities (for debugging)
    if (sorted.length === 0 && cities.length > 0) {
      console.log('No cities match filters, returning all cities for debugging');
      return cities;
    }
    
    return sorted;
  }, [cities, q, climate, maxCost, sort]);
  console.log('Filtered cities:', filtered);

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
      setHasMore(true);
      
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
                <div key={city.id} ref={index === filtered.length - 1 ? lastCityRef : null}>
                  <CityCard city={city} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div style={{ textAlign: 'center', padding: '20px', marginTop: '20px' }}>
            <p className="muted">
              {isAuthenticated ? 'Loading more personalized recommendations...' : 'Loading more cities...'}
            </p>
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
                Debug: hasMore={hasMore.toString()}, has_next_page={pagination.has_next_page?.toString()}, 
                currentPage={currentPage}, totalPages={pagination.total_pages}
              </p>
            )}
            
            {!hasMore && filtered.length > 0 && (
              <p className="muted" style={{ marginTop: '10px' }}>
                {isAuthenticated 
                  ? `You've seen all ${pagination?.total_items || cities.length} personalized recommendations`
                  : "You've reached the end of all cities"
                }
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
