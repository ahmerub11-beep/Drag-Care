import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { hasDashboardAccess, isSuperAdminRole } from '../utils/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dragcare_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('dragcare_token') || null;
  });

  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('dragcare_token')));
  const [error, setError] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('dragcare_user', JSON.stringify(user));
      localStorage.setItem('dragcare_token', token);
    } else {
      localStorage.removeItem('dragcare_user');
      localStorage.removeItem('dragcare_token');
    }
  }, [user, token]);

  useEffect(() => {
    const savedToken = localStorage.getItem('dragcare_token');
    if (!savedToken) return;

    apiFetch('/auth/me', {
      headers: { Authorization: `Bearer ${savedToken}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Your session has expired');
        }
        setUser(data.user);
        setToken(savedToken);
      })
      .catch(() => {
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Register handler
  const register = async ({ name, email, password, role, phone }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dragcare_user');
    localStorage.removeItem('dragcare_token');
  };

  const isSuperAdmin = isSuperAdminRole(user?.role);
  const isAdmin = hasDashboardAccess(user?.role);
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isSuperAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;