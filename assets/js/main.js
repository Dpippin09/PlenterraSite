document.addEventListener('DOMContentLoaded', function() {
    // Enhanced scroll animations with agricultural theme
    const sections = document.querySelectorAll('.section, .fade-in');
    const cards = document.querySelectorAll('.impact-item, .service-item');
    
    // Beautiful scroll-triggered animations
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for cards
                if (entry.target.matches('.impact-item, .service-item')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                    entry.target.classList.add('animate-in');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    cards.forEach(card => {
        observer.observe(card);
    });

    // Enhanced header scroll effect
    const header = document.querySelector('.site-header');
    const progressBar = document.querySelector('.progress-bar');
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        const scrolled = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (scrolled / documentHeight) * 100;
        
        // Update progress bar with smooth animation
        if (progressBar) {
            progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
        }
        
        // Add/remove scrolled class with debouncing
        if (scrolled > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        scrollTimeout = setTimeout(() => {
            // Add subtle parallax effect to hero background
            const heroImage = document.querySelector('.hero-bg-image');
            if (heroImage && scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
            }
        }, 10);
    });

    // Agricultural-themed number animation for impact stats
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.impact-number');
        numbers.forEach(number => {
            const target = parseInt(number.textContent);
            const increment = target / 100;
            let current = 0;
            
            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    number.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target;
                }
            };
            
            // Start animation when element is visible
            const numberObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        numberObserver.unobserve(entry.target);
                    }
                });
            });
            
            numberObserver.observe(number);
        });
    };

    // Agricultural cursor effect
    const createCursorEffect = () => {
        document.addEventListener('mousemove', (e) => {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            document.body.appendChild(trail);
            
            setTimeout(() => {
                trail.remove();
            }, 1000);
        });
    };

    // Mobile menu enhancement
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Initialize enhanced features
    animateNumbers();
    createCursorEffect();

    // Add beautiful loading animation
    const addLoadingAnimation = () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.8s ease';
            document.body.style.opacity = '1';
        }, 100);
    };

    addLoadingAnimation();
});