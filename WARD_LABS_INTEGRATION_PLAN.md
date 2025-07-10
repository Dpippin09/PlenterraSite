# Ward Labs API Integration Plan for Plenterra Dashboard

## Overview
This plan outlines the step-by-step process to integrate Ward Labs soil testing API with the Plenterra farmer dashboard, enabling real-time soil data updates and professional soil health tracking.

## Phase 1: Research & Planning (Week 1)

### Step 1: Research Ward Labs API
- [ ] Contact Ward Labs to inquire about API access
- [ ] Review their API documentation and pricing
- [ ] Understand data formats and available endpoints
- [ ] Identify authentication requirements
- [ ] Document sample data structures

### Step 2: Define Data Requirements
- [ ] Map Ward Labs data fields to dashboard metrics
- [ ] Define soil health scoring algorithm
- [ ] Plan data storage requirements
- [ ] Create farmer account linking strategy

## Phase 2: Backend Development (Weeks 2-4)

### Step 3: Set Up Backend Infrastructure
- [ ] Choose backend technology (Node.js/Express recommended)
- [ ] Set up database (PostgreSQL or MongoDB)
- [ ] Create farmer account management system
- [ ] Implement JWT authentication

### Step 4: Database Schema Design
```sql
-- Sample schema structure
CREATE TABLE farmers (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    password_hash VARCHAR,
    farm_name VARCHAR,
    ward_labs_customer_id VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE soil_tests (
    id UUID PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id),
    ward_labs_test_id VARCHAR,
    test_date DATE,
    ph_level DECIMAL(3,1),
    nitrogen_ppm DECIMAL(6,2),
    phosphorus_ppm DECIMAL(6,2),
    potassium_ppm DECIMAL(6,2),
    organic_matter_percent DECIMAL(4,2),
    soil_health_score DECIMAL(3,1),
    raw_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE soil_recommendations (
    id UUID PRIMARY KEY,
    soil_test_id UUID REFERENCES soil_tests(id),
    recommendation_type VARCHAR,
    recommendation_text TEXT,
    priority INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 5: Ward Labs API Integration
- [ ] Create Ward Labs API client service
- [ ] Implement data fetching functions
- [ ] Set up webhook endpoints for real-time updates
- [ ] Add error handling and retry logic

```javascript
// Example API service structure
class WardLabsService {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async getTestResults(customerId) {
        // Fetch all test results for a customer
    }

    async getLatestTest(customerId) {
        // Get most recent test results
    }

    async processWebhook(webhookData) {
        // Process incoming webhook notifications
    }

