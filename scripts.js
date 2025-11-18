/* ============================================
   HCJK Collection - Main JavaScript
   Core Functionality
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initScrollReveal();
    initLazyLoading();
    initSmoothScroll();
    initBackToTop();
    
    console.log('HCJK Collection website initialized');
});

/* ==================== SCROLL REVEAL ANIMATION ==================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Reveal when element is 80% visible
            if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    
    // Check on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            revealOnScroll();
        });
    });
}

/* ==================== LAZY LOADING IMAGES ==================== */
function initLazyLoading() {
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load the image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Load srcset if available
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    // Remove loading class
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                    
                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.classList.add('lazy-loading');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==================== BACK TO TOP BUTTON ==================== */
function initBackToTop() {
    // Create back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==================== UTILITY FUNCTIONS ==================== */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll position
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// Animate number counting
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number
function isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Local storage helpers
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    }
};

// Export functions for use in other scripts
window.HCJKUtils = {
    debounce,
    throttle,
    isInViewport,
    getScrollPosition,
    animateValue,
    formatDate,
    isValidEmail,
    isValidPhone,
    showNotification,
    storage
};/* ============================================
   HCJK Collection - Navigation JavaScript
   Navigation Menu Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize navigation
    initMobileMenu();
    initScrollNavbar();
    initActiveNavLink();
    
});

/* ==================== MOBILE MENU ==================== */
function initMobileMenu() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-link');
    
    if (!navbarToggle || !navbarMenu) return;
    
    // Toggle menu on button click
    navbarToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navbarMenu.classList.toggle('active');
        
        // Update ARIA attributes
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbarToggle.contains(event.target) || navbarMenu.contains(event.target);
        
        if (!isClickInsideNav && navbarMenu.classList.contains('active')) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navbarMenu.classList.contains('active')) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/* ==================== SCROLL NAVBAR ==================== */
function initScrollNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolled past threshold
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up (optional)
        // Uncomment the following code to enable this feature
        /*
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        */
        
        lastScrollTop = scrollTop;
    });
}

/* ==================== ACTIVE NAV LINK ==================== */
function initActiveNavLink() {
    const navbarLinks = document.querySelectorAll('.navbar-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navbarLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Check if link matches current page
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update active link on scroll for single-page sections
    if (currentPage === 'index.html' || currentPage === '') {
        updateActiveOnScroll();
    }
}

/* ==================== UPDATE ACTIVE LINK ON SCROLL ==================== */
function updateActiveOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navbarLinks = document.querySelectorAll('.navbar-link');
    
    if (sections.length === 0) return;
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navbarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==================== DROPDOWN MENU (Optional) ==================== */
function initDropdownMenu() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            
            if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                dropdown.classList.toggle('show');
                this.setAttribute('aria-expanded', dropdown.classList.contains('show'));
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
                const toggle = menu.previousElementSibling;
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}

/* ==================== MEGA MENU (Optional) ==================== */
function initMegaMenu() {
    const megaMenuToggles = document.querySelectorAll('.mega-menu-toggle');
    
    megaMenuToggles.forEach(toggle => {
        toggle.addEventListener('mouseenter', function() {
            const megaMenu = this.querySelector('.mega-menu');
            if (megaMenu) {
                megaMenu.classList.add('show');
            }
        });
        
        toggle.addEventListener('mouseleave', function() {
            const megaMenu = this.querySelector('.mega-menu');
            if (megaMenu) {
                megaMenu.classList.remove('show');
            }
        });
    });
}

/* ==================== SEARCH FUNCTIONALITY (Optional) ==================== */
function initNavbarSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchClose = document.querySelector('.search-close');
    
    if (!searchToggle || !searchForm) return;
    
    // Open search
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchForm.classList.add('active');
        searchInput.focus();
    });
    
    // Close search
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchForm.classList.remove('active');
        });
    }
    
    // Close search on escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && searchForm.classList.contains('active')) {
            searchForm.classList.remove('active');
        }
    });
}

/* ==================== STICKY HEADER ==================== */
function initStickyHeader() {
    const header = document.querySelector('.navbar');
    if (!header) return;
    
    const headerHeight = header.offsetHeight;
    const placeholder = document.createElement('div');
    placeholder.style.height = `${headerHeight}px`;
    placeholder.style.display = 'none';
    
    header.parentNode.insertBefore(placeholder, header);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > headerHeight) {
            header.classList.add('sticky');
            placeholder.style.display = 'block';
        } else {
            header.classList.remove('sticky');
            placeholder.style.display = 'none';
        }
    });
}

