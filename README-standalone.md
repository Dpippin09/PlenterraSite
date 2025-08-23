# Plenterra Authentication Portal - Standalone

A lightweight, standalone authentication system extracted from the full Plenterra agricultural platform.

## Features

- **Modern UI/UX**: Beautiful, responsive design with agricultural theming
- **Animated Backgrounds**: Subtle floating particles and agricultural elements
- **Form Validation**: Client-side validation for all input fields
- **Local Storage**: Simulated user sessions using browser local storage
- **Demo Account**: Built-in demo functionality for testing
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Files Structure

### Core Files
- `auth-standalone.html` - Main authentication page
- `assets/css/auth-standalone.css` - All styling for the auth system
- `assets/js/auth-standalone.js` - Authentication logic and form handling
- `assets/images/plenterra-logo.png` - Company logo

### Features Included
- User registration with validation
- User login with demo accounts
- Password confirmation
- Email validation
- Terms of service agreement
- Responsive mobile design
- Animated UI elements

## Usage

### Running the Application

1. Start a local server (Node.js example provided):
```bash
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let filePath = parsedUrl.pathname;
    
    if (filePath === '/') {
        filePath = '/auth-standalone.html';
    }
    
    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(fullPath);
    const mimeType = mimeTypes[ext] || 'text/plain';
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        res.writeHead(200, {
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(8002, () => {
    console.log('Server running at http://localhost:8002/');
});
"
```

2. Open your browser to `http://localhost:8002/`

### Demo Accounts

**Demo Login:**
- Username: `demo`
- Password: `demo`

**Standard Test:**
- Username: Any username
- Password: `password`

### Form Features

**Registration Form:**
- First Name & Last Name (required)
- Email Address (validated format)
- Username (required)
- Password (minimum 8 characters)
- Password Confirmation (must match)
- Terms Agreement (required checkbox)

**Login Form:**
- Username or Email
- Password
- Demo login button for testing

## Customization

### Styling
The CSS uses CSS custom properties (variables) for easy theming:

```css
:root {
    --plenterra-primary: #1a5f3a;
    --plenterra-secondary: #2d7a4d;
    --plenterra-accent: #4a9b65;
    --plenterra-light: #e8f5e8;
    --plenterra-white: #ffffff;
    --plenterra-text: #2c3e2d;
}
```

### JavaScript Configuration
The authentication logic can be easily modified to integrate with real backend APIs by updating the functions in `auth-standalone.js`:

- `authenticateUser()` - Replace with real API call
- `createUser()` - Replace with real user creation API
- `checkUserExists()` - Replace with real user existence check

## Integration

To integrate with a real backend:

1. Replace the simulated authentication functions with actual API calls
2. Update the redirect logic after successful login/signup
3. Add proper error handling for network requests
4. Implement real password hashing and security measures

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

None - This is a vanilla HTML/CSS/JavaScript application with no external dependencies.
