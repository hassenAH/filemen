import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  name: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  addresses: [],
  verified: false,
  authIsReady: false,
});

export default AuthContext;
