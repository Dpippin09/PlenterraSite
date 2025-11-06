// Products Page JavaScript Functionality

// Category Tab Management
function showCategory(categoryId) {
    // Hide all category sections
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected category
    document.getElementById(categoryId).classList.add('active');
    
    // Mark selected tab as active
    event.target.classList.add('active');
    
    // Store selection in localStorage for persistence
    localStorage.setItem('selectedCategory', categoryId);
}

// Initialize page based on stored category or default
document.addEventListener('DOMContentLoaded', function() {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        const categorySection = document.getElementById(savedCategory);
        const categoryTab = document.querySelector(`[onclick="showCategory('${savedCategory}')"]`);
        
        if (categorySection && categoryTab) {
            // Hide current active section
            document.querySelector('.category-section.active')?.classList.remove('active');
            document.querySelector('.tab-btn.active')?.classList.remove('active');
            
            // Show saved category
            categorySection.classList.add('active');
            categoryTab.classList.add('active');
        }
    }
});

// Soil Test Ordering
async function orderSoilTest(testType) {
    try {
        // Get auth token
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Please log in to order soil tests');
            window.location.href = 'login-signup.html';
            return;
        }
        
        // Get user profile to find fields
        const userResponse = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to get user profile');
        }
        
        const userData = await userResponse.json();
        const fields = userData.user.fields || [];
        
        if (fields.length === 0) {
            alert('You need to add fields to your profile before ordering soil tests. Please visit your profile page to add fields.');
            return;
        }
        
        // Show field selection modal
        showFieldSelectionModal(fields, testType);
        
    } catch (error) {
        console.error('Error ordering soil test:', error);
        alert('Failed to initiate soil test order. Please try again.');
    }
}

// Show field selection modal for soil tests
function showFieldSelectionModal(fields, testType) {
    // Create modal HTML
    const modalHTML = `
        <div id="fieldModal" class="modal-overlay" onclick="closeModal('fieldModal')">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>Select Field for ${getTestTypeName(testType)} Test</h3>
                    <button class="close-btn" onclick="closeModal('fieldModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Choose which field you'd like to test:</p>
                    <div class="field-selection">
                        ${fields.map(field => `
                            <div class="field-option">
                                <input type="radio" id="field-${field.id}" name="selectedField" value="${field.id}">
                                <label for="field-${field.id}">
                                    <div class="field-info">
                                        <h4>${field.name}</h4>
                                        <p>${field.size} acres • ${field.crop} • ${field.soilType}</p>
                                    </div>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                    <div class="test-requirements">
                        <h4>Test Requirements:</h4>
                        <div class="requirements-list">
                            ${getTestRequirements(testType).map(req => `
                                <label class="requirement-item">
                                    <input type="checkbox" value="${req}" checked>
                                    <span>${req}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal('fieldModal')">Cancel</button>
                    <button class="btn btn-primary" onclick="submitSoilTestOrder('${testType}')">Submit Sample Request</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Submit soil test order
async function submitSoilTestOrder(testType) {
    try {
        const selectedField = document.querySelector('input[name="selectedField"]:checked');
        if (!selectedField) {
            alert('Please select a field to test');
            return;
        }
        
        const selectedRequirements = Array.from(document.querySelectorAll('.requirements-list input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/samples/submit', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fieldId: selectedField.value,
                testRequirements: selectedRequirements,
                testType: testType
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit sample request');
        }
        
        const result = await response.json();
        
        // Close modal
        closeModal('fieldModal');
        
        // Show success message with sample info
        showSuccessModal(result);
        
    } catch (error) {
        console.error('Error submitting soil test order:', error);
        alert('Failed to submit sample request. Please try again.');
    }
}

// Show success modal with sample information
function showSuccessModal(sampleData) {
    const modalHTML = `
        <div id="successModal" class="modal-overlay" onclick="closeModal('successModal')">
            <div class="modal-content success-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>✅ Sample Request Submitted Successfully!</h3>
                    <button class="close-btn" onclick="closeModal('successModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="success-info">
                        <p><strong>Sample ID:</strong> ${sampleData.sampleId}</p>
                        <p><strong>Barcode:</strong> ${sampleData.barcode}</p>
                    </div>
                    <div class="shipping-instructions">
                        <h4>Shipping Instructions:</h4>
                        <div class="shipping-address">
                            <p><strong>${sampleData.instructions.shippingAddress.name}</strong></p>
                            <p>${sampleData.instructions.shippingAddress.address}</p>
                            <p>${sampleData.instructions.shippingAddress.city}, ${sampleData.instructions.shippingAddress.state} ${sampleData.instructions.shippingAddress.zip}</p>
                            <p>Phone: ${sampleData.instructions.shippingAddress.phone}</p>
                        </div>
                        <ol class="instruction-list">
                            ${sampleData.instructions.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal('successModal')">Close</button>
                    <button class="btn btn-primary" onclick="viewSampleStatus()">View Sample Status</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Amendment ordering (placeholder functionality)
function orderAmendment(amendmentType) {
    alert(`Ordering ${amendmentType} - This feature will be available soon! Please contact our sales team for immediate orders.`);
}

// Biochar ordering (placeholder functionality)
function orderBiochar(biocharType) {
    alert(`Ordering ${biocharType} biochar - This feature will be available soon! Please contact our sales team for immediate orders.`);
}

// Consulting booking (placeholder functionality)
function bookConsulting(consultingType) {
    alert(`Booking ${consultingType} consultation - This feature will be available soon! Please contact our team to schedule.`);
}

// Request quote (placeholder functionality)
function requestQuote(productType) {
    alert(`Quote request for ${productType} - Our team will contact you within 24 hours with a custom quote.`);
}

// Contact sales team
function contactSalesTeam() {
    window.location.href = 'contact.html';
}

// Request demo
function requestDemo() {
    alert('Demo request submitted! Our team will contact you to schedule a personalized demonstration.');
}

// View sample status
function viewSampleStatus() {
    closeModal('successModal');
    window.location.href = 'farmer-dashboard.html#samples';
}

// Utility functions
function getTestTypeName(testType) {
    const names = {
        'comprehensive': 'Comprehensive Soil Analysis',
        'basic': 'Basic Soil Test',
        'carbon': 'Carbon Sequestration Analysis'
    };
    return names[testType] || 'Soil Test';
}

function getTestRequirements(testType) {
    const requirements = {
        'comprehensive': [
            'Standard Soil Test',
            'Organic Matter',
            'Micronutrients',
            'pH and Buffer pH',
            'Soluble Salts'
        ],
        'basic': [
            'Standard Soil Test',
            'pH and Buffer pH',
            'Organic Matter'
        ],
        'carbon': [
            'Soil Organic Carbon',
            'Carbon Sequestration Analysis',
            'Baseline Measurement'
        ]
    };
    return requirements[testType] || ['Standard Soil Test'];
}

// Modal management
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Logout function (shared with other pages)
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    window.location.href = 'index.html';
}

// Mobile menu toggle (shared functionality)
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            });
        });
    }
});
