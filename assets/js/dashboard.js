// Dashboard JavaScript Functionality

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('plenterraLoggedIn');
    if (!isLoggedIn && window.location.pathname.includes('farmer-')) {
        window.location.href = 'login-signup.html';
    }
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    
    // Add smooth animations
    animateProgressBars();
    
    // Initialize tooltips and interactive elements
    initializeInteractivity();
});

// Load user data from localStorage or API
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('plenterraUserData')) || getDefaultUserData();
    
    // Update dashboard with user data
    if (document.getElementById('farmer-name')) {
        document.getElementById('farmer-name').textContent = userData.firstName;
    }
    
    if (document.getElementById('farmer-full-name')) {
        document.getElementById('farmer-full-name').textContent = `${userData.firstName} ${userData.lastName}`;
    }
    
    if (document.getElementById('last-login-date')) {
        document.getElementById('last-login-date').textContent = formatDate(new Date());
    }
    
    // Update stats
    updateDashboardStats(userData);
}

// Default user data for demo purposes
function getDefaultUserData() {
    return {
        firstName: 'John',
        lastName: 'Anderson',
        email: 'john.anderson@email.com',
        phone: '(555) 123-4567',
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

// Update dashboard statistics
function updateDashboardStats(userData) {
    if (document.getElementById('total-acres')) {
        document.getElementById('total-acres').textContent = userData.totalAcres;
    }
    
    if (document.getElementById('soil-health-score')) {
        document.getElementById('soil-health-score').textContent = `${userData.stats.soilHealthScore}/10`;
    }
    
    if (document.getElementById('water-retention')) {
        document.getElementById('water-retention').textContent = `${userData.stats.waterRetention}%`;
    }
    
    if (document.getElementById('carbon-sequestered')) {
        document.getElementById('carbon-sequestered').textContent = `${userData.stats.carbonSequestered} tons`;
    }
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}

// Initialize interactive elements
function initializeInteractivity() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .field-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Tab functionality for profile page
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Field detail view
function viewFieldDetails(fieldId) {
    const userData = JSON.parse(localStorage.getItem('plenterraUserData')) || getDefaultUserData();
    const field = userData.fields.find(f => f.id === fieldId);
    
    if (field) {
        alert(`Field Details:\n\nName: ${field.name}\nSize: ${field.size} acres\nCrop: ${field.crop}\nSoil Type: ${field.soilType}\nHealth Score: ${field.healthScore}/10\nLast Treatment: ${formatDate(new Date(field.lastTreatment))}`);
    }
}

// Quick action functions
function scheduleTest() {
    alert('Soil test scheduling feature coming soon! Please contact us directly to schedule your next soil analysis.');
}

function requestTreatment() {
    alert('Treatment request feature coming soon! Our team will contact you to discuss custom treatment options.');
}

function downloadReport() {
    alert('Report download feature coming soon! You will be able to download comprehensive soil health reports in PDF format.');
}

function contactSupport() {
    window.location.href = 'contact.html';
}

// Profile management functions
function savePersonalInfo() {
    const userData = JSON.parse(localStorage.getItem('plenterraUserData')) || getDefaultUserData();
    
    userData.firstName = document.getElementById('first-name').value;
    userData.lastName = document.getElementById('last-name').value;
    userData.email = document.getElementById('email').value;
    userData.phone = document.getElementById('phone').value;
    
    localStorage.setItem('plenterraUserData', JSON.stringify(userData));
    
    showNotification('Personal information saved successfully!', 'success');
}

function saveFarmInfo() {
    const userData = JSON.parse(localStorage.getItem('plenterraUserData')) || getDefaultUserData();
    
    userData.farmName = document.getElementById('farm-name').value;
    userData.totalAcres = parseInt(document.getElementById('total-acreage').value);
    userData.farmingType = document.getElementById('farming-type').value;
    userData.yearsFarming = parseInt(document.getElementById('years-farming').value);
    userData.primaryCrops = document.getElementById('primary-crops').value;
    
    localStorage.setItem('plenterraUserData', JSON.stringify(userData));
    
    showNotification('Farm information saved successfully!', 'success');
}

function addNewField() {
    alert('Add new field feature coming soon! You will be able to add and manage multiple fields from your profile.');
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all password fields.', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match.', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long.', 'error');
        return;
    }
    
    // In a real application, this would make an API call
    showNotification('Password changed successfully!', 'success');
    
    // Clear password fields
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function saveNotificationSettings() {
    const checkboxes = document.querySelectorAll('.notification-item input[type="checkbox"]');
    const settings = {};
    
    checkboxes.forEach((checkbox, index) => {
        settings[`notification_${index}`] = checkbox.checked;
    });
    
    localStorage.setItem('plenterraNotificationSettings', JSON.stringify(settings));
    showNotification('Notification preferences saved!', 'success');
}

function exportData() {
    const userData = JSON.parse(localStorage.getItem('plenterraUserData')) || getDefaultUserData();
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'plenterra_data_export.json';
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

function deleteAccount() {
    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmation) {
        const finalConfirmation = prompt('Type "DELETE" to confirm account deletion:');
        
        if (finalConfirmation === 'DELETE') {
            localStorage.removeItem('plenterraUserData');
            localStorage.removeItem('plenterraLoggedIn');
            localStorage.removeItem('plenterraNotificationSettings');
            
            alert('Account deleted successfully. You will be redirected to the homepage.');
            window.location.href = 'index.html';
        } else {
            showNotification('Account deletion cancelled.', 'info');
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('plenterraLoggedIn');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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

// Simulate real-time data updates (for demo purposes)
function simulateDataUpdates() {
    setInterval(() => {
        // Randomly update some metrics
        const soilHealthScore = document.getElementById('soil-health-score');
        if (soilHealthScore) {
            const currentScore = parseFloat(soilHealthScore.textContent);
            const newScore = Math.max(7.0, Math.min(10.0, currentScore + (Math.random() - 0.5) * 0.1));
            soilHealthScore.textContent = `${newScore.toFixed(1)}/10`;
        }
        
        const waterRetention = document.getElementById('water-retention');
        if (waterRetention) {
            const currentRetention = parseInt(waterRetention.textContent);
            const newRetention = Math.max(75, Math.min(95, currentRetention + Math.floor((Math.random() - 0.5) * 3)));
            waterRetention.textContent = `${newRetention}%`;
        }
    }, 30000); // Update every 30 seconds
}

// Start data simulation if on dashboard
if (window.location.pathname.includes('farmer-dashboard')) {
    simulateDataUpdates();
}
