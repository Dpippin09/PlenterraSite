// API Configuration for Plenterra
// NOTE: In production, these should be environment variables on your server

const API_CONFIG = {
    // Your secure backend API (Ward Labs API key is stored safely on the server)
    BASE_URL: 'http://localhost:3001/api', // Development URL
    // Production: 'https://your-backend-domain.com/api'
    
    // Authentication endpoints
    AUTH: {
        LOGIN_ENDPOINT: '/auth/login',
        SIGNUP_ENDPOINT: '/auth/signup',
        LOGOUT_ENDPOINT: '/auth/logout'
    },
    
    // Soil data endpoints (these proxy to Ward Labs securely)
    SOIL_DATA: {
        GET_REPORTS: '/soil/reports',
        SUBMIT_SAMPLE: '/soil/submit-sample',
        GET_RECOMMENDATIONS: '/soil/recommendations',
        TEST_CONNECTION: '/soil/test-connection' // Dev only
    },
    
    // User management endpoints
    USER: {
        GET_PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        GET_FIELDS: '/users/fields',
        ADD_FIELD: '/users/fields'
    }
};

// Security headers for API requests
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Helper function to get API headers with auth token
function getAuthHeaders(token = null) {
    const headers = { ...API_HEADERS };
    
    // Get token from localStorage if not provided
    if (!token) {
        token = localStorage.getItem('plenterraAuthToken');
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}
