# Files to Remove for Standalone Authentication Project

## HTML Files to Remove
- `index.html` (main homepage)
- `contact.html` (contact page)
- `farmer-dashboard.html` (dashboard)
- `farmer-profile.html` (profile page)
- `test-auth.html` (test file)
- `test-redirect.html` (test file)

## CSS Files to Remove
- `assets/css/style.css` (main site styling)
- `assets/css/contact.css` (contact page styling)
- `assets/css/dashboard.css` (dashboard styling)
- `assets/css/login-signup.css` (original auth styling - replaced by standalone version)

## JavaScript Files to Remove
- `assets/js/script.js` (main site JavaScript)
- `assets/js/main.js` (main functionality)
- `assets/js/dashboard.js` (dashboard functionality)
- `assets/js/auth.js` (original auth - replaced by standalone version)

## Images to Keep (Essential)
- `assets/images/plenterra-logo.png` (company logo)

## Images That Can Be Removed (Optional)
- All other images in `assets/images/` directory as they are used for:
  - Homepage hero sections
  - Agricultural graphics
  - Contact page images
  - Dashboard icons
  - Service illustrations

## Files to Keep for Standalone Project
- `auth-standalone.html` (main auth page)
- `assets/css/auth-standalone.css` (auth styling)
- `assets/js/auth-standalone.js` (auth functionality)
- `assets/images/plenterra-logo.png` (logo)
- `README-standalone.md` (documentation)

## Additional Cleanup Files
- `test.css` (test file)
- `server.js` (if exists)
- `package.json` (if not needed)
- `WARD_LABS_INTEGRATION_PLAN.md` (project-specific doc)

## Recommended Folder Structure for Standalone
```
plenterra-auth/
├── index.html (renamed from auth-standalone.html)
├── README.md (renamed from README-standalone.md)
├── assets/
│   ├── css/
│   │   └── style.css (renamed from auth-standalone.css)
│   ├── js/
│   │   └── script.js (renamed from auth-standalone.js)
│   └── images/
│       └── plenterra-logo.png
└── server.js (optional - simple server script)
```

## Steps to Create Standalone Project

1. Create new directory: `plenterra-auth`
2. Copy essential files:
   - `auth-standalone.html` → `index.html`
   - `assets/css/auth-standalone.css` → `assets/css/style.css`
   - `assets/js/auth-standalone.js` → `assets/js/script.js`
   - `assets/images/plenterra-logo.png` → `assets/images/plenterra-logo.png`
   - `README-standalone.md` → `README.md`
3. Update file references in HTML to match new names
4. Test the standalone version
5. Remove all other files from original project if desired

This will result in a clean, minimal authentication system (~4 files + logo) that maintains all the beautiful UI and functionality but removes all the agricultural platform features.
