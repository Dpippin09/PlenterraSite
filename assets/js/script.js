document.addEventListener('DOMContentLoaded', function() {
    // Clean Hamburger Menu
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        mobileNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    } else {
        console.error('Mobile menu elements not found!', {
            mobileMenuToggle,
            navLinks
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    for (const link of links) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate form submission
                const button = this.querySelector('button');
                const originalText = button.textContent;
                
                button.textContent = 'Sending...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = 'Sent!';
                    this.querySelector('input[type="email"]').value = '';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 2000);
                }, 1000);
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.textContent = 'Thank you for subscribing!';
                successMsg.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--plenterra-success);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 10000;
                    font-weight: 600;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                `;
                
                document.body.appendChild(successMsg);
                
                setTimeout(() => {
                    successMsg.style.opacity = '1';
                    successMsg.style.transform = 'translateX(0)';
                }, 100);
                
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    successMsg.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        document.body.removeChild(successMsg);
                    }, 300);
                }, 3000);
            }
        });
    });
    
    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animations for impact numbers
                if (entry.target.classList.contains('impact-number')) {
                    animateCounter(entry.target);
                }
                
                // Staggered animation for cards
                if (entry.target.classList.contains('stagger-container')) {
                    animateStaggered(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.fade-in, .service-item, .goals-section, .impact-number, .card, .stagger-container'
    );
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation function
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            // Update the element text while preserving any suffix
            const originalText = element.textContent;
            const suffix = originalText.replace(/[\d,]/g, '');
            element.textContent = current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Staggered animation function
    function animateStaggered(container) {
        const items = container.querySelectorAll('.card, .service-item, .goal-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 150);
        });
    }
    
    // Parallax scroll effect
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Progress indicator
    function updateProgressIndicator() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }
    
    // Scroll event handler
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                updateProgressIndicator();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // Prevent body scroll when mobile menu is open
    const style = document.createElement('style');
    style.textContent = `
        .menu-open {
            overflow: hidden;
        }
        
        .menu-open .nav-links {
            overflow-y: auto;
        }
    `;
    document.head.appendChild(style);
    
    // Advanced micro-interactions
    
    // Button ripple effect
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .cta-button, .auth-btn, button[type="submit"]');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Smooth reveal for cards on hover
    const cards = document.querySelectorAll('.card, .service-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Dynamic loading states
    function showLoadingState(element, text = 'Loading...') {
        element.style.position = 'relative';
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.7';
        
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="spinner"></div>
            <span>${text}</span>
        `;
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.9);
            z-index: 10;
            border-radius: inherit;
        `;
        
        element.appendChild(loader);
    }
    
    function hideLoadingState(element) {
        const loader = element.querySelector('.loading-overlay');
        if (loader) {
            loader.remove();
        }
        element.style.pointerEvents = '';
        element.style.opacity = '';
    }
    
    // Image lazy loading with fade-in effect
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Scroll-to-top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: var(--plenterra-primary);
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll-to-top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(100px)';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Enhanced form interactions
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Floating label effect
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Toast notification system
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--plenterra-success)' : 
                        type === 'error' ? 'var(--plenterra-error)' : 
                        'var(--plenterra-primary)'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentElement) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key handling
        if (e.key === 'Escape') {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        }
        
        // Ctrl/Cmd + K for search (if you add search later)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Future: Open search modal
        }
    });
    
    // Enhanced Mobile Experience
    
    // Touch gesture support for mobile
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaY = touchStartY - touchEndY;
        const deltaX = touchStartX - touchEndX;
        
        // Swipe detection (minimum 50px swipe)
        if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
            if (deltaX > 0) {
                // Swipe left - close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            }
        }
    }, { passive: true });
    
    // Enhanced mobile menu with better animation
    function toggleMobileMenu() {
        const isActive = mobileMenuToggle.classList.contains('active');
        
        if (!isActive) {
            // Opening menu
            mobileMenuToggle.classList.add('active');
            navLinks.classList.add('active');
            body.classList.add('menu-open');
            
            // Animate menu items in sequence
            const menuItems = navLinks.querySelectorAll('a');
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100 + 200);
            });
        } else {
            // Closing menu
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        }
    }
    
    // Replace original mobile menu toggle with enhanced version
    if (mobileMenuToggle) {
        mobileMenuToggle.removeEventListener('click', mobileMenuToggle.onclick);
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Improved accessibility features
    
    // Focus trap for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Apply focus trap to mobile menu when active
    const menuObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (navLinks.classList.contains('active')) {
                    trapFocus(navLinks);
                    // Focus first menu item
                    const firstMenuItem = navLinks.querySelector('a');
                    if (firstMenuItem) {
                        setTimeout(() => firstMenuItem.focus(), 300);
                    }
                }
            }
        });
    });
    
    if (navLinks) {
        menuObserver.observe(navLinks, { attributes: true });
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key handling
        if (e.key === 'Escape') {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Return focus to menu toggle
            if (document.activeElement !== mobileMenuToggle) {
                mobileMenuToggle.focus();
            }
        }
        
        // Arrow key navigation in menu
        if (navLinks.classList.contains('active')) {
            const menuItems = Array.from(navLinks.querySelectorAll('a'));
            const currentIndex = menuItems.indexOf(document.activeElement);
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
                menuItems[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
                menuItems[prevIndex].focus();
            }
        }
    });
    
    // ARIA attributes and labels
    function enhanceAccessibility() {
        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-controls', 'nav-links');
            mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        }
        
        // Navigation menu
        if (navLinks) {
            navLinks.setAttribute('role', 'navigation');
            navLinks.setAttribute('aria-labelledby', 'nav-toggle');
            navLinks.id = 'nav-links';
        }
        
        // Progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.setAttribute('role', 'progressbar');
            progressBar.setAttribute('aria-label', 'Page scroll progress');
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', '100');
        }
        
        // Scroll-to-top button
        if (scrollToTopBtn) {
            scrollToTopBtn.setAttribute('aria-label', 'Scroll to top of page');
            scrollToTopBtn.setAttribute('title', 'Scroll to top');
        }
        
        // Impact numbers for screen readers
        const impactNumbers = document.querySelectorAll('.impact-number');
        impactNumbers.forEach(number => {
            const text = number.textContent;
            number.setAttribute('aria-label', `${text} - ${number.nextElementSibling?.textContent || ''}`);
        });
    }
    
    // High contrast mode detection
    function detectHighContrast() {
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            border: 1px solid;
            border-color: buttontext;
            position: absolute;
            height: 5px;
            top: -999px;
        `;
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const isHighContrast = computedStyle.borderTopColor === computedStyle.borderRightColor;
        
        document.body.removeChild(testElement);
        
        if (isHighContrast) {
            document.body.classList.add('high-contrast');
        }
    }
    
    // Reduced motion preferences
    function handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            
            // Disable auto-playing animations
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize accessibility enhancements
    enhanceAccessibility();
    detectHighContrast();
    handleReducedMotion();
    
    // Update mobile menu ARIA on toggle
    const originalToggle = toggleMobileMenu;
    toggleMobileMenu = function() {
        originalToggle();
        const isExpanded = mobileMenuToggle.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
    };
});