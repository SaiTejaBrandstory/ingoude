// JavaScript for Ingoude Technologies Website

// Global variables
let currentSlide = 0;
let imagesLoaded = false;
let isMobileMenuOpen = false;

// Touch/swipe variables
let touchStart = null;
let touchEnd = null;
const minSwipeDistance = 50;

// Products data
const slides = [
    {
        id: 1,
        title: "CRM & Sales Performance Dashboard",
        features: [
            "Manage leads and customer interactions in one place.",
            "Monitor sales, renewals, and revenue in real time.",
            "Visualize data with intuitive charts and reports."
        ],
        image: "public/products-1.webp"
    },
    {
        id: 2,
        title: "Insurance Product Management",
        features: [
            "Access 12+ API-ready insurance products instantly.",
            "Auto, health, property, and life coverage options.",
            "Seamless integration with top UAE insurers."
        ],
        image: "public/products-2.webp"
    },
    {
        id: 3,
        title: "Client Portal & Communication",
        features: [
            "Secure client access to policies and documents.",
            "Real-time notifications and updates.",
            "Integrated messaging and support system."
        ],
        image: "public/products-3.webp"
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    // Also set up contact form handler directly (in case it's not in modal)
    setupContactFormHandler();
});

// Setup contact form handler (for contact-us.html page)
function setupContactFormHandler() {
    // Wait a bit to ensure DOM is fully ready
    setTimeout(function() {
        const mainContactForm = document.getElementById('contactForm');
        if (mainContactForm) {
            // Remove any existing onsubmit handlers
            mainContactForm.onsubmit = null;
            
            // Add event listener to the form
            mainContactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('Form submit event triggered'); // Debug log
                handleContactFormSubmission(mainContactForm);
                return false;
            }, true); // Use capture phase
            
            // Also add click handler to submit button as backup
            const submitBtn = mainContactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Submit button clicked'); // Debug log
                    mainContactForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: false }));
                    return false;
                }, true);
            }
            
            console.log('Contact form handler attached'); // Debug log
        } else {
            console.log('Contact form not found on this page'); // Debug log
        }
    }, 100);
}

// Initialize all website functionality
function initializeWebsite() {
    initializeMobileMenu();
    initializeProductsCarousel();
    preloadImages();
    setupEventListeners();
    initializeContactModal();
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu only when clicking actual navigation links (not summaries/carets)
        const mobileNavLinks = document.querySelectorAll('.mobile-submenu-link, .mobile-login-btn, .mobile-demo-btn, a.mobile-services-link[href]');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMobileMenuOpen && !mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    updateMobileMenuState();
}

function closeMobileMenu() {
    isMobileMenuOpen = false;
    updateMobileMenuState();
}

function updateMobileMenuState() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        if (isMobileMenuOpen) {
            mobileMenuBtn.classList.add('open');
            mobileNav.classList.add('open');
        } else {
            mobileMenuBtn.classList.remove('open');
            mobileNav.classList.remove('open');
        }
    }
}

// Products Carousel Functionality
function initializeProductsCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const productsSlider = document.getElementById('productsSlider');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (carouselDots.length > 0) {
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
    }
    
    if (productsSlider) {
        // Touch/swipe events for mobile
        productsSlider.addEventListener('touchstart', onTouchStart, { passive: true });
        productsSlider.addEventListener('touchmove', onTouchMove, { passive: true });
        productsSlider.addEventListener('touchend', onTouchEnd, { passive: true });
    }
    
    // Initialize the first slide
    updateProductDisplay();
    updateCarouselButtons();
    updateCarouselDots();
}

function preloadImages() {
    let loadedCount = 0;
    const totalImages = slides.length;

    slides.forEach(slide => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                imagesLoaded = true;
                updateCarouselButtons();
                updateCarouselDots();
            }
        };
        img.onerror = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                imagesLoaded = true;
                updateCarouselButtons();
                updateCarouselDots();
            }
        };
        img.src = slide.image;
    });
}

function nextSlide() {
    if (currentSlide === slides.length - 1 || !imagesLoaded) return;
    currentSlide++;
    updateProductDisplay();
    updateCarouselButtons();
    updateCarouselDots();
}

