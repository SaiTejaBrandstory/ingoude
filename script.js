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
});

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
        
        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-login-btn, .mobile-demo-btn');
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
            const detailsEl = caretBtn.closest('details.mobile-dropdown');
            if (detailsEl) {
                detailsEl.open = !detailsEl.open;
            }
        }
    });
}

// Contact Modal
function initializeContactModal() {
    const openBtn = document.getElementById('ctaContactBtn');
    const modal = document.getElementById('contactModal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const overlay = modal;

    if (!openBtn || !modal) return;

    const openModal = () => {
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        const firstInput = document.getElementById('ctaFirstName');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 0);
        }
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        openBtn.focus();
    };

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
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
            // For now, just close and log. Integrate with backend later.
            console.log('CTA Contact form submitted');
            closeModal();
        });
    }
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
