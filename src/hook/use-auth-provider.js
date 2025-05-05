import { useContext } from 'react';

import {AuthContext} from "../context/AuthContext.tsx";

export const useAuthProvider = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthProvider must be used within an AuthProvider');
  }
  return context;
};