function prevSlide() {
    if (currentSlide === 0 || !imagesLoaded) return;
    currentSlide--;
    updateProductDisplay();
    updateCarouselButtons();
    updateCarouselDots();
}

function goToSlide(index) {
    if (index === currentSlide || !imagesLoaded) return;
    currentSlide = index;
    updateProductDisplay();
    updateCarouselButtons();
    updateCarouselDots();
}

function updateProductDisplay() {
    const currentSlideData = slides[currentSlide];
    
    // Update title
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = currentSlideData.title;
    }
    
    // Update features
    const productFeatures = document.getElementById('productFeatures');
    if (productFeatures) {
        productFeatures.innerHTML = '';
        currentSlideData.features.forEach(feature => {
            const li = document.createElement('li');
            li.className = 'product-feature';
            li.innerHTML = `
                <div class="feature-bullet"></div>
                <span class="feature-text">${feature}</span>
            `;
            productFeatures.appendChild(li);
        });
    }
    
    // Update image
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.src = currentSlideData.image;
        productImage.alt = currentSlideData.title;
    }
}

function updateCarouselButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        const isDisabled = currentSlide === 0 || !imagesLoaded;
        prevBtn.disabled = isDisabled;
        prevBtn.style.backgroundColor = isDisabled ? 'rgba(203, 203, 203, 1)' : 'rgba(3, 105, 161, 1)';
        prevBtn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
        prevBtn.style.opacity = isDisabled ? '0.6' : '1';
    }
    
    if (nextBtn) {
        const isDisabled = currentSlide === slides.length - 1 || !imagesLoaded;
        nextBtn.disabled = isDisabled;
        nextBtn.style.backgroundColor = isDisabled ? 'rgba(203, 203, 203, 1)' : 'rgba(3, 105, 161, 1)';
        nextBtn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
        nextBtn.style.opacity = isDisabled ? '0.6' : '1';
    }
}

function updateCarouselDots() {
    const carouselDots = document.querySelectorAll('.carousel-dot');
    
    carouselDots.forEach((dot, index) => {
        const isActive = index === currentSlide;
        const isDisabled = !imagesLoaded;
        
        dot.disabled = isDisabled;
        dot.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
        dot.style.opacity = isDisabled ? '0.5' : '1';
        
        if (isActive) {
            dot.classList.add('active');
            dot.style.backgroundColor = 'rgba(2, 132, 199, 1)';
        } else {
            dot.classList.remove('active');
            dot.style.backgroundColor = 'rgba(203, 203, 203, 1)';
        }
    });
}

// Touch/Swipe Event Handlers
function onTouchStart(e) {
    touchEnd = null; // Reset touchEnd to avoid false swipe
    touchStart = e.targetTouches[0].clientX;
}

function onTouchMove(e) {
    touchEnd = e.targetTouches[0].clientX;
}

function onTouchEnd() {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1 && imagesLoaded) {
        nextSlide();
    }
    if (isRightSwipe && currentSlide > 0 && imagesLoaded) {
        prevSlide();
    }
}

// Setup Event Listeners for all interactive elements
function setupEventListeners() {
    // Prevent default action for all buttons that don't have specific functionality
    const preventDefaultButtons = document.querySelectorAll(
        '.login-btn, .demo-btn, .hero-demo-btn, .hero-how-btn, .cta-btn-primary, .cta-btn-secondary, a[href="#"]'
    );
    
    preventDefaultButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // You can add specific functionality here for each button type
            console.log('Button clicked:', button.textContent || button.innerText);
        });
    });
    
    // Add hover effects for hero buttons
    const heroDemo = document.querySelector('.hero-demo-btn');
    if (heroDemo) {
        heroDemo.addEventListener('mouseenter', () => {
            heroDemo.style.boxShadow = '0px 2px 4px 0px rgba(0, 0, 0, 0.1)';
        });
        heroDemo.addEventListener('mouseleave', () => {
            heroDemo.style.boxShadow = '0px 4px 6px 0px rgba(0, 0, 0, 0.1)';
        });
    }
    
    // Add hover effects for CTA secondary button
    const ctaSecondary = document.querySelector('.cta-btn-secondary');
    if (ctaSecondary) {
        ctaSecondary.addEventListener('mouseenter', () => {
            ctaSecondary.style.backgroundColor = 'white';
            ctaSecondary.style.color = 'rgba(37, 99, 235, 1)';
        });
        ctaSecondary.addEventListener('mouseleave', () => {
            ctaSecondary.style.backgroundColor = 'transparent';
            ctaSecondary.style.color = 'white';
        });
    }
    
    // Smooth scrolling for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile Services dropdown: caret toggles submenu; text navigates
    document.addEventListener('click', (e) => {
        const caretBtn = e.target.closest('.mobile-caret-btn');
        if (caretBtn) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            const detailsEl = caretBtn.closest('details.mobile-dropdown');
            if (detailsEl) {
                detailsEl.open = !detailsEl.open;
            }
        }
    });
}

