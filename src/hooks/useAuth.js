import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  setLoading, 
  setError, 
  clearError, 
  loginSuccess, 
  registerSuccess, 
  logout, 
  setToken, 
  updateUser 
} from '../store/slices/authSlice';
import { setUserProfile, clearUser } from '../store/slices/userSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const user = useAppSelector(state => state.user);

  const actions = {
    setLoading: (loading) => dispatch(setLoading(loading)),
    setError: (error) => dispatch(setError(error)),
    clearError: () => dispatch(clearError()),
    loginSuccess: (data) => {
      dispatch(loginSuccess(data));
      dispatch(setUserProfile(data.user));
    },
    registerSuccess: (data) => {
      dispatch(registerSuccess(data));
      dispatch(setUserProfile(data.user));
    },
    logout: () => {
      dispatch(logout());
      dispatch(clearUser());
    },
    setToken: (token) => dispatch(setToken(token)),
    updateUser: (updates) => dispatch(updateUser(updates)),
    setUserProfile: (profile) => dispatch(setUserProfile(profile)),
  };

  return {
    ...auth,
    user,
    actions,
  };
};
