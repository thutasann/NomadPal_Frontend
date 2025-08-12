# Redux Setup for NomadPal Frontend

## Overview
This project uses Redux Toolkit for state management with a clean architecture that separates concerns between slices and services.

## Structure

### Store Configuration
- **Location**: `src/store/index.js`
- **Main store** with all reducers configured
- **Middleware** configured for serializable checks

### Slices

#### 1. Auth Slice (`src/store/slices/authSlice.js`)
Manages authentication state:
- `token`: JWT token from backend
- `isAuthenticated`: Boolean indicating login status
- `isLoading`: Loading state for auth operations
- `error`: Error messages
- `user`: Basic user info from auth response

**Actions**:
- `setLoading(boolean)`
- `setError(message)`
- `clearError()`
- `loginSuccess(data)` - Sets auth state after successful login
- `registerSuccess(data)` - Sets auth state after successful registration
- `logout()` - Clears auth state and removes token
- `setToken(token)` - Manually set token
- `updateUser(updates)` - Update user data

#### 2. User Slice (`src/store/slices/userSlice.js`)
Stores detailed user profile information according to database schema:
- Basic info (id, email, display_name, created_at)
- Profile preferences (language, country, timezone, passport)
- Job preferences (title, salary, work style)
- Budget preferences (min/max monthly budget)
- Lifestyle preferences (climate, internet speed, priorities)
- Consent settings
- Saved cities and jobs

**Actions**:
- `setUserProfile(data)` - Set complete user profile
- `updateUserField(field, value)` - Update single field
- `updateUserFields(updates)` - Update multiple fields
- `clearUser()` - Clear all user data
- Saved items management (add/remove cities and jobs)

#### 3. Cities Slice (`src/store/slices/citiesSlice.js`)
Manages city data and filtering:
- `cities`: Array of all cities
- `filteredCities`: Cities after applying filters
- `currentCity`: Currently selected city
- `filters`: Filter state (budget, climate, lifestyle, etc.)
- `pagination`: Page and limit settings

**Actions**:
- `setCities(cities)` - Set all cities
- `setCurrentCity(city)` - Set selected city
- `setFilters(filters)` - Update filter state
- `applyFilters()` - Apply current filters
- `clearFilters()` - Reset all filters

#### 4. Jobs Slice (`src/store/slices/jobsSlice.js`)
Manages job listings and filtering:
- `jobs`: Array of all jobs
- `filteredJobs`: Jobs after applying filters
- `currentJob`: Currently selected job
- `filters`: Filter state (title, location, category, salary, etc.)
- `pagination`: Page and limit settings

**Actions**:
- `setJobs(jobs)` - Set all jobs
- `setCurrentJob(job)` - Set selected job
- `setFilters(filters)` - Update filter state
- `applyFilters()` - Apply current filters
- `clearFilters()` - Reset all filters

### Custom Hooks

#### useAuth Hook (`src/hooks/useAuth.js`)
Provides easy access to authentication state and actions:
```javascript
const { isAuthenticated, user, isLoading, error, actions } = useAuth();

// Use actions
actions.loginSuccess(data);
actions.logout();
actions.setLoading(true);
```

### Usage Examples

#### In Components
```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user, actions } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      actions.setLoading(true);
      const response = await authService.login(credentials);
      actions.loginSuccess(response.data);
    } catch (error) {
      actions.setError(error.message);
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.display_name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

#### Direct Store Access
```javascript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCities } from '../store/slices/citiesSlice';

function CitiesComponent() {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(state => state.cities.cities);
  const isLoading = useAppSelector(state => state.cities.isLoading);
  
  const loadCities = async () => {
    const response = await citiesService.getCities();
    dispatch(setCities(response.data));
  };
}
```

## Key Features

1. **No Thunks**: Uses simple actions and handles API calls through services
2. **Zod Validation**: Form validation before API calls
3. **React Hot Toast**: Beautiful toast notifications for user feedback
4. **Local Storage**: Token persistence across page reloads
5. **Type Safety**: Structured state management with clear action types
6. **Custom Hooks**: Easy-to-use hooks for common operations

## Database Schema Alignment

The Redux store structure directly mirrors your database schema:
- **Users table**: Stored in `user` slice
- **Cities table**: Stored in `cities` slice  
- **Jobs table**: Stored in `jobs` slice
- **Saved relationships**: Managed through user slice actions

## Best Practices

1. **Always use actions through slices** - Don't mutate state directly
2. **Use custom hooks** for common operations
3. **Handle loading states** for better UX
4. **Clear errors** when starting new operations
5. **Use Zod validation** before dispatching actions
6. **Persist critical data** (tokens) in localStorage
