import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api.js'; 

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  // user will now be set based on the backend's session status
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true); // To indicate if auth state is being loaded
  const [error, setError] = useState(null); // To capture auth errors

  /**
   * Fetches the authentication status from the backend.
   * This function is called on initial load and after potential login redirects.
   */
  const checkAuthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // setuser(123)
      const res = await authApi.checkStatus();
      console.log("in auth context ",res)
      if (res.data.isAuthenticated) {
        setuser(res.data.user); // Set user from backend response
        // Optionally store other user details if needed, but session is primary
      } else {
        setuser(null); // Not authenticated
      }
    } catch (err) {
      // If the backend returns 401, it means not authenticated.
      // For other errors, it's a server issue.
      if (err.response && err.response.status === 401) {
        setuser(null);
        console.log("Not authenticated (session expired or not logged in).");
      } else {
        setError("Failed to check authentication status. Server error.");
        console.error("Error checking auth status:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // On component mount, check authentication status
  useEffect(() => {
        checkAuthStatus()
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Initiates the login process by redirecting to the backend's Google OAuth endpoint.
   * The backend will handle the OAuth flow and set the session cookie.
   */
  const login = () => {
    // Redirect to your backend's Google OAuth initiation route
   // window.location.href = 'http://localhost:5000/auth/google';
    window.location.href = 'https://zeno-crm-baackend.onrender.com/auth/google';
    // After successful OAuth, Google will redirect back to your backend,
    // and your backend should then redirect back to your frontend (e.g., http://localhost:5173)
    // At that point, `checkAuthStatus` will automatically run again due to `useEffect`
    // and detect the new session cookie.
  };

  /**
   * Logs out the user by calling the backend's logout endpoint.
   * Clears the local user ID state.
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.logout();
      setuser(null); // Clear user ID on successful logout
      // No need to clear localStorage for token as it's session-based
      console.log("Logged out successfully.");
    } catch (err) {
      setError("Failed to log out. Please try again.");
      console.error("Error during logout:", err);
    } finally {
      setLoading(false);
    }
  };

  // Provide the auth state and functions to children components
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
