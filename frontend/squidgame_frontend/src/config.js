// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://rahulpradeepkumar.pythonanywhere.com/api';

export const API_ENDPOINTS = {
  EPISODES: `${API_BASE_URL}/episodes/`,
  EPISODE_DETAIL: (id) => `${API_BASE_URL}/episodes/${id}/`,
  EPISODE_COMMENTS: (id) => `${API_BASE_URL}/episodes/${id}/comments/`,
  CAST: `${API_BASE_URL}/cast/`,
};

export default API_BASE_URL;