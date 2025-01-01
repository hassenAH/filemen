import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

const initialState = {
  user: null,
  isVerified: false,
  isAdmin: false,
  authIsReady: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isVerified: action.payload.isVerified,
        isAdmin: action.payload.isAdmin,
        authIsReady: true,
      };
    case 'CLEAR_USER':
      return initialState;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { login, logout } = useAuth();  // Assuming useAuth is adapted to handle persisting login state

  useEffect(() => {
    // Suppose your token is stored in localStorage or cookies
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Call API to validate token and retrieve user data
        try {
          const userData = await fetchUserData(token); // Implement this function to call your backend
          dispatch({ type: 'SET_USER', payload: userData });
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');  // Handle token expiration or validation failure
          dispatch({ type: 'CLEAR_USER' });
        }
      }
    };

    verifyUser();
  }, [login, logout]);  // Depend on login/logout to re-trigger verification after auth changes

  return (
    <AuthContext.Provider value={{ ...state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
