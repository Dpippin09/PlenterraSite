// Authentication functionality for PLENTERRA

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
    const rememberMeElement = document.getElementById('remember-me');
    const rememberMe = rememberMeElement ? rememberMeElement.checked : false;
    
    // Basic validation
    if (!username || !password) {
        showAuthNotification('Please fill in all fields.', 'error');
        return;
    }
    
    // Simulate authentication (in real app, this would be an API call)
    if (authenticateUser(username, password)) {
        // Set login state
        localStorage.setItem('plenterraLoggedIn', 'true');
        
        if (rememberMe) {
            localStorage.setItem('plenterraRememberMe', 'true');
        }
        
        // Set user data
        const userData = getUserData(username);
        localStorage.setItem('plenterraUserData', JSON.stringify(userData));
        
        showAuthNotification('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'farmer-dashboard.html';
        }, 1500);
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
        farmName: formData.get('farm-name'),
        farmSize: parseInt(formData.get('farm-size')),
        farmType: formData.get('farm-type'),
        termsAgreed: document.getElementById('simple-terms-agree').checked
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
    
    showAuthNotification('Account created successfully! Redirecting to dashboard...', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'farmer-dashboard.html';
    }, 1500);
}

// Demo login for testing
function demoLogin() {
    const demoUser = {
        firstName: 'John',
        lastName: 'Anderson',
        email: 'john.anderson@demo.com',
        username: 'demo_farmer',
        farmName: 'Anderson Family Farm',
        totalAcres: 450,
        farmingType: 'row-crop',
        yearsFarming: 25,
        primaryCrops: 'Corn, Soybeans, Wheat',
        stats: {
            soilHealthScore: 8.2,
            waterRetention: 85,
            carbonSequestered: 12.5,
            totalCredits: 847
        },
        fields: [
            {
                id: 'north',
                name: 'North Field',
                size: 180,
                crop: 'Corn',
                soilType: 'Clay Loam',
                healthScore: 8.5,
                lastTreatment: '2024-12-15'
            },
            {
                id: 'south',
                name: 'South Field',
                size: 200,
                crop: 'Soybeans',
                soilType: 'Sandy Loam',
                healthScore: 7.8,
                lastTreatment: '2024-11-28'
            },
            {
                id: 'east',
                name: 'East Field',
                size: 70,
                crop: 'Wheat',
                soilType: 'Silt Loam',
                healthScore: 8.1,
                lastTreatment: '2024-10-05'
            }
        ]
    };
    
    localStorage.setItem('plenterraLoggedIn', 'true');
    localStorage.setItem('plenterraUserData', JSON.stringify(demoUser));
    
    showAuthNotification('Demo login successful! Redirecting to dashboard...', 'success');
    
    setTimeout(() => {
        window.location.href = 'farmer-dashboard.html';
    }, 1500);
}

// Validate signup data
function validateSignupData(userData) {
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'username', 'password', 'farmName', 'farmSize', 'farmType'];
    
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
    
    // Validate farm size
    if (userData.farmSize < 1) {
        showAuthNotification('Farm size must be at least 1 acre.', 'error');
        return false;
    }
    
    return true;
}

// Simulate user authentication
function authenticateUser(username, password) {
    // Check demo credentials first
    const validCredentials = [
        { username: 'demo', password: 'demo123' },
        { username: 'farmer', password: 'farmer123' },
        { username: 'john_anderson', password: 'plenterra2024' },
        { username: 'demo_farmer', password: 'demo' }
    ];
    
    const isDemoUser = validCredentials.some(cred => 
        (cred.username === username || cred.username === username.toLowerCase()) && 
        cred.password === password
    );
    
    if (isDemoUser) {
        return true;
    }
    
    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('plenterraRegisteredUsers') || '[]');
    
    const foundUser = registeredUsers.find(user => 
        (user.username.toLowerCase() === username.toLowerCase() || user.email.toLowerCase() === username.toLowerCase()) && 
        user.password === password
    );
    
    return !!foundUser;
}