    async validateConnection() {
        // Test API connection
    }
}
```

## Phase 3: API Development (Week 5)

### Step 6: Create Internal APIs
- [ ] `POST /api/farmers/register` - Create farmer account
- [ ] `POST /api/farmers/login` - Authentication
- [ ] `GET /api/soil-data/:farmerId` - Get dashboard data
- [ ] `GET /api/soil-tests/:farmerId` - Historical data
- [ ] `POST /api/webhooks/ward-labs` - Receive updates
- [ ] `GET /api/recommendations/:farmerId` - Get soil recommendations

### Step 7: Data Processing Logic
- [ ] Implement soil health score calculation
- [ ] Create trend analysis functions
- [ ] Add data validation and sanitization
- [ ] Build recommendation engine

```javascript
// Example soil health score calculation
function calculateSoilHealthScore(testData) {
    const factors = {
        ph: normalizePhScore(testData.ph_level),
        nitrogen: normalizeNutrientScore(testData.nitrogen_ppm, 'nitrogen'),
        phosphorus: normalizeNutrientScore(testData.phosphorus_ppm, 'phosphorus'),
        organicMatter: normalizeOrganicMatterScore(testData.organic_matter_percent)
    };
    
    const weights = { ph: 0.25, nitrogen: 0.25, phosphorus: 0.25, organicMatter: 0.25 };
    
    return Object.keys(factors).reduce((score, factor) => 
        score + (factors[factor] * weights[factor]), 0
    );
}
```

## Phase 4: Frontend Updates (Week 6)

### Step 8: Update Dashboard JavaScript

#### 8a. Update loadUserData() function
```javascript
async function loadRealSoilData(farmerId) {
    try {
        showLoadingState();
        const response = await fetch(`/api/soil-data/${farmerId}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch soil data');
        
        const soilData = await response.json();
        updateDashboardWithRealData(soilData);
        hideLoadingState();
    } catch (error) {
        console.error('Failed to load soil data:', error);
        showErrorMessage('Unable to load latest soil data. Showing demo data.');
        loadUserData(); // Fallback to demo data
        hideLoadingState();
    }
}
```

#### 8b. Create real data update function
```javascript
function updateDashboardWithRealData(soilData) {
    // Update soil health score
    const healthScoreElement = document.getElementById('soil-health-score');
    if (healthScoreElement) {
        healthScoreElement.textContent = `${soilData.healthScore}/10`;
        animateValueChange(healthScoreElement, soilData.healthScore);
    }
    
    // Update progress bars with real values
    updateProgressBar('ph-level', soilData.pH, 6.0, 8.0);
    updateProgressBar('nitrogen', soilData.nitrogen, 0, 100);
    updateProgressBar('phosphorus', soilData.phosphorus, 0, 50);
    
    // Update carbon sequestered based on organic matter
    const carbonSequestered = calculateCarbonFromOrganicMatter(soilData.organicMatter);
    const carbonElement = document.getElementById('carbon-sequestered');
    if (carbonElement) {
        carbonElement.textContent = `${carbonSequestered} tons`;
    }
    
    // Update last test date
    const lastTestElement = document.getElementById('last-test-date');
    if (lastTestElement && soilData.lastTestDate) {
        lastTestElement.textContent = formatDate(new Date(soilData.lastTestDate));
    }
}

function updateProgressBar(elementId, value, min, max) {
    const progressBar = document.querySelector(`#${elementId} .progress`);
    const valueElement = document.querySelector(`#${elementId} .metric-value`);
    
    if (progressBar && valueElement) {
        const percentage = ((value - min) / (max - min)) * 100;
        progressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        valueElement.textContent = value;
    }
}
```

### Step 9: Update Authentication System
- [ ] Modify registration form to collect Ward Labs customer ID
- [ ] Update login process to fetch real soil data
- [ ] Add data refresh functionality
- [ ] Implement loading states and error handling

```javascript
// Enhanced registration with Ward Labs integration
async function handleEnhancedSignup(formData) {
    try {
        const response = await fetch('/api/farmers/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                wardLabsCustomerId: formData.wardLabsId // New field
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            // Attempt to fetch initial soil data
            await loadRealSoilData(result.farmerId);
        }
    } catch (error) {
        console.error('Registration failed:', error);
    }
}
```

## Phase 5: Testing & Integration (Week 7)

### Step 10: Testing Strategy
- [ ] Unit tests for API functions
- [ ] Integration tests with Ward Labs sandbox
- [ ] End-to-end testing with real farmer accounts
- [ ] Performance testing for data loading
- [ ] Mobile responsiveness testing

### Step 11: Security Implementation
- [ ] API rate limiting (e.g., 100 requests per hour)
- [ ] Data encryption for sensitive information
- [ ] Input validation and sanitization
- [ ] CORS configuration
- [ ] SQL injection prevention
- [ ] XSS protection

## Phase 6: Deployment & Monitoring (Week 8)

### Step 12: Deployment Setup
- [ ] Set up production environment (AWS/Digital Ocean)
- [ ] Configure environment variables
- [ ] Set up database backups
- [ ] Implement logging and monitoring (Winston/Morgan)
- [ ] Configure SSL certificates
- [ ] Set up CDN for static assets

### Step 13: Go-Live Checklist
- [ ] Deploy backend API to production
- [ ] Update frontend with production URLs
- [ ] Configure Ward Labs webhook endpoints
- [ ] Test with pilot farmers
- [ ] Monitor error rates and performance
- [ ] Create user documentation

## Phase 7: Optimization & Features (Ongoing)

### Step 14: Advanced Features
- [ ] Historical trend charts (Chart.js/D3.js)
- [ ] Soil improvement recommendations engine
- [ ] Email notifications for new test results
- [ ] PDF report generation
- [ ] Mobile app development (React Native/Flutter)
- [ ] Comparison with regional averages

### Step 15: PFAM Integration
- [ ] Create admin endpoints for employee access
- [ ] Build aggregate reporting dashboards
- [ ] Implement farmer management tools
- [ ] Add data export functionality (CSV/Excel)
- [ ] Create analytics and insights dashboard

## Key Implementation Files to Create:

### Backend Files:
```
backend/
├── server.js                 # Main Express server
├── models/
│   ├── Farmer.js            # Farmer database model
│   ├── SoilTest.js          # Soil test data model
│   └── Recommendation.js    # Recommendations model
├── services/
│   ├── WardLabsService.js   # Ward Labs API integration
│   ├── SoilAnalysisService.js # Soil data processing
│   └── NotificationService.js # Email/SMS notifications
├── routes/
│   ├── api.js               # Main API routes
│   ├── auth.js              # Authentication routes
│   └── webhooks.js          # Webhook handlers
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Input validation
│   └── rateLimit.js         # Rate limiting
├── config/
│   ├── database.js          # Database configuration
│   └── environment.js       # Environment variables
└── tests/
    ├── api.test.js          # API endpoint tests
    └── services.test.js     # Service layer tests
```

### Frontend Updates:
```
assets/js/
├── dashboard.js             # Enhanced dashboard functionality
├── auth.js                  # Enhanced authentication
├── soil-data.js             # Real soil data processing
├── charts.js                # Data visualization
└── notifications.js         # User notifications
```

## Estimated Timeline: 8 weeks

### Week-by-Week Breakdown:
- **Week 1**: Research and planning
- **Week 2-3**: Backend infrastructure and database setup
- **Week 4**: Ward Labs API integration
- **Week 5**: Internal API development
- **Week 6**: Frontend updates and integration
- **Week 7**: Testing and security implementation
- **Week 8**: Deployment and go-live

## Estimated Cost Considerations:

### One-time Costs:
- Development time: ~200 hours
- Ward Labs API setup fees: $200-500
- SSL certificates: $50-200/year

### Monthly Costs:
- Ward Labs API usage: $0.10-0.50 per test result
- Backend hosting (Digital Ocean/AWS): $20-100/month
- Database hosting: $15-50/month
- Monitoring tools: $20-50/month
- Email service (SendGrid): $15-50/month

### Revenue Potential:
- Subscription fees: $29-99/month per farmer
- Premium features: Additional $19-49/month
- Enterprise/PFAM licenses: $199-999/month

## Success Metrics:
- [ ] Dashboard load time < 2 seconds
- [ ] API response time < 500ms
- [ ] 99.9% uptime
- [ ] User satisfaction > 4.5/5
- [ ] Data accuracy verified against manual tests

## Risk Mitigation:
- [ ] Backup data sources if Ward Labs API is unavailable
- [ ] Graceful degradation to demo data
- [ ] Regular data backups
- [ ] Error monitoring and alerting
- [ ] User communication plan for outages

## Next Steps:
1. Contact Ward Labs for API access and pricing
2. Set up development environment
3. Create project repository and initial file structure
4. Begin Phase 1 research and planning

---

**Note**: This plan can be adapted based on Ward Labs' specific API capabilities and your business requirements. Regular review and updates are recommended as the project progresses.

**Created**: July 9, 2025  
**Last Updated**: July 9, 2025  
**Status**: Planning Phase
