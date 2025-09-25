// API Service functions for Plenterra
// This file handles all API communications

class PlenterraAPI {
    
    // Authentication API calls
    static async login(username, password) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN_ENDPOINT}`, {
                method: 'POST',
                headers: API_HEADERS,
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            
            // Store the authentication token
            if (data.token) {
                localStorage.setItem('plenterraAuthToken', data.token);
            }
            
            return data;
        } catch (error) {
            console.error('Login API Error:', error);
            throw error;
        }
    }

    static async signup(userData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.SIGNUP_ENDPOINT}`, {
                method: 'POST',
                headers: API_HEADERS,
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const data = await response.json();
            
            // Store the authentication token
            if (data.token) {
                localStorage.setItem('plenterraAuthToken', data.token);
            }
            
            return data;
        } catch (error) {
            console.error('Signup API Error:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            const token = localStorage.getItem('plenterraAuthToken');
            if (token) {
                await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGOUT_ENDPOINT}`, {
                    method: 'POST',
                    headers: getAuthHeaders(token)
                });
            }
        } catch (error) {
            console.error('Logout API Error:', error);
        } finally {
            // Clear local storage regardless of API call success
            localStorage.removeItem('plenterraAuthToken');
            localStorage.removeItem('plenterraUserData');
            localStorage.removeItem('plenterraLoggedIn');
        }
    }

    // Soil data API calls (secured through your backend)
    static async getSoilReports(farmerId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.SOIL_DATA.GET_REPORTS}/${farmerId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch soil reports');
            }

            return await response.json();
        } catch (error) {
            console.error('Soil Reports API Error:', error);
            throw error;
        }
    }

    static async submitSoilSample(sampleData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.SOIL_DATA.SUBMIT_SAMPLE}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(sampleData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit soil sample');
            }

            return await response.json();
        } catch (error) {
            console.error('Submit Sample API Error:', error);
            throw error;
        }
    }

    static async getSoilRecommendations(fieldId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.SOIL_DATA.GET_RECOMMENDATIONS}/${fieldId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            return await response.json();
        } catch (error) {
            console.error('Recommendations API Error:', error);
            throw error;
        }
    }

    // Test Ward Labs connection (development only)
    static async testWardLabsConnection() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.SOIL_DATA.TEST_CONNECTION}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('Connection Test Error:', error);
            throw error;
        }
    }

    // User data API calls
    static async getUserData(userId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            return await response.json();
        } catch (error) {
            console.error('Get User Data API Error:', error);
            throw error;
        }
    }

    // Utility function to check if user is authenticated
    static isAuthenticated() {
        const token = localStorage.getItem('plenterraAuthToken');
        return !!token;
    }

    // Utility function to refresh authentication token
    static async refreshToken() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REFRESH_ENDPOINT}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('plenterraAuthToken', data.token);
            }
            
            return data;
        } catch (error) {
            console.error('Token Refresh Error:', error);
            // If refresh fails, logout user
            this.logout();
            throw error;
        }
    }
}
