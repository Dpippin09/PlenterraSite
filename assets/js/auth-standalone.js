// Authentication functionality for PLENTERRA - Standalone Version

// Show login or signup tab
function showAuthTab(tabName) {
    // Hide all forms
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected form
    document.getElementById(`${tabName}-form`).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!username || !password) {
        showAuthNotification('Please fill in all fields.', 'error');
        return;
    }
    
    // Simulate authentication (in real app, this would be an API call)
    if (authenticateUser(username, password)) {
        // Set login state
        localStorage.setItem('plenterraLoggedIn', 'true');
        
        // Set user data
        const userData = getUserData(username);
        localStorage.setItem('plenterraUserData', JSON.stringify(userData));
        
        showAuthNotification('Login successful!', 'success');
        
        // For standalone version, just show success message
        setTimeout(() => {
            showAuthNotification('You are now logged in. In a full application, you would be redirected to your dashboard.', 'info');
        }, 2000);
    } else {
        showAuthNotification('Invalid username or password. Please try again.', 'error');
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        firstName: formData.get('firstname'),
        lastName: formData.get('lastname'),
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password'),
        termsAgreed: document.getElementById('terms-agree').checked
    };
    
    // Validation
    if (!validateSignupData(userData)) {
        return;
    }
    
    // Check if username/email already exists (simulate)
    if (checkUserExists(userData.username, userData.email)) {
        showAuthNotification('Username or email already exists. Please choose another.', 'error');
        return;
    }
    
    // Create user account (simulate)
    const newUser = createUser(userData);
    
    // Set login state
    localStorage.setItem('plenterraLoggedIn', 'true');
    localStorage.setItem('plenterraUserData', JSON.stringify(newUser));
    
    showAuthNotification('Account created successfully!', 'success');
    
    // For standalone version, just show success message
    setTimeout(() => {
        showAuthNotification('Your account has been created. In a full application, you would be redirected to your dashboard.', 'info');
    }, 2000);
}

// Demo login for testing
function demoLogin() {
    const demoUser = {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        username: 'demo_user',
        id: 'demo_001'
    };
    
    localStorage.setItem('plenterraLoggedIn', 'true');
    localStorage.setItem('plenterraUserData', JSON.stringify(demoUser));
    
    showAuthNotification('Demo login successful!', 'success');
    
    setTimeout(() => {
        showAuthNotification('Welcome, Demo User! In a full application, you would have access to your dashboard.', 'info');
    }, 2000);
}

// Validate signup data
function validateSignupData(userData) {
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'username', 'password'];
    
    for (const field of requiredFields) {
        if (!userData[field]) {
            showAuthNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showAuthNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate password strength
    if (userData.password.length < 8) {
        showAuthNotification('Password must be at least 8 characters long.', 'error');
        return false;
    }
    
    // Check password confirmation
    if (userData.password !== userData.confirmPassword) {
        showAuthNotification('Passwords do not match.', 'error');
        return false;
    }
    
    // Check terms agreement
    if (!userData.termsAgreed) {
        showAuthNotification('Please agree to the Terms of Service and Privacy Policy.', 'error');
        return false;
    }
    
    return true;
}

// Simulate user authentication
function authenticateUser(username, password) {
    // In a real application, this would make an API call
    // For demo purposes, accept any username with password "password"
    return password === 'password' || (username === 'demo' && password === 'demo');
}

// Check if user exists (simulate)
function checkUserExists(username, email) {
    // In a real application, this would check against a database
    // For demo purposes, block some common usernames
    const blockedUsernames = ['admin', 'test', 'user'];
    const blockedEmails = ['admin@example.com', 'test@example.com'];
    
    return blockedUsernames.includes(username.toLowerCase()) || 
           blockedEmails.includes(email.toLowerCase());
}

// Create user account (simulate)
function createUser(userData) {
    return {
        id: generateUserId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };
}

// Get user data (simulate)
function getUserData(username) {
    // In a real application, this would fetch from a database
    return {
        id: generateUserId(),
        firstName: 'John',
        lastName: 'Doe',
        email: `${username}@example.com`,
        username: username,
        lastLogin: new Date().toISOString()
    };
}

// Generate a simple user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Show notification to user
function showAuthNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.auth-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#auth-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'auth-notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Get notification color based on type
function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#1a5f3a';
        case 'error':
            return '#dc3545';
        case 'warning':
            return '#ffc107';
        case 'info':
        default:
            return '#2d7a4d';
    }
}

// Show forgot password functionality
function showForgotPassword() {
    showAuthNotification('Forgot password functionality would be implemented here in a full application.', 'info');
}

// Show terms of service
function showTerms() {
    showAuthNotification('Terms of Service would be displayed here in a full application.', 'info');
}

// Show privacy policy
function showPrivacy() {
    showAuthNotification('Privacy Policy would be displayed here in a full application.', 'info');
}

// Add floating label functionality
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-group input');
    
    inputs.forEach(input => {
        // Set initial state based on whether input has value
        if (input.value) {
            input.classList.add('has-value');
        }
        
        // Handle input events
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Handle focus events
        input.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
    
    // Check if user is already logged in
    checkLoginStatus();
});

// Check login status on page load
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('plenterraLoggedIn') === 'true';
    const userData = localStorage.getItem('plenterraUserData');
    
    if (isLoggedIn && userData) {
        const user = JSON.parse(userData);
        showAuthNotification(`Welcome back, ${user.firstName || user.username}! You are already logged in.`, 'info');
    }
}

// Logout function (for testing)
function logout() {
    localStorage.removeItem('plenterraLoggedIn');
    localStorage.removeItem('plenterraUserData');
    localStorage.removeItem('plenterraRememberMe');
    showAuthNotification('Logged out successfully!', 'success');
}
