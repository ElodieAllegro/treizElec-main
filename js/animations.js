// Système d'animations avancées inspiré de Green Got
class AnimationController {
    constructor() {
        this.scrollElements = [];
        this.counters = [];
        this.rafId = null;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.setupScrollObserver();
        this.setupCounters();
        this.setupSmoothScroll();
        this.setupTestimonialsSlider();
        this.bindEvents();
    }
    
    setupScrollObserver() {
        const options = {
            threshold: [0, 0.1, 0.2],
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseFloat(element.dataset.delay) || 0;
                    
                    // Utiliser requestAnimationFrame pour de meilleures performances
                    const animateElement = () => {
                        element.classList.add('visible');
                        
                        // Trigger counter animation
                        if (element.classList.contains('counter')) {
                            this.animateCounter(element);
                        }
                        
                        // Trigger stagger animation
                        if (element.classList.contains('stagger-animation')) {
                            this.animateStagger(element);
                        }
                        
                        // Nettoyer will-change après l'animation
                        setTimeout(() => {
                            element.classList.add('animation-complete');
                        }, 1200);
                    };
                    
                    delay > 0 ? setTimeout(animateElement, delay * 1000) : 
                               requestAnimationFrame(animateElement);
                    
                    this.observer.unobserve(element);
                }
            });
        }, options);
        
        // Observe all scroll-animated elements
        document.querySelectorAll('.animate-on-scroll, .service-card, .realization-item, .testimonial-card, .partner-logo, .counter, .stagger-animation').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    setupCounters() {
        this.counters = document.querySelectorAll('.counter .stat-number');
    }
    
    animateCounter(counterElement) {
        const numberElement = counterElement.querySelector('.stat-number');
        if (!numberElement) return;
        
        const target = parseInt(numberElement.dataset.target);
        const duration = 2500;
        const startTime = performance.now();
        let current = 0;
        
        counterElement.classList.add('counting');
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function pour un effet plus naturel
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            current = Math.floor(target * easeOutQuart);
            
            numberElement.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = target;
                counterElement.classList.remove('counting');
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    animateStagger(container) {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translate3d(0, 0, 0)';
                }, index * 150);
            }, index * 100);
        });
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    this.smoothScrollTo(targetPosition, 1000);
                }
            });
        });
        
        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const servicesSection = document.querySelector('#services');
                if (servicesSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = servicesSection.offsetTop - headerHeight;
                    this.smoothScrollTo(targetPosition, 1000);
                }
            });
        }
    }
    
    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        const easeInOutQuart = (t) => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        };
        
        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuart(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    setupTestimonialsSlider() {
        const track = document.getElementById('testimonialsTrack');
        if (!track) return;
        
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        
        // Auto-slide every 6 seconds avec pause au hover
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            const translateX = -currentIndex * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }, 6000);
    }
    
    bindEvents() {
        // Optimized scroll event avec requestAnimationFrame
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                this.updateScrollProgress();
            }
        });
        
        // Debounced resize event
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Resize handler if needed
            }, 250);
        });
        
        // Mouse move parallax for hero (throttled)
        const hero = document.querySelector('.hero');
        if (hero) {
            let mouseMoveTimeout;
            hero.addEventListener('mousemove', (e) => {
                if (!mouseMoveTimeout) {
                    mouseMoveTimeout = requestAnimationFrame(() => {
                        const { clientX, clientY } = e;
                        const { innerWidth, innerHeight } = window;
                        
                        const xPercent = (clientX / innerWidth - 0.5) * 2;
                        const yPercent = (clientY / innerHeight - 0.5) * 2;
                        
                        const heroContent = hero.querySelector('.hero-content');
                        if (heroContent) {
                            heroContent.style.transform = `translate3d(${xPercent * 12}px, ${yPercent * 12}px, 0)`;
                        }
                        mouseMoveTimeout = null;
                    });
                }
            });
        }
    }
    
    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update any scroll progress indicators
        const progressBars = document.querySelectorAll('.scroll-progress');
        progressBars.forEach(bar => {
            bar.style.width = `${scrollPercent}%`;
        });
    }
    
    // Public methods for manual animation triggers
    animateElement(element, animationType = 'fadeUp', delay = 0) {
        const animate = () => element.classList.add('animate-' + animationType);
        delay > 0 ? setTimeout(animate, delay) : requestAnimationFrame(animate);
    }
    
    resetAnimation(element) {
        element.classList.remove('visible');
        element.style.opacity = '0';
        element.style.transform = 'translate3d(0, 60px, 0)';
        element.classList.remove('animation-complete');
    }
}

// Advanced hover effects
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupServiceCardHovers();
        this.setupRealizationHovers();
        this.setupButtonHovers();
    }
    
    setupServiceCardHovers() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            let hoverTimeout;
            
            card.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                card.style.transform = 'translate3d(0, -12px, 0) scale3d(1.02, 1.02, 1)';
                card.style.boxShadow = '0 20px 40px rgba(0, 158, 255, 0.15)';
                
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale3d(1.1, 1.1, 1) rotateZ(5deg)';
                    icon.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    card.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
                    card.style.boxShadow = 'var(--shadow-light)';
                    
                    const icon = card.querySelector('.service-icon');
                    if (icon) {
                        icon.style.transform = 'scale3d(1, 1, 1) rotateZ(0deg)';
                        icon.style.background = 'var(--primary-color)';
                    }
                }, 50);
            });
        });
    }
    
    setupRealizationHovers() {
        const realizationItems = document.querySelectorAll('.realization-item');
        
        realizationItems.forEach(item => {
            const image = item.querySelector('.realization-image img');
            const overlay = item.querySelector('.realization-overlay');
            
            item.addEventListener('mouseenter', () => {
                if (image) {
                    image.style.transform = 'scale3d(1.1, 1.1, 1)';
                }
                if (overlay) {
                    overlay.style.transform = 'translate3d(0, 0, 0)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (image) {
                    image.style.transform = 'scale3d(1, 1, 1)';
                }
                if (overlay) {
                    overlay.style.transform = 'translate3d(0, 100%, 0)';
                }
            });
        });
    }
    
    setupButtonHovers() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translate3d(0, -3px, 0)';
                
                if (button.classList.contains('btn-primary')) {
                    button.style.boxShadow = '0 10px 20px rgba(0, 158, 255, 0.3)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate3d(0, 0, 0)';
                button.style.boxShadow = 'none';
            });
        });
    }
}

// Loading animations
class LoadingAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.showPageLoader();
        this.setupImageLoading();
    }
    
    showPageLoader() {
        // Create loading overlay
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.style.transform = 'translate3d(0, 0, 0)';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <img src="/assets/img/newLogo.svg" alt="Treize Elec Logo">
                </div>
                <div class="loader-text">TREIZELEC</div>
                <div class="loader-progress"></div>
            </div>
        `;

        document.body.appendChild(loader);

        // Hide loader when page is loaded
        window.addEventListener('load', () => {
            requestAnimationFrame(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 600);
            });
        });
    }
    
    setupImageLoading() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            });
            
            // Add loading shimmer
            if (!img.complete) {
                img.style.opacity = '0';
                const parent = img.parentElement;
                if (parent) {
                    parent.classList.add('loading-shimmer');
                }
                
                img.addEventListener('load', () => {
                    if (parent) {
                        parent.classList.remove('loading-shimmer');
                    }
                });
            }
        });
    }
}

// Initialize all animation systems
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Délai pour s'assurer que le DOM est complètement chargé
        requestAnimationFrame(() => {
            new AnimationController();
            new HoverEffects();
            new LoadingAnimations();
        });
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Cancel any pending animation frames
    if (window.animationController && window.animationController.rafId) {
        cancelAnimationFrame(window.animationController.rafId);
    }
});

// Export for use in other scripts
window.AnimationController = AnimationController;
window.HoverEffects = HoverEffects;
window.LoadingAnimations = LoadingAnimations;