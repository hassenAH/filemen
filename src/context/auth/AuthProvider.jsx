import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Ensure this hook is implemented correctly
import AuthContext from 'context/auth/auth-context';




// Custom hook to use the Auth Context
export const useAuthContext = () => useContext(AuthContext);

// Initial state for the Auth reducer
const initialState = {
  user: null,
  name: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  addresses: [],
  verified: false,
  authIsReady: false,
};

// Auth reducer to handle authentication state changes
const authReducer = (state, action) => {
  
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        name: action.payload.name,
        lastName: action.payload.lastname,
        email: action.payload.email,
        phoneNumber: action.payload.phone,
        addresses: [],
        isVerified: action.payload.verified,
        isAdmin: action.payload.isAdmin ,
        authIsReady: true, // Ensure this is set to true once the user is fetched
      };
    case 'CLEAR_USER':
      return { ...initialState, authIsReady: true };
    case 'UPDATE_USER':
        return {
          ...state,
          name: action.payload.name,
          lastName: action.payload.lastname,
          phoneNumber: action.payload.phone,
          authIsReady: true, 
           
        };
    default:
      return state;
  }
};

// Function to fetch user data from the API
const fetchUserData = async (token) => {
  try {
    const response = await fetch(`https://filamen.com.tn/api/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    throw error;
  }
};

// AuthProvider component to wrap the application
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { login, logout } = useAuth(); // Assuming useAuth manages login/logout state

  useEffect(() => {
    // Verify the user's token and fetch user data
    const verifyUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await fetchUserData(token); // Fetch user data with the token
          dispatch({ type: 'SET_USER', payload: userData });
        } catch (error) {
          console.error('Error verifying user token:', error);
          localStorage.removeItem('accessToken'); // Clear invalid token from storage
          dispatch({ type: 'CLEAR_USER' });
        }
      } else {
        dispatch({ type: 'CLEAR_USER' }); // No token found, clear the user state
      }
    };

    verifyUser();
  }, [login, logout]); // Re-run the effect if login/logout changes

  return (
    <AuthContext.Provider value={{ ...state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
