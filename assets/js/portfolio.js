// Portfolio Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Scroll animations
    initScrollAnimations();
    
    // Counter animations
    initCounterAnimations();
    
    // Typing effect for hero title
    initTypingEffect();
    
    // Progress bars for skills
    initProgressBars();
    
    // Modal functionality
    initModals();
    
    // Theme toggle
    initThemeToggle();
});

// Smooth scrolling implementation
function initSmoothScrolling() {
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
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('competency-card') || 
                    entry.target.classList.contains('overview-card')) {
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Counter animations
function initCounterAnimations() {
    function animateCounters() {
        const counters = document.querySelectorAll('.result-number, .stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.replace(/\d+/, target);
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                }
            }, 30);
        });
    }

    // Trigger counter animation when results section is visible
    const resultsSection = document.querySelector('.results');
    const resultsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                resultsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (resultsSection) {
        resultsObserver.observe(resultsSection);
    }
}

// Typing effect for hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// Progress bars for skills (if needed)
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        const progressFill = bar.querySelector('.progress-fill');
        
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.width = progress + '%';
            }, 500);
        }
    });
}

// Modal functionality
function initModals() {
    // Create modal HTML if it doesn't exist
    if (!document.querySelector('.modal')) {
        const modalHTML = `
            <div class="modal" id="projectModal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div class="modal-body">
                        <h2 id="modalTitle">Project Details</h2>
                        <div id="modalContent"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles
        const modalStyles = `
            <style>
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 2000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    backdrop-filter: blur(5px);
                }
                
                .modal-content {
                    background-color: white;
                    margin: 5% auto;
                    padding: 2rem;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    animation: modalSlideIn 0.3s ease;
                }
                
                @keyframes modalSlideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .close {
                    position: absolute;
                    right: 1rem;
                    top: 1rem;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #6b7280;
                    transition: color 0.3s ease;
                }
                
                .close:hover {
                    color: #2563eb;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
    }
    
    // Modal event listeners
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    
    // Close modal events
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Theme toggle functionality
function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    // Add to navigation
    const nav = document.querySelector('nav .container');
    if (nav) {
        nav.appendChild(themeToggle);
    }
    
    // Add theme toggle styles
    const themeStyles = `
        <style>
            .theme-toggle {
                background: none;
                border: 2px solid #2563eb;
                color: #2563eb;
                padding: 0.5rem;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .theme-toggle:hover {
                background: #2563eb;
                color: white;
            }
            
            .dark-theme {
                --bg-color: #1f2937;
                --text-color: #f9fafb;
                --card-bg: #374151;
            }
            
            .dark-theme .main-content {
                background: var(--bg-color);
                color: var(--text-color);
            }
            
            .dark-theme .overview-card,
            .dark-theme .competency-card {
                background: var(--card-bg);
                color: var(--text-color);
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', themeStyles);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('darkMode', isDark);
    });
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Utility functions
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

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(() => {
    // Add any scroll-based functionality here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add loading state management
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.id = 'pageLoader';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.remove();
    }
}

// Export functions for external use
window.PortfolioJS = {
    showLoading,
    hideLoading,
    initModals,
    initScrollAnimations
}; 