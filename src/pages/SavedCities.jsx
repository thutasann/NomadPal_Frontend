import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useCities } from "../hooks/useCities";
import CityCard from "../components/CityCard";

export default function SavedCities() {
  const { isAuthenticated, user } = useAuth();
  const {
    cities,
    pagination,
    isLoading,
    error,
    loadSavedCities,
    clearErrors
  } = useCities();

  const [currentPage, setCurrentPage] = useState(1);

  // Load saved cities when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedCities({ page: currentPage });
    }
  }, [loadSavedCities, isAuthenticated, currentPage]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadSavedCities({ page: newPage });
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="cities-bg">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Authentication Required</h2>
            <p className="muted">Please log in to view your saved cities.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="cities-bg">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Error Loading Saved Cities</h2>
            <p className="muted">{error}</p>
            <button 
              className="btn" 
              onClick={() => loadSavedCities({ page: currentPage })}
            >
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
          <div>
            <h1>Saved Cities</h1>
            <p className="subtitle">Your bookmarked destinations for digital nomads.</p>
          </div>
        </header>

        {/* Loading state */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <p className="muted">Loading your saved cities…</p>
          </div>
        ) : cities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <h3>No Saved Cities Yet</h3>
            <p className="muted">
              Start exploring cities and save your favorites to see them here.
            </p>
            <a href="/cities" className="btn primary">
              Explore Cities
            </a>
          </div>
        ) : (
          <>
            {/* Results */}
            <div className="grid">
              {cities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <div className="pagination">
                  {pagination.has_prev_page && (
                    <button 
                      className="btn ghost"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  )}
                  
                  <span style={{ margin: '0 20px' }}>
                    Page {currentPage} of {pagination.total_pages}
                  </span>
                  
                  {pagination.has_next_page && (
                    <button 
                      className="btn ghost"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
                
                <p className="muted" style={{ marginTop: '20px' }}>
                  {pagination.total_items} saved cities total
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