// Contact Modal
function initializeContactModal() {
    const modal = document.getElementById('contactModal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const overlay = modal;

    if (!modal) return;

    const openModal = (planName = null) => {
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        modal.setAttribute('aria-hidden', 'false');
        
        const messageField = document.getElementById('ctaMessage');
        if (messageField) {
            // If a plan is selected, pre-fill the message field with plan name
            if (planName) {
                messageField.value = planName + ' plan';
                // Trigger input event to clear any existing errors
                messageField.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                // Clear message field if opened from regular CTA button
                messageField.value = '';
            }
        }
        
        const firstInput = document.getElementById('ctaFirstName');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 0);
        }
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        modal.setAttribute('aria-hidden', 'true');
        
        // Clear the message field when modal closes (optional - can be removed if you want to preserve it)
        // Uncomment the lines below if you want to clear the message on close
        // const messageField = document.getElementById('ctaMessage');
        // if (messageField) {
        //     messageField.value = '';
        // }
    };

    // Open modal from CTA button
    const openBtn = document.getElementById('ctaContactBtn');
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(); // No plan selected for regular CTA button
        });
    }

    // Open modal from hero Contact Us button
    const heroContactBtn = document.getElementById('heroContactBtn');
    if (heroContactBtn) {
        heroContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(); // No plan selected for hero Contact Us button
        });
    }

    // Open modal from all "Choose Plan" buttons (pricing section)
    const pricingButtons = document.querySelectorAll('.open-contact-modal');
    pricingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const planName = button.getAttribute('data-plan');
            openModal(planName); // Pass the plan name to pre-fill message
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    const form = document.getElementById('ctaContactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactFormSubmission(form, closeModal);
        });
        
        // Add real-time validation for modal form
        const firstNameInput = form.querySelector('#ctaFirstName');
        const lastNameInput = form.querySelector('#ctaLastName');
        const emailInput = form.querySelector('#ctaEmail');
        const phoneInput = form.querySelector('#ctaPhone');
        
        // First Name validation
        if (firstNameInput) {
            firstNameInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('ctaFirstName', 'First name should only contain letters and spaces');
                } else {
                    clearFieldError('ctaFirstName');
                }
            });
            
            firstNameInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('ctaFirstName', 'First name should only contain letters and spaces');
                }
            });
        }
        
        // Last Name validation
        if (lastNameInput) {
            lastNameInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('ctaLastName', 'Last name should only contain letters and spaces');
                } else {
                    clearFieldError('ctaLastName');
                }
            });
            
            lastNameInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('ctaLastName', 'Last name should only contain letters and spaces');
                }
            });
        }
        
        // Email validation
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateEmail(value)) {
                    showFieldError('ctaEmail', 'Please enter a valid email address (e.g., name@example.com)');
                } else {
                    clearFieldError('ctaEmail');
                }
            });
            
            emailInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateEmail(value)) {
                    showFieldError('ctaEmail', 'Please enter a valid email address (e.g., name@example.com)');
                }
            });
        }
        
        // Phone validation
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateUAEPhone(value)) {
                    showFieldError('ctaPhone', 'Please enter a valid UAE phone number (e.g., +971 50 123 4567 or 050 123 4567)');
                } else {
                    clearFieldError('ctaPhone');
                }
            });
            
            phoneInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateUAEPhone(value)) {
                    showFieldError('ctaPhone', 'Please enter a valid UAE phone number (e.g., +971 50 123 4567 or 050 123 4567)');
                }
            });
        }
        
        // Clear errors for other fields when user types
        const otherInputs = form.querySelectorAll('.form-input:not(#ctaFirstName):not(#ctaLastName):not(#ctaEmail):not(#ctaPhone), .form-select, .form-textarea');
        otherInputs.forEach(input => {
            input.addEventListener('input', function() {
                const fieldName = this.id;
                clearFieldError(fieldName);
            });
            
            input.addEventListener('change', function() {
                const fieldName = this.id;
                clearFieldError(fieldName);
            });
        });
    }
    
    // Handle main contact form on contact-us.html
    const mainContactForm = document.getElementById('contactForm');
    if (mainContactForm) {
        mainContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleContactFormSubmission(mainContactForm);
            return false;
        });
        
        // Add real-time validation
        const firstNameInput = mainContactForm.querySelector('#firstName');
        const lastNameInput = mainContactForm.querySelector('#lastName');
        const phoneInput = mainContactForm.querySelector('#phone');
        
        // First Name validation
        if (firstNameInput) {
            firstNameInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('firstName', 'First name should only contain letters and spaces');
                } else {
                    clearFieldError('firstName');
                }
            });
            
            firstNameInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('firstName', 'First name should only contain letters and spaces');
                }
            });
        }
        
        // Last Name validation
        if (lastNameInput) {
            lastNameInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('lastName', 'Last name should only contain letters and spaces');
                } else {
                    clearFieldError('lastName');
                }
            });
            
            lastNameInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateName(value)) {
                    showFieldError('lastName', 'Last name should only contain letters and spaces');
                }
            });
        }
        
        // Email validation
        const emailInput = mainContactForm.querySelector('#email');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateEmail(value)) {
                    showFieldError('email', 'Please enter a valid email address (e.g., name@example.com)');
                } else {
                    clearFieldError('email');
                }
            });
            
            emailInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateEmail(value)) {
                    showFieldError('email', 'Please enter a valid email address (e.g., name@example.com)');
                }
            });
        }
        
        // Phone validation
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (value && !validateUAEPhone(value)) {
                    showFieldError('phone', 'Please enter a valid UAE phone number (e.g., +971 50 123 4567 or 050 123 4567)');
                } else {
                    clearFieldError('phone');
                }
            });
            
            phoneInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value && !validateUAEPhone(value)) {
                    showFieldError('phone', 'Please enter a valid UAE phone number (e.g., +971 50 123 4567 or 050 123 4567)');
                }
            });
        }
        
        // Clear errors for other fields when user types
        const otherInputs = mainContactForm.querySelectorAll('.form-input:not(#firstName):not(#lastName):not(#email):not(#phone), .form-select, .form-textarea');
        otherInputs.forEach(input => {
            input.addEventListener('input', function() {
                const fieldName = this.id;
                clearFieldError(fieldName);
            });
            
            input.addEventListener('change', function() {
                const fieldName = this.id;
                clearFieldError(fieldName);
            });
        });
    }
}

