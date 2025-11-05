// API Configuration
const config = {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://rahulpradeepkumar.pythonanywhere.com/api',
    API_VERSION: process.env.REACT_APP_API_VERSION || 'v1',
};

// Build full API URL
config.API_URL = `${config.API_BASE_URL}`;

export default config;