// Get user data based on username
function getUserData(username) {
    // Check if it's a registered user first
    const registeredUsers = JSON.parse(localStorage.getItem('plenterraRegisteredUsers') || '[]');
    const registeredUser = registeredUsers.find(user => 
        user.username.toLowerCase() === username.toLowerCase() || 
        user.email.toLowerCase() === username.toLowerCase()
    );
    
    if (registeredUser) {
        // Return the actual registered user data (without password for security)
        const { password, ...userDataWithoutPassword } = registeredUser;
        return userDataWithoutPassword;
    }
    
    // Return demo user data for demo accounts
    return {
        firstName: 'John',
        lastName: 'Anderson',
        email: 'john.anderson@email.com',
        username: username,
        farmName: 'Anderson Family Farm',
        totalAcres: 450,
        farmingType: 'row-crop',
        yearsFarming: 25,
        primaryCrops: 'Corn, Soybeans, Wheat',
        stats: {
            soilHealthScore: 8.2,
            waterRetention: 85,
            carbonSequestered: 12.5,
            totalCredits: 847
        },
        fields: [
            {
                id: 'north',
                name: 'North Field',
                size: 180,
                crop: 'Corn',
                soilType: 'Clay Loam',
                healthScore: 8.5,
                lastTreatment: '2024-12-15'
            },
            {
                id: 'south',
                name: 'South Field',
                size: 200,
                crop: 'Soybeans',
                soilType: 'Sandy Loam',
                healthScore: 7.8,
                lastTreatment: '2024-11-28'
            },
            {
                id: 'east',
                name: 'East Field',
                size: 70,
                crop: 'Wheat',
                soilType: 'Silt Loam',
                healthScore: 8.1,
                lastTreatment: '2024-10-05'
            }
        ]
    };
}

// Check if user already exists
function checkUserExists(username, email) {
    const registeredUsers = JSON.parse(localStorage.getItem('plenterraRegisteredUsers') || '[]');
    return registeredUsers.some(user => 
        user.username.toLowerCase() === username.toLowerCase() || 
        user.email.toLowerCase() === email.toLowerCase()
    );
}

// Create new user account
function createUser(userData) {
    const newUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: userData.password, // In real app, this would be hashed
        farmName: userData.farmName,
        totalAcres: userData.farmSize,
        farmingType: userData.farmType,
        yearsFarming: 1, // New farmer
        primaryCrops: 'Not specified',
        stats: {
            soilHealthScore: 6.0, // Starting baseline
            waterRetention: 70,
            carbonSequestered: 0,
            totalCredits: 0
        },
        fields: [
            {
                id: 'main',
                name: 'Main Field',
                size: userData.farmSize,
                crop: 'Not specified',
                soilType: 'Unknown',
                healthScore: 6.0,
                lastTreatment: null
            }
        ],
        createdAt: new Date().toISOString(),
        newsletter: userData.newsletter
    };
    
    // Store the new user in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('plenterraRegisteredUsers') || '[]');
    registeredUsers.push(newUser);
    localStorage.setItem('plenterraRegisteredUsers', JSON.stringify(registeredUsers));
    
    return newUser;
}

// Show forgot password modal
function showForgotPassword() {
    alert('Password reset feature coming soon! Please contact support at support@plenterra.com for password assistance.');
}

// Show terms of service
function showTerms() {
    alert('Terms of Service:\n\nBy using PLENTERRA services, you agree to:\n- Provide accurate farm information\n- Use our soil health recommendations responsibly\n- Respect intellectual property rights\n- Follow sustainable farming practices\n\nFull terms available at plenterra.com/terms');
}

// Show privacy policy
function showPrivacy() {
    alert('Privacy Policy:\n\nPLENTERRA protects your privacy by:\n- Encrypting all personal data\n- Never sharing farm data without consent\n- Using data only to improve soil health recommendations\n- Allowing data export and deletion\n\nFull policy available at plenterra.com/privacy');
}

// Show notification
function showAuthNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transition: all 0.3s ease;
        max-width: 300px;
        transform: translateX(100%);
        opacity: 0;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#000';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('plenterraLoggedIn');
    
    if (isLoggedIn) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'farmer-dashboard.html';
    }
    
    // Auto-fill login if remember me was checked
    const rememberMe = localStorage.getItem('plenterraRememberMe');
    const userData = JSON.parse(localStorage.getItem('plenterraUserData') || '{}');
    
    if (rememberMe && userData.username) {
        const usernameField = document.getElementById('login-username');
        const rememberMeField = document.getElementById('remember-me');
        
        if (usernameField) {
            usernameField.value = userData.username;
        }
        if (rememberMeField) {
            rememberMeField.checked = true;
        }
    }
});

// Handle floating labels
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-group input');
    
    inputs.forEach(input => {
        // Check if input has value on page load
        checkLabelState(input);
        
        // Add event listeners
        input.addEventListener('input', () => checkLabelState(input));
        input.addEventListener('focus', () => checkLabelState(input));
        input.addEventListener('blur', () => checkLabelState(input));
    });
    
    function checkLabelState(input) {
        const formGroup = input.closest('.form-group');
        const label = formGroup.querySelector('label');
        
        if (input.value.trim() !== '' || input === document.activeElement) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    }
});