/* ==================== ACCESSIBILITY ENHANCEMENTS ==================== */
function initAccessibility() {
    // Trap focus in mobile menu when open
    const navbarMenu = document.getElementById('navbar-menu');
    const navbarToggle = document.getElementById('navbar-toggle');
    
    if (!navbarMenu || !navbarToggle) return;
    
    const focusableElements = navbarMenu.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    navbarMenu.addEventListener('keydown', function(e) {
        if (!navbarMenu.classList.contains('active')) return;
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);/* ============================================
   HCJK Photography - Enhanced Features
   Additional functionality for improved UX
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // FORM VALIDATION & LOADING STATES
    // ============================================
    const enhanceForms = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add loading state on submit
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');
                    const originalText = submitBtn.textContent;
                    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
                    
                    // Reset after 10 seconds if no response
                    setTimeout(() => {
                        if (submitBtn.disabled) {
                            submitBtn.disabled = false;
                            submitBtn.classList.remove('loading');
                            submitBtn.textContent = originalText;
                        }
                    }, 10000);
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });

                input.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        validateField(this);
                    }
                });
            });
        });
    };

    const validateField = (field) => {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Update field state
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            removeErrorMessage(field);
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            showErrorMessage(field, errorMessage);
        }

        return isValid;
    };

    const showErrorMessage = (field, message) => {
        removeErrorMessage(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
        field.parentNode.appendChild(errorDiv);
    };

    const removeErrorMessage = (field) => {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    };

    // ============================================
    // SKIP NAVIGATION LINK
    // ============================================
    const addSkipLink = () => {
        const main = document.querySelector('main');
        if (!main) return;

        if (!main.id) {
            main.id = 'main-content';
        }

        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('tabindex', '0');
        document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // ============================================
    // KEYBOARD NAVIGATION ENHANCEMENT
    // ============================================
    const enhanceKeyboardNav = () => {
        // Make all interactive elements keyboard accessible
        document.querySelectorAll('[onclick]').forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Visible focus indicators for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    };

    // ============================================
    // PORTFOLIO FILTERING
    // ============================================
    const initPortfolioFilter = () => {
        const filterButtons = document.querySelectorAll('[data-filter]');
        const portfolioItems = document.querySelectorAll('[data-category]');

        if (filterButtons.length === 0 || portfolioItems.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter items with animation
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = '';
                        setTimeout(() => item.classList.add('fade-in'), 10);
                    } else {
                        item.classList.remove('fade-in');
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });

                // Announce to screen readers
                const visibleCount = Array.from(portfolioItems).filter(
                    item => item.style.display !== 'none'
                ).length;
                announceToScreenReader(
                    `Showing ${visibleCount} ${filter === 'all' ? '' : filter} images`
                );
            });
        });
    };

    // ============================================
    // TESTIMONIAL CAROUSEL
    // ============================================
    const initTestimonialCarousel = () => {
        const testimonials = document.querySelectorAll('.testimonial-item');
        if (testimonials.length <= 1) return;

        let currentIndex = 0;
        const totalTestimonials = testimonials.length;

        // Create navigation dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'testimonial-dots';
        
        for (let i = 0; i < totalTestimonials; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `View testimonial ${i + 1}`);
            dot.addEventListener('click', () => showTestimonial(i));
            dotsContainer.appendChild(dot);
        }

        const testimonialsContainer = testimonials[0].parentElement;
        testimonialsContainer.appendChild(dotsContainer);

        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
            
            const dots = dotsContainer.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        };

        const nextTestimonial = () => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            showTestimonial(currentIndex);
        };

        // Auto-rotate every 6 seconds
        setInterval(nextTestimonial, 6000);

        // Initialize
        showTestimonial(0);
    };

    // ============================================
    // SCREEN READER ANNOUNCEMENTS
    // ============================================
    const announceToScreenReader = (message) => {
        let announcer = document.getElementById('sr-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }
        announcer.textContent = message;
    };

    // ============================================
    // SCROLL DEPTH TRACKING
    // ============================================
    const trackScrollDepth = () => {
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();

        const checkScrollDepth = () => {
            const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
            
            milestones.forEach(milestone => {
                if (scrollPercentage >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    
                    // Send to GTM
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            'event': 'scroll_depth',
                            'scroll_percentage': milestone
                        });
                    }
                }
            });
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    checkScrollDepth();
                    ticking = false;
                });
                ticking = true;
            }
        });
    };

    // ============================================
    // FORM ABANDONMENT TRACKING
    // ============================================
    const trackFormAbandonment = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            let formStarted = false;
            let formSubmitted = false;

            form.addEventListener('input', () => {
                if (!formStarted) {
                    formStarted = true;
                    
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            'event': 'form_start',
                            'form_id': form.id || 'unknown'
                        });
                    }
                }
            });

            form.addEventListener('submit', () => {
                formSubmitted = true;
            });

            // Track abandonment on page unload
            window.addEventListener('beforeunload', () => {
                if (formStarted && !formSubmitted) {
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            'event': 'form_abandonment',
                            'form_id': form.id || 'unknown'
                        });
                    }
                }
            });
        });
    };

    // ============================================
    // PERFORMANCE MONITORING
    // ============================================
    const monitorPerformance = () => {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            'event': 'performance_metric',
                            'metric_name': 'LCP',
                            'metric_value': Math.round(lastEntry.renderTime || lastEntry.loadTime)
                        });
                    }
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP monitoring not supported');
            }

            // Monitor First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (window.dataLayer) {
                            window.dataLayer.push({
                                'event': 'performance_metric',
                                'metric_name': 'FID',
                                'metric_value': Math.round(entry.processingStart - entry.startTime)
                            });
                        }
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID monitoring not supported');
            }
        }

        // Track page load time
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                if (window.dataLayer) {
                    window.dataLayer.push({
                        'event': 'performance_metric',
                        'metric_name': 'page_load_time',
                        'metric_value': pageLoadTime
                    });
                }
            }, 0);
        });
    };

    // ============================================
    // MOBILE MENU ENHANCEMENT
    // ============================================
    const enhanceMobileMenu = () => {
        const nav = document.querySelector('nav');
        const menuToggle = document.querySelector('.mobile-menu-toggle, .menu-toggle');
        
        if (!nav || !menuToggle) return;

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                menuToggle.click();
                menuToggle.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.click();
            }
        });

        // Close menu when navigating to anchor
        const navLinks = nav.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    setTimeout(() => menuToggle.click(), 100);
                }
            });
        });
    };

    // ============================================
    // TOUCH TARGET OPTIMIZATION
    // ============================================
    const optimizeTouchTargets = () => {
        // Ensure all interactive elements have minimum 44x44px touch target
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                element.style.minWidth = '44px';
                element.style.minHeight = '44px';
            }
        });
    };

    // ============================================
    // EVENT TRACKING
    // ============================================
    const setupEventTracking = () => {
        // Track button clicks
        document.querySelectorAll('button, .btn, .cta-button').forEach(button => {
            button.addEventListener('click', function() {
                if (window.dataLayer) {
                    window.dataLayer.push({
                        'event': 'button_click',
                        'button_text': this.textContent.trim(),
                        'button_location': window.location.pathname
                    });
                }
            });
        });

        // Track external links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.addEventListener('click', function() {
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            'event': 'external_link_click',
                            'link_url': this.href,
                            'link_text': this.textContent.trim()
                        });
                    }
                });
            }
        });

        // Track email and phone clicks
        document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function() {
                const type = this.href.startsWith('mailto:') ? 'email' : 'phone';
                if (window.dataLayer) {
                    window.dataLayer.push({
                        'event': 'contact_click',
                        'contact_type': type,
                        'contact_value': this.href.replace(/^(mailto:|tel:)/, '')
                    });
                }
            });
        });
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    const init = () => {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all enhancements
        addSkipLink();
        enhanceForms();
        enhanceKeyboardNav();
        initPortfolioFilter();
        initTestimonialCarousel();
        trackScrollDepth();
        trackFormAbandonment();
        monitorPerformance();
        enhanceMobileMenu();
        optimizeTouchTargets();
        setupEventTracking();

        console.log('HCJK Photography enhancements loaded');
    };

    // Start initialization
    init();

})();/* ============================================
   HCJK Collection - Gallery JavaScript
   Portfolio Filtering and Gallery Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize gallery filtering
    initPortfolioFilter();
    initLoadMore();
    
});

/* ==================== PORTFOLIO FILTERING ==================== */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter, galleryItems);
        });
    });
    
    // Check for hash in URL (e.g., #weddings)
    const hash = window.location.hash.substring(1);
    if (hash) {
        const filterButton = document.querySelector(`[data-filter="${hash}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
}

function filterGalleryItems(filter, items) {
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            // Show item with animation
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            // Hide item with animation
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

/* ==================== LOAD MORE FUNCTIONALITY ==================== */
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!loadMoreBtn) return;
    
    let itemsToShow = 18; // Initial number of items to show
    const itemsPerLoad = 6; // Number of items to load each time
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Initially hide items beyond the first set
    hideExtraItems(galleryItems, itemsToShow);
    
    // Check if load more button should be shown
    if (galleryItems.length <= itemsToShow) {
        loadMoreBtn.style.display = 'none';
    }
    
    loadMoreBtn.addEventListener('click', function() {
        itemsToShow += itemsPerLoad;
        
        // Show more items
        showMoreItems(galleryItems, itemsToShow);
        
        // Hide button if all items are shown
        if (itemsToShow >= galleryItems.length) {
            loadMoreBtn.style.display = 'none';
        }
        
        // Smooth scroll to first new item
        const firstNewItem = galleryItems[itemsToShow - itemsPerLoad];
        if (firstNewItem) {
            setTimeout(() => {
                firstNewItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

function hideExtraItems(items, showCount) {
    items.forEach((item, index) => {
        if (index >= showCount) {
            item.style.display = 'none';
        }
    });
}

function showMoreItems(items, showCount) {
    items.forEach((item, index) => {
        if (index < showCount) {
            const category = item.getAttribute('data-category');
            const activeFilter = document.querySelector('.filter-btn.active');
            const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            
            // Only show if it matches the current filter
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            }
        }
    });
}

/* ==================== MASONRY LAYOUT ==================== */
function initMasonryLayout() {
    // This is a simple implementation
    // For production, consider using a library like Masonry.js or Isotope
    
    const gallery = document.querySelector('.gallery-masonry');
    if (!gallery) return;
    
    // Adjust column count based on screen size
    function adjustColumns() {
        const width = window.innerWidth;
        let columns = 3;
        
        if (width < 768) {
            columns = 1;
        } else if (width < 1024) {
            columns = 2;
        }
        
        gallery.style.columnCount = columns;
    }
    
    adjustColumns();
    window.addEventListener('resize', adjustColumns);
}

/* ==================== GALLERY HOVER EFFECTS ==================== */
function initGalleryHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.gallery-item-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.gallery-item-overlay').style.opacity = '0';
        });
    });
}

/* ==================== GALLERY SEARCH ==================== */
function initGallerySearch() {
    const searchInput = document.getElementById('gallery-search');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('.gallery-item-title')?.textContent.toLowerCase() || '';
            const category = item.querySelector('.gallery-item-category')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || category.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

/* ==================== EXPORT FUNCTIONS ==================== */
window.GalleryUtils = {
    filterGalleryItems,
    initMasonryLayout,
    initGalleryHoverEffects,
    initGallerySearch
};/* ============================================
   HCJK Collection - Lightbox JavaScript
   Image Lightbox/Modal Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize lightbox
    initLightbox();
    
});

/* ==================== LIGHTBOX FUNCTIONALITY ==================== */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const modal = document.getElementById('lightbox-modal');
    const modalImage = document.getElementById('lightbox-image');
    const closeBtn = document.getElementById('modal-close');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    
    if (!modal || !modalImage) return;
    
    let currentIndex = 0;
    let visibleImages = [];
    
    // Update visible images based on current filter
    function updateVisibleImages() {
        visibleImages = Array.from(galleryItems).filter(img => {
            const item = img.closest('.gallery-item');
            return item && window.getComputedStyle(item).display !== 'none';
        });
    }
    
    // Open lightbox
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            updateVisibleImages();
            currentIndex = visibleImages.indexOf(this);
            openLightbox(this);
        });
    });
    
    // Close lightbox
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLightbox();
        }
    });
    
    // Previous image
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPreviousImage();
        });
    }
    
    // Next image
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextImage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
    
    // Open lightbox function
    function openLightbox(img) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add fade-in animation
        modalImage.style.opacity = '0';
        setTimeout(() => {
            modalImage.style.opacity = '1';
        }, 10);
    }
    
    // Close lightbox function
    function closeLightbox() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Show previous image
    function showPreviousImage() {
        if (visibleImages.length === 0) return;
        
        currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
        updateLightboxImage();
    }
    
    // Show next image
    function showNextImage() {
        if (visibleImages.length === 0) return;
        
        currentIndex = (currentIndex + 1) % visibleImages.length;
        updateLightboxImage();
    }
    
    // Update lightbox image
    function updateLightboxImage() {
        const img = visibleImages[currentIndex];
        if (!img) return;
        
        // Fade out
        modalImage.style.opacity = '0';
        
        // Change image after fade
        setTimeout(() => {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            
            // Fade in
            setTimeout(() => {
                modalImage.style.opacity = '1';
            }, 10);
        }, 200);
    }
    
    // Touch/swipe support for mobile
    initTouchSupport(modal);
}

/* ==================== TOUCH/SWIPE SUPPORT ==================== */
function initTouchSupport(modal) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    modal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                const nextBtn = document.getElementById('modal-next');
                if (nextBtn) nextBtn.click();
            } else {
                // Swipe right - previous image
                const prevBtn = document.getElementById('modal-prev');
                if (prevBtn) prevBtn.click();
            }
        }
    }
}

/* ==================== ZOOM FUNCTIONALITY ==================== */
function initImageZoom() {
    const modalImage = document.getElementById('lightbox-image');
    if (!modalImage) return;
    
    let scale = 1;
    const maxScale = 3;
    const minScale = 1;
    
    modalImage.addEventListener('dblclick', function() {
        if (scale === 1) {
            scale = 2;
        } else {
            scale = 1;
        }
        
        this.style.transform = `scale(${scale})`;
        this.style.cursor = scale > 1 ? 'zoom-out' : 'zoom-in';
    });
    
    // Mouse wheel zoom
    modalImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
            // Zoom in
            scale = Math.min(scale + 0.1, maxScale);
        } else {
            // Zoom out
            scale = Math.max(scale - 0.1, minScale);
        }
        
        this.style.transform = `scale(${scale})`;
        this.style.cursor = scale > 1 ? 'zoom-out' : 'zoom-in';
    });
}

/* ==================== IMAGE PRELOADING ==================== */
function preloadAdjacentImages(currentIndex, images) {
    const preloadCount = 2; // Number of images to preload on each side
    
    for (let i = 1; i <= preloadCount; i++) {
        // Preload next images
        const nextIndex = (currentIndex + i) % images.length;
        if (images[nextIndex]) {
            const img = new Image();
            img.src = images[nextIndex].src;
        }
        
        // Preload previous images
        const prevIndex = (currentIndex - i + images.length) % images.length;
        if (images[prevIndex]) {
            const img = new Image();
            img.src = images[prevIndex].src;
        }
    }
}

/* ==================== LIGHTBOX WITH CAPTIONS ==================== */
function initLightboxCaptions() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;
    
    // Create caption element if it doesn't exist
    let caption = modal.querySelector('.lightbox-caption');
    if (!caption) {
        caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        modal.querySelector('.modal-content').appendChild(caption);
    }
    
    // Update caption when image changes
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title')?.textContent;
        const category = item.querySelector('.gallery-item-category')?.textContent;
        
        if (img) {
            img.addEventListener('click', function() {
                if (title || category) {
                    caption.innerHTML = `
                        ${title ? `<h3>${title}</h3>` : ''}
                        ${category ? `<p>${category}</p>` : ''}
                    `;
                    caption.style.display = 'block';
                } else {
                    caption.style.display = 'none';
                }
            });
        }
    });
}

/* ==================== EXPORT FUNCTIONS ==================== */
window.LightboxUtils = {
    initImageZoom,
    preloadAdjacentImages,
    initLightboxCaptions
};/* ============================================
   HCJK Collection - Loading Screen JavaScript
   Handle loading screen display and hide
   ============================================ */

(function() {
    'use strict';
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Hide loading screen when page is fully loaded
    window.addEventListener('load', function() {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loadingScreen) {
            // Small delay to ensure smooth transition
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                document.body.classList.remove('loading');
                
                // Remove loading screen from DOM after transition
                setTimeout(function() {
                    loadingScreen.remove();
                }, 500);
            }, 300);
        }
    });
    
    // Fallback: Hide loading screen after 5 seconds if load event doesn't fire
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }, 5000);
})();/* ============================================
   HCJK Collection - Analytics JavaScript
   Google Analytics Event Tracking
   ============================================ */

// Wait for Google Analytics to load
window.addEventListener('load', function() {
    
    // Initialize analytics tracking
    initAnalyticsTracking();
    
});

/* ==================== ANALYTICS TRACKING ==================== */
function initAnalyticsTracking() {
    // Check if gtag is available
    if (typeof gtag === 'undefined') {
        console.log('Google Analytics not loaded');
        return;
    }
    
    // Track outbound links
    trackOutboundLinks();
    
    // Track downloads
    trackDownloads();
    
    // Track social media clicks
    trackSocialClicks();
    
    // Track form submissions
    trackFormSubmissions();
    
    // Track button clicks
    trackButtonClicks();
    
    // Track scroll depth
    trackScrollDepth();
}

/* ==================== OUTBOUND LINK TRACKING ==================== */
function trackOutboundLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // Skip links to own domain
        if (link.hostname === window.location.hostname) return;
        
        link.addEventListener('click', function(e) {
            const url = this.href;
            
            gtag('event', 'click', {
                'event_category': 'Outbound Link',
                'event_label': url,
                'transport_type': 'beacon'
            });
        });
    });
}

/* ==================== DOWNLOAD TRACKING ==================== */
function trackDownloads() {
    const downloadExtensions = ['.pdf', '.zip', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const isDownload = downloadExtensions.some(ext => href.toLowerCase().endsWith(ext));
        
        if (isDownload) {
            link.addEventListener('click', function(e) {
                gtag('event', 'download', {
                    'event_category': 'File Download',
                    'event_label': href,
                    'transport_type': 'beacon'
                });
            });
        }
    });
}

/* ==================== SOCIAL MEDIA TRACKING ==================== */
function trackSocialClicks() {
    const socialPlatforms = {
        'instagram.com': 'Instagram',
        'facebook.com': 'Facebook',
        'twitter.com': 'Twitter',
        'pinterest.com': 'Pinterest',
        'linkedin.com': 'LinkedIn',
        'youtube.com': 'YouTube'
    };
    
    document.querySelectorAll('a[href*="instagram.com"], a[href*="facebook.com"], a[href*="twitter.com"], a[href*="pinterest.com"], a[href*="linkedin.com"], a[href*="youtube.com"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.href;
            let platform = 'Unknown';
            
            for (const [domain, name] of Object.entries(socialPlatforms)) {
                if (url.includes(domain)) {
                    platform = name;
                    break;
                }
            }
            
            gtag('event', 'social_click', {
                'event_category': 'Social Media',
                'event_label': platform,
                'transport_type': 'beacon'
            });
        });
    });
}

/* ==================== FORM SUBMISSION TRACKING ==================== */
function trackFormSubmissions() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const formName = this.getAttribute('name') || this.getAttribute('id') || 'Unknown Form';
            
            gtag('event', 'form_submission', {
                'event_category': 'Form',
                'event_label': formName
            });
        });
    });
}

/* ==================== BUTTON CLICK TRACKING ==================== */
function trackButtonClicks() {
    // Track CTA buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const buttonClass = this.className;
            
            gtag('event', 'button_click', {
                'event_category': 'CTA Button',
                'event_label': buttonText,
                'button_class': buttonClass
            });
        });
    });
    
    // Track booking buttons specifically
    document.querySelectorAll('a[href*="booking"], button[href*="booking"]').forEach(button => {
        button.addEventListener('click', function(e) {
            gtag('event', 'booking_intent', {
                'event_category': 'Conversion',
                'event_label': 'Booking Button Click'
            });
        });
    });
    
    // Track contact buttons specifically
    document.querySelectorAll('a[href*="contact"], button[href*="contact"]').forEach(button => {
        button.addEventListener('click', function(e) {
            gtag('event', 'contact_intent', {
                'event_category': 'Conversion',
                'event_label': 'Contact Button Click'
            });
        });
    });
}

/* ==================== SCROLL DEPTH TRACKING ==================== */
function trackScrollDepth() {
    const scrollDepths = [25, 50, 75, 100];
    const trackedDepths = new Set();
    
    window.addEventListener('scroll', throttle(function() {
        const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
        
        scrollDepths.forEach(depth => {
            if (scrollPercentage >= depth && !trackedDepths.has(depth)) {
                trackedDepths.add(depth);
                
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': `${depth}%`,
                    'value': depth
                });
            }
        });
    }, 500));
}

/* ==================== PAGE TIMING TRACKING ==================== */
function trackPageTiming() {
    window.addEventListener('load', function() {
        // Get page load time
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        gtag('event', 'timing_complete', {
            'name': 'page_load',
            'value': pageLoadTime,
            'event_category': 'Performance'
        });
    });
}

/* ==================== VIDEO TRACKING (Optional) ==================== */
function trackVideoPlays() {
    document.querySelectorAll('video').forEach(video => {
        let tracked25 = false;
        let tracked50 = false;
        let tracked75 = false;
        let tracked100 = false;
        
        video.addEventListener('play', function() {
            gtag('event', 'video_play', {
                'event_category': 'Video',
                'event_label': this.src || 'Unknown Video'
            });
        });
        
        video.addEventListener('timeupdate', function() {
            const percentage = (this.currentTime / this.duration) * 100;
            
            if (percentage >= 25 && !tracked25) {
                tracked25 = true;
                gtag('event', 'video_progress', {
                    'event_category': 'Video',
                    'event_label': '25%',
                    'value': 25
                });
            }
            
            if (percentage >= 50 && !tracked50) {
                tracked50 = true;
                gtag('event', 'video_progress', {
                    'event_category': 'Video',
                    'event_label': '50%',
                    'value': 50
                });
            }
            
            if (percentage >= 75 && !tracked75) {
                tracked75 = true;
                gtag('event', 'video_progress', {
                    'event_category': 'Video',
                    'event_label': '75%',
                    'value': 75
                });
            }
        });
        
        video.addEventListener('ended', function() {
            if (!tracked100) {
                tracked100 = true;
                gtag('event', 'video_complete', {
                    'event_category': 'Video',
                    'event_label': this.src || 'Unknown Video'
                });
            }
        });
    });
}

/* ==================== UTILITY FUNCTIONS ==================== */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ==================== CUSTOM EVENT TRACKING ==================== */
// Function to track custom events from anywhere in the site
window.trackEvent = function(category, action, label, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
};

// Function to track page views (for single-page apps)
window.trackPageView = function(path, title) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-XXXXXXXXXX', {
            'page_path': path,
            'page_title': title
        });
    }
};

/* ==================== EXPORT FUNCTIONS ==================== */
window.AnalyticsUtils = {
    trackEvent: window.trackEvent,
    trackPageView: window.trackPageView,
    trackVideoPlays,
    trackPageTiming
};

// Initialize page timing tracking
trackPageTiming();/* ============================================
   Service Worker Registration
   ============================================ */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registered successfully:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Service Worker update found');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available
                            console.log('✨ New content available, please refresh');
                            
                            // Show update notification
                            showUpdateNotification();
                        }
                    });
                });

                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 3600000);
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed');
            window.location.reload();
        });
    });
}

// Show update notification
function showUpdateNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #722F37;
            color: #F5F5DC;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 350px;
            animation: slideIn 0.3s ease;
        ">
            <p style="margin: 0 0 15px 0; font-weight: 600;">
                🎉 New content available!
            </p>
            <p style="margin: 0 0 15px 0; font-size: 14px;">
                A new version of the site is available. Refresh to get the latest updates.
            </p>
            <button onclick="window.location.reload()" style="
                background: #F5F5DC;
                color: #722F37;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                margin-right: 10px;
            ">
                Refresh Now
            </button>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: transparent;
                color: #F5F5DC;
                border: 1px solid #F5F5DC;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
            ">
                Later
            </button>
        </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
}

// Online/Offline status monitoring
window.addEventListener('online', () => {
    console.log('🌐 Back online');
    
    // Show notification
    if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'connection_status',
            'status': 'online'
        });
    }
});

window.addEventListener('offline', () => {
    console.log('📡 Connection lost');
    
    // Show notification
    if (window.dataLayer) {
        window.dataLayer.push({
            'event': 'connection_status',
            'status': 'offline'
        });
    }
    
    // Show offline notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff9800;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
        ">
            📡 You're offline. Some features may be limited.
        </div>
    `;
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
});