// Validation functions
function validateName(name) {
    // Allow letters (including accented characters) and spaces only
    return /^[\p{L}\s]+$/u.test(name);
}

function validateEmail(email) {
    if (!email || email.trim() === '') {
        return false; // Email is required
    }
    
    // Strict email validation regex
    // Pattern: local-part@domain.tld
    // Local part: letters, numbers, dots, hyphens, underscores, plus signs, percent signs
    // Domain: letters, numbers, dots, hyphens
    // Must have @ symbol and valid domain with TLD (at least 2 characters)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(email)) {
        return false;
    }
    
    // Additional checks
    const parts = email.split('@');
    if (parts.length !== 2) {
        return false;
    }
    
    const localPart = parts[0];
    const domain = parts[1];
    
    // Local part must not start or end with dot, hyphen, or underscore
    if (/^[._-]|[._-]$/.test(localPart)) {
        return false;
    }
    
    // Domain must not start or end with dot or hyphen
    if (/^[.-]|[.-]$/.test(domain)) {
        return false;
    }
    
    // Domain must have at least one dot (for TLD)
    if (!domain.includes('.')) {
        return false;
    }
    
    // TLD must be at least 2 characters
    const tld = domain.substring(domain.lastIndexOf('.') + 1);
    if (tld.length < 2) {
        return false;
    }
    
    return true;
}

function validateUAEPhone(phone) {
    if (!phone || phone.trim() === '') {
        return true; // Phone is optional
    }
    
    // Remove all spaces, dashes, and parentheses for validation
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // UAE phone number patterns:
    // +971XXXXXXXXX (12 digits starting with +971)
    // 971XXXXXXXXX (11 digits starting with 971)
    // 0XXXXXXXXX (10 digits starting with 0)
    // 05XXXXXXXX (9 digits starting with 05)
    
    return /^\+971[0-9]{9}$/.test(cleaned) ||
           /^971[0-9]{9}$/.test(cleaned) ||
           /^0[0-9]{9}$/.test(cleaned) ||
           /^05[0-9]{7}$/.test(cleaned);
}

function showFieldError(fieldId, errorMessage) {
    const errorSpan = document.getElementById(fieldId + '-error');
    const inputField = document.getElementById(fieldId);
    
    if (errorSpan && inputField) {
        errorSpan.textContent = errorMessage;
        errorSpan.style.setProperty('display', 'block', 'important');
        errorSpan.style.setProperty('visibility', 'visible', 'important');
        errorSpan.style.setProperty('color', '#EF4444', 'important');
        errorSpan.style.setProperty('font-size', '14px', 'important');
        errorSpan.style.setProperty('margin-top', '6px', 'important');
        errorSpan.style.setProperty('line-height', '1.4', 'important');
        errorSpan.style.setProperty('opacity', '1', 'important');
        errorSpan.classList.add('show');
        
        // Add input-error class and set border styles directly
        inputField.classList.add('input-error');
        inputField.style.setProperty('border-color', '#EF4444', 'important');
        inputField.style.setProperty('border-width', '2px', 'important');
        inputField.style.setProperty('border-style', 'solid', 'important');
        return true;
    }
    return false;
}

function clearFieldError(fieldId) {
    const errorSpan = document.getElementById(fieldId + '-error');
    const inputField = document.getElementById(fieldId);
    
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
        errorSpan.classList.remove('show');
    }
    if (inputField) {
        inputField.classList.remove('input-error');
    }
}

// Handle contact form submission via AJAX
function handleContactFormSubmission(form, onSuccessCallback = null) {
    console.log('handleContactFormSubmission called', form); // Debug log
    
    if (!form) {
        console.error('Form not found');
        return;
    }
    
    // Check if form is already being submitted (prevent duplicate submissions)
    if (form.dataset.submitting === 'true') {
        console.log('Form is already being submitted, ignoring duplicate submission');
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) {
        console.error('Submit button not found');
        return;
    }
    
    // Client-side validation before submission
    // Check if this is the main contact form or modal form
    const isModalForm = form.id === 'ctaContactForm';
    const firstNameField = isModalForm ? '#ctaFirstName' : '#firstName';
    const lastNameField = isModalForm ? '#ctaLastName' : '#lastName';
    const emailField = isModalForm ? '#ctaEmail' : '#email';
    const phoneField = isModalForm ? '#ctaPhone' : '#phone';
    
    const firstName = form.querySelector(firstNameField)?.value.trim() || '';
    const lastName = form.querySelector(lastNameField)?.value.trim() || '';
    const email = form.querySelector(emailField)?.value.trim() || '';
    const phone = form.querySelector(phoneField)?.value.trim() || '';
    let hasErrors = false;
    
    // Validate first name (required field)
    const firstNameFieldId = isModalForm ? 'ctaFirstName' : 'firstName';
    if (!firstName || firstName.trim() === '') {
        showFieldError(firstNameFieldId, 'First name is required');
        hasErrors = true;
    } else if (!validateName(firstName)) {
        showFieldError(firstNameFieldId, 'First name should only contain letters and spaces');
        hasErrors = true;
    }
    
    // Validate last name (required field)
    const lastNameFieldId = isModalForm ? 'ctaLastName' : 'lastName';
    if (!lastName || lastName.trim() === '') {
        showFieldError(lastNameFieldId, 'Last name is required');
        hasErrors = true;
    } else if (!validateName(lastName)) {
        showFieldError(lastNameFieldId, 'Last name should only contain letters and spaces');
        hasErrors = true;
    }
    
    // Validate email (required field)
    const emailFieldId = isModalForm ? 'ctaEmail' : 'email';
    if (!email || email.trim() === '') {
        showFieldError(emailFieldId, 'Email address is required');
        hasErrors = true;
    } else if (!validateEmail(email)) {
        showFieldError(emailFieldId, 'Please enter a valid email address (e.g., name@example.com)');
        hasErrors = true;
    }
    
    // Validate phone (optional field)
    const phoneFieldId = isModalForm ? 'ctaPhone' : 'phone';
    if (phone && !validateUAEPhone(phone)) {
        showFieldError(phoneFieldId, 'Please enter a valid UAE phone number (e.g., +971 50 123 4567 or 050 123 4567)');
        hasErrors = true;
    }
    
    // Validate helpType (required field)
    const helpTypeFieldId = isModalForm ? 'ctaHelpType' : 'helpType';
    const helpType = form.querySelector(isModalForm ? '#ctaHelpType' : '#helpType')?.value.trim() || '';
    if (!helpType || helpType === '') {
        showFieldError(helpTypeFieldId, 'Please select how we can help you');
        hasErrors = true;
    }
    
    // Validate message (required field)
    const messageFieldId = isModalForm ? 'ctaMessage' : 'message';
    const message = form.querySelector(isModalForm ? '#ctaMessage' : '#message')?.value.trim() || '';
    if (!message || message.trim() === '') {
        showFieldError(messageFieldId, 'Message is required');
        hasErrors = true;
    }
    
    // If client-side validation fails, stop submission
    if (hasErrors) {
        // Reset submitting flag since we're not actually submitting
        form.dataset.submitting = 'false';
        const firstError = form.querySelector('.input-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }
    
    // Mark form as submitting to prevent duplicate submissions
    form.dataset.submitting = 'true';
    
    const originalButtonText = submitButton.innerHTML;
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    console.log('Form submission started'); // Debug log
    
    // Get form data
    const formData = new FormData(form);
    
    // Show message container if it doesn't exist
    const isModalFormCheck = form.id === 'ctaContactForm';
    const messageContainerId = isModalFormCheck ? 'ctaFormMessage' : 'formMessage';
    let messageContainer = document.getElementById(messageContainerId) || form.querySelector('.form-message');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'form-message';
        messageContainer.id = messageContainerId;
        // Insert message container right before the submit button
        const submitButtonParent = submitButton.parentElement;
        submitButtonParent.insertBefore(messageContainer, submitButton);
    }
    
    // Clear any previous messages and reset success flag on new submission
    messageContainer.style.display = 'none';
    messageContainer.style.opacity = '1';
    messageContainer.style.transition = 'opacity 0.3s ease-in';
    messageContainer.dataset.successShown = 'false'; // Reset flag on new submission attempt
    messageContainer.innerHTML = ''; // Clear previous content
    
    // Send form data via fetch
    fetch('send-email.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response received for form:', form.id, 'Data:', data);
        console.log('Has fieldErrors?', !!data.fieldErrors, 'fieldErrors:', data.fieldErrors);
        if (data.success) {
            // Clear all field errors on success
            const allErrorSpans = form.querySelectorAll('.field-error');
            allErrorSpans.forEach(span => {
                span.textContent = '';
                span.style.display = 'none';
                span.classList.remove('show');
            });
            
            // Remove error classes from inputs
            const allInputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
            allInputs.forEach(input => {
                input.classList.remove('input-error');
            });
            
            // Check if success message was already shown (prevent duplicate displays)
            if (messageContainer.dataset.successShown === 'true') {
                return; // Don't show success message again
            }
            
            // Mark that success message has been shown
            messageContainer.dataset.successShown = 'true';
            
            // Show success message with centered wrapper
            messageContainer.className = 'form-message form-message-success';
            messageContainer.innerHTML = '<div style="text-align: center; width: 100%; display: flex; justify-content: center; align-items: center;"><span style="display: inline-block; background-color: #cce8cc; color: #000000; padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: 500; text-align: center;"><i class="fa-solid fa-check-circle"></i> ' + data.message + '</span></div>';
            messageContainer.style.display = 'block';
            messageContainer.style.opacity = '1';
            messageContainer.style.transition = 'opacity 0.5s ease-out';
            messageContainer.style.textAlign = 'center';
            messageContainer.style.width = '100%';
            
            // Reset form
            form.reset();
            
            // Close modal if callback provided (only on success, after showing message)
            if (onSuccessCallback && typeof onSuccessCallback === 'function') {
                // Don't close immediately, wait for user to see success message
                setTimeout(() => {
                    onSuccessCallback();
                }, 4500); // Close after message fades out (4 seconds + 0.5 second fade)
            }
            
            // Scroll to message if on contact page (only if not in modal)
            if (!onSuccessCallback) {
                messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Fade out message after 4 seconds
            setTimeout(() => {
                messageContainer.style.opacity = '0';
                setTimeout(() => {
                    messageContainer.style.display = 'none';
                    // Reset the flag after message is hidden so it can show again on next successful submission
                    messageContainer.dataset.successShown = 'false';
                }, 500); // Wait for fade-out transition to complete
            }, 4000);
        } else {
            console.log('Form submission failed. Field errors:', data.fieldErrors);
            // Clear all previous field errors
            const allErrorSpans = form.querySelectorAll('.field-error');
            console.log('Found', allErrorSpans.length, 'error spans in form');
            allErrorSpans.forEach(span => {
                span.textContent = '';
                span.style.display = 'none';
                span.style.visibility = 'hidden';
                span.style.opacity = '0';
                span.classList.remove('show');
            });
            
            // Remove error classes from inputs
            const allInputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
            allInputs.forEach(input => {
                input.classList.remove('input-error');
            });
            
            // Show field-specific errors if available
            if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
                console.log('Processing', Object.keys(data.fieldErrors).length, 'field errors');
                // Hide general message container
                messageContainer.style.display = 'none';
                
                // Check if this is modal form to map field names
                const isModalFormCheck = form.id === 'ctaContactForm';
                const fieldNameMap = isModalFormCheck ? {
                    'firstName': 'ctaFirstName',
                    'lastName': 'ctaLastName',
                    'email': 'ctaEmail',
                    'phone': 'ctaPhone',
                    'company': 'ctaCompany',
                    'helpType': 'ctaHelpType',
                    'message': 'ctaMessage'
                } : {};
                
                // Show errors below each field
                for (const fieldName in data.fieldErrors) {
                    // Map field name if modal form
                    const actualFieldName = isModalFormCheck && fieldNameMap[fieldName] ? fieldNameMap[fieldName] : fieldName;
                    
                    // Try to find error span - first in form, then in document
                    let errorSpan = form.querySelector('#' + actualFieldName + '-error');
                    if (!errorSpan) {
                        errorSpan = document.getElementById(actualFieldName + '-error');
                    }
                    
                    // Try to find input field - first in form, then in document
                    let inputField = form.querySelector('#' + actualFieldName);
                    if (!inputField) {
                        inputField = document.getElementById(actualFieldName);
    }
                    
                    console.log('Processing field error:', fieldName, '->', actualFieldName, 'Error span:', errorSpan, 'Input field:', inputField);
                    
                    if (errorSpan && inputField) {
                        errorSpan.textContent = data.fieldErrors[fieldName];
                        errorSpan.style.setProperty('display', 'block', 'important');
                        errorSpan.style.setProperty('visibility', 'visible', 'important');
                        errorSpan.style.setProperty('color', '#EF4444', 'important');
                        errorSpan.style.setProperty('font-size', '14px', 'important');
                        errorSpan.style.setProperty('margin-top', '6px', 'important');
                        errorSpan.style.setProperty('line-height', '1.4', 'important');
                        errorSpan.style.setProperty('opacity', '1', 'important');
                        errorSpan.style.setProperty('position', 'relative', 'important');
                        errorSpan.style.setProperty('z-index', '1', 'important');
                        errorSpan.classList.add('show');
                        
                        // Add input-error class and set border styles directly
                        inputField.classList.add('input-error');
                        inputField.style.setProperty('border-color', '#EF4444', 'important');
                        inputField.style.setProperty('border-width', '2px', 'important');
                        inputField.style.setProperty('border-style', 'solid', 'important');
                        console.log('Error displayed for:', actualFieldName, 'Message:', data.fieldErrors[fieldName], 'Input field:', inputField);
                    } else {
                        console.error('Could not find error span or input for:', actualFieldName);
                        console.error('Searched in form:', form);
                        console.error('Error span found:', errorSpan);
                        console.error('Input field found:', inputField);
                        // Try alternative: search within modal if it's a modal form
                        if (isModalFormCheck) {
                            const modal = form.closest('.modal-overlay') || form.closest('#contactModal');
                            if (modal) {
                                errorSpan = modal.querySelector('#' + actualFieldName + '-error');
                                inputField = modal.querySelector('#' + actualFieldName);
                                if (errorSpan && inputField) {
                                    errorSpan.textContent = data.fieldErrors[fieldName];
                                    errorSpan.style.setProperty('display', 'block', 'important');
                                    errorSpan.style.setProperty('visibility', 'visible', 'important');
                                    errorSpan.style.setProperty('color', '#EF4444', 'important');
                                    errorSpan.style.setProperty('font-size', '14px', 'important');
                                    errorSpan.style.setProperty('margin-top', '6px', 'important');
                                    errorSpan.style.setProperty('line-height', '1.4', 'important');
                                    errorSpan.style.setProperty('opacity', '1', 'important');
                                    errorSpan.classList.add('show');
                                    
                                    // Add input-error class and set border styles directly
                                    inputField.classList.add('input-error');
                                    inputField.style.setProperty('border-color', '#EF4444', 'important');
                                    inputField.style.setProperty('border-width', '2px', 'important');
                                    inputField.style.setProperty('border-style', 'solid', 'important');
                                    console.log('Error displayed for:', actualFieldName, '(found in modal)');
                                }
                            }
                        }
                    }
                }
                
                // Scroll to first error field (only if not in modal, or scroll within modal)
                const firstError = form.querySelector('.input-error');
                if (firstError) {
                    setTimeout(() => {
                        // For modal forms, scroll within the modal content
                        if (form.id === 'ctaContactForm') {
                            const modalContent = form.closest('.modal-content');
                            if (modalContent) {
                                firstError.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                            }
                        } else {
                            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        firstError.focus();
                    }, 100);
                }
            } else {
                // Show general error message only if no field errors
                messageContainer.className = 'form-message form-message-error';
                let errorMsg = data.message || 'An error occurred. Please try again.';
                if (data.errors && data.errors.length > 0) {
                    errorMsg += '<ul style="margin: 10px 0 0 20px; text-align: left;">';
                    data.errors.forEach(error => {
                        errorMsg += '<li>' + error + '</li>';
                    });
                    errorMsg += '</ul>';
                }
                messageContainer.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> ' + errorMsg;
                messageContainer.style.display = 'block';
                // Don't scroll if in modal (modal handles its own scrolling)
                if (form.id !== 'ctaContactForm') {
                    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageContainer.className = 'form-message form-message-error';
        messageContainer.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> Network error. Please check your connection and try again.';
        messageContainer.style.display = 'block';
        // Don't scroll if in modal (modal handles its own scrolling)
        if (form.id !== 'ctaContactForm') {
            messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    })
    .finally(() => {
        // Re-enable submit button and reset submitting flag
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        form.dataset.submitting = 'false'; // Allow new submissions
    });
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    // Close mobile menu on desktop resize
    if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        closeMobileMenu();
    }
});

// Intersection Observer for animations (optional enhancement)
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards for fade-in animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe metrics for fade-in animation
    const metrics = document.querySelectorAll('.metric');
    metrics.forEach(metric => {
        metric.style.opacity = '0';
        metric.style.transform = 'translateY(20px)';
        metric.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(metric);
    });
}

// Utility function to handle form submissions (if needed in the future)
function handleFormSubmission(formData) {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
}

// FAQ Accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (answer) {
            // Ensure answers start collapsed for smooth transitions
            answer.style.maxHeight = '0px';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 300ms ease';
        }
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0px';
                    }
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                if (answer) {
                    answer.style.maxHeight = '0px';
                }
            } else {
                item.classList.add('active');
                if (answer) {
                    // Set to scrollHeight for smooth open
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
}

// Initialize FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});

// Export functions for potential external use
window.IngoWebs = {
    toggleMobileMenu,
    nextSlide,
    prevSlide,
    goToSlide,
    handleFormSubmission,
    initFAQ
};
