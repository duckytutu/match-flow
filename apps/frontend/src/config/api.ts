// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
};

// Axios instance configuration
export const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  USER_APPROVE: (id: number) => `/users/${id}/approve`,
  USER_DELETE: (id: number) => `/users/${id}`,
  USER_UPDATE: (id: number) => `/users/${id}`,
  USER_PROFILE: '/users/profile',
  
  // Tournaments
  TOURNAMENTS: '/tournaments',
  TOURNAMENT_DETAIL: (id: number) => `/tournaments/${id}`,
  TOURNAMENT_CREATE: '/tournaments',
  TOURNAMENT_UPDATE: (id: number) => `/tournaments/${id}`,
  TOURNAMENT_DELETE: (id: number) => `/tournaments/${id}`,
  
  // Registrations
  REGISTRATIONS: '/registrations',
  REGISTRATION_CREATE: '/registrations',
  REGISTRATION_UPDATE: (id: number) => `/registrations/${id}`,
  REGISTRATION_DELETE: (id: number) => `/registrations/${id}`,
  
  // Matches
  MATCHES: '/matches',
  MATCH_DETAIL: (id: number) => `/matches/${id}`,
  MATCH_CREATE: '/matches',
  MATCH_UPDATE: (id: number) => `/matches/${id}`,
  
  // Scores
  SCORES: '/scores',
  SCORE_CREATE: '/scores',
  SCORE_UPDATE: (id: number) => `/scores/${id}`,
}; 