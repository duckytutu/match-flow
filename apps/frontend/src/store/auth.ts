import { create } from 'zustand';
import apiClient from '@/lib/axios';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isApproved: boolean;
  levelPoint?: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

// Helper function to get user from localStorage
const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getUserFromStorage(),
  loading: true,
  initialized: false,
  setUser: (user) => {
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  setLoading: (loading) => set({ loading }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, loading: false, initialized: false });
    window.location.href = '/tournaments';
  },
  initializeAuth: async () => {
    const state = get();
    if (state.initialized) {
      return;
    }

    const token = localStorage.getItem('token');
    const storedUser = getUserFromStorage();
    
    if (!token) {
      set({ loading: false, initialized: true });
      return;
    }

    // If we have a stored user, use it immediately and don't call API
    if (storedUser) {
      set({ user: storedUser, loading: false, initialized: true });
      return;
    }

    // Only call API if we have token but no stored user
    try {
      const response = await apiClient.get('/auth/me');
      const userData = response.data;
      
      // Save user to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      set({ user: userData, loading: false, initialized: true });
    } catch (error) {
      // Only clear token if it's a 401 error (unauthorized)
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, loading: false, initialized: true });
      } else {
        // For other errors, keep the token but set user to null
        set({ user: null, loading: false, initialized: true });
      }
    }
  },
})); 