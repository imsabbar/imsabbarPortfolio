

// // Select all sections and navigation links in the header
// let sections = document.querySelectorAll('section');
// let navLinks = document.querySelectorAll('header nav ul li a');

// // Select all navigation links and spans for dots in the right content bar
// let barNavLinks = document.querySelectorAll('.content-right-bar .dot-map a');
// let barNavLinks_Span = document.querySelectorAll('.content-right-bar .dot-map a span');

// // Function to handle scroll event
// window.onscroll = () => {

//   calcScrollValue();

//   sections.forEach(section => {
//     let top = window.scrollY;
//     let offset = section.offsetTop - 150;
//     let height = section.offsetHeight;
//     let sectionID = section.getAttribute('id');

//     // Check if the current section is in view
//     if (top >= offset && top < offset + height) {

//       // Handle navigation links in the header
//       navLinks.forEach(links => {
//         links.classList.remove('active');
//       });
//       document.querySelector('header nav ul li a[href*=' + sectionID + ']').classList.add('active');


//       // Handle dots in the right content bar (colors and size)
//       barNavLinks_Span.forEach(bar_Span => {
//         bar_Span.classList.remove('activeColor');
//       });
//       document.querySelector('.content-right-bar .dot-map a[href*=' + sectionID + '] span').classList.add('activeColor');


//       barNavLinks.forEach(barLinks => {
//         barLinks.classList.remove('activeExpand');
//       });
//       document.querySelector('.content-right-bar .dot-map a[href*=' + sectionID + ']').classList.add('activeExpand');


      
//       // Store the active section in localStorage
//       localStorage.setItem('activeSection', sectionID);
//     }
//   });
// };


// // Function to handle page load
// window.onload = () => {

//   calcScrollValue();

//   // Retrieve the stored active section from localStorage
//   let activeSection = localStorage.getItem('activeSection');

//   // If an active section is found, apply the active styles
//   if (activeSection) {
//     navLinks.forEach(links => {
//       links.classList.remove('active');
//     });
//     document.querySelector('header nav ul li a[href*=' + activeSection + ']').classList.add('active');

//     barNavLinks_Span.forEach(bar_Span => {
//       bar_Span.classList.remove('activeColor');
//     });
//     document.querySelector('.content-right-bar .dot-map a[href*=' + activeSection + '] span').classList.add('activeColor');

//     barNavLinks.forEach(barLinks => {
//       barLinks.classList.remove('activeExpand');
//     });
//     document.querySelector('.content-right-bar .dot-map a[href*=' + activeSection + ']').classList.add('activeExpand');
//   }
// };





/* ================ */
/* JavaScript Helper Classes */
/* ================ */

/* For particles animation */
document.addEventListener('DOMContentLoaded', function() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);
  
  // Create particles
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 10 + 5;
    const posX = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.bottom = `-${size}px`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    particlesContainer.appendChild(particle);
  }
});







// newly added
// Replace your current JS with this optimized version
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const navItems = document.querySelectorAll('.nav-links li a');
    const logo = document.querySelector('.logo');

    // Theme Management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function handleThemeToggle() {
        // Prevent multiple clicks during animation
        if (this.classList.contains('clicked')) return;
        
        // Add click animation class
        this.classList.add('clicked');
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Enhanced smooth theme transition with staggered timing
        document.body.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        // Delay theme change for better visual feedback
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }, 200);
        
        // Remove click animation class after animation completes
        setTimeout(() => {
            this.classList.remove('clicked');
            document.body.style.transition = '';
        }, 900);
        
        // Synchronized animation for all toggles with staggered timing
        themeToggles.forEach((toggle, index) => {
            if (toggle !== this) {
                setTimeout(() => {
                    toggle.classList.add('clicked');
                    setTimeout(() => toggle.classList.remove('clicked'), 900);
                }, index * 50);
            }
        });
        
        // Add haptic feedback for supported devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('theme-toggle-ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Navigation
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        const dotNavItems = document.querySelectorAll('.dot-navigation .dot');
        
        navItems.forEach(item => {
            const targetId = item.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const section = document.querySelector(targetId);
            if (section) {
                const isActive = section.offsetTop <= scrollPosition && 
                               section.offsetTop + section.offsetHeight > scrollPosition;
                item.classList.toggle('active', isActive);
                
                // Update dot navigation with premium staggered animations
                const correspondingDot = document.querySelector(`.dot-navigation .dot[href="${targetId}"]`);
                if (correspondingDot) {
                    if (isActive && !correspondingDot.classList.contains('active')) {
                        correspondingDot.style.animation = 'premium-dot-activate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                        correspondingDot.classList.add('active');
                        
                        // Add ripple effect
                        const ripple = document.createElement('div');
                        ripple.className = 'dot-ripple';
                        correspondingDot.appendChild(ripple);
                        setTimeout(() => ripple.remove(), 600);
                    } else if (!isActive && correspondingDot.classList.contains('active')) {
                        correspondingDot.style.animation = 'premium-dot-deactivate 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                        correspondingDot.classList.remove('active');
                    }
                }
                
                if (isActive) {
                    const rect = item.getBoundingClientRect();
                    const navRect = navLinks.getBoundingClientRect();
                    navLinks.style.setProperty('--underline-left', `${rect.left - navRect.left}px`);
                    navLinks.style.setProperty('--underline-width', `${rect.width}px`);
                }
            }
        });
    }

    // Enhanced smooth scrolling with staggered animations
    function smoothScroll(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            // Add click animation to navigation item
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.15s ease-out';
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
            }, 150);
            
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Staggered menu close animation for mobile
            if (window.innerWidth <= 992) {
                const menuItems = navLinks.querySelectorAll('li');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateX(-100%)';
                        item.style.opacity = '0';
                    }, index * 50);
                });
                
                setTimeout(() => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    navOverlay.classList.remove('active');
                    document.body.classList.remove('menu-active');
                    document.body.style.overflow = '';
                    hamburger.setAttribute('aria-expanded', 'false');
                    
                    // Reset menu items
                    menuItems.forEach(item => {
                        item.style.transform = '';
                        item.style.opacity = '';
                    });
                }, menuItems.length * 50 + 200);
            }
        }
    }

    // Mobile Menu with Overlay
    function toggleMobileMenu() {
        const isOpening = !this.classList.contains('active');
        
        // Toggle menu states
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Prevent body scroll and add menu-active class
        if (isOpening) {
            document.body.classList.add('menu-active');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.classList.remove('menu-active');
            document.body.style.overflow = '';
        }
        
        // Set aria-expanded attribute for accessibility
        this.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
    }
    
    // Close menu when clicking on overlay
    function closeMenuOnOverlay() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Initialize
    function init() {
        initTheme();
        
        // Event Listeners
        // Enhanced header scroll effects
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            // Add scrolled class for blur effect
            header.classList.toggle('scrolled', currentScroll > 50);
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            updateActiveNav();
            lastScroll = currentScroll;
        });
        
        hamburger.addEventListener('click', toggleMobileMenu);
        navOverlay.addEventListener('click', closeMenuOnOverlay);
        themeToggles.forEach(toggle => toggle.addEventListener('click', handleThemeToggle));
        navItems.forEach(item => item.addEventListener('click', smoothScroll));
        
        // Add smooth scrolling to dot navigation
        const dotNavItems = document.querySelectorAll('.dot-navigation .dot');
        dotNavItems.forEach(dot => dot.addEventListener('click', smoothScroll));
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenuOnOverlay();
            }
        });
    }

    let lastScroll = 0;
    init();
});

// Mouse proximity effect for profile picture
document.addEventListener('DOMContentLoaded', function() {
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        heroImage.addEventListener('mousemove', function(e) {
            const rect = heroImage.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
            );
            
            // Remove all shape classes
            heroImage.classList.remove('shape-1', 'shape-2', 'shape-3');
            
            // Add shape class based on distance
            if (distance < 50) {
                heroImage.classList.add('shape-1');
            } else if (distance < 100) {
                heroImage.classList.add('shape-2');
            } else if (distance < 150) {
                heroImage.classList.add('shape-3');
            }
        });
        
        heroImage.addEventListener('mouseleave', function() {
            heroImage.classList.remove('shape-1', 'shape-2', 'shape-3');
        });
    }
});