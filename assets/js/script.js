

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
    const navLinks = document.querySelector('.navLinks');
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const navItems = document.querySelectorAll('.navLinks li a');
    const logo = document.querySelector('.logo');

    // Theme Management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function handleThemeToggle() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animation for all toggles
        themeToggles.forEach(toggle => {
            toggle.classList.add('clicked');
            setTimeout(() => toggle.classList.remove('clicked'), 300);
        });
    }

    // Navigation
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        navItems.forEach(item => {
            const targetId = item.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const section = document.querySelector(targetId);
            if (section) {
                const isActive = section.offsetTop <= scrollPosition && 
                               section.offsetTop + section.offsetHeight > scrollPosition;
                item.classList.toggle('active', isActive);
                
                if (isActive) {
                    const rect = item.getBoundingClientRect();
                    const navRect = navLinks.getBoundingClientRect();
                    navLinks.style.setProperty('--underline-left', `${rect.left - navRect.left}px`);
                    navLinks.style.setProperty('--underline-width', `${rect.width}px`);
                }
            }
        });
    }

    // Smooth scrolling
    function smoothScroll(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    // Mobile Menu
    function toggleMobileMenu() {
        const isOpening = !this.classList.contains('active');
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';
    }

    // Initialize
    function init() {
        initTheme();
        
        // Event Listeners
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            header.classList.toggle('scrolled', currentScroll > 50);
            header.classList.toggle('hidden', currentScroll > 100 && currentScroll > lastScroll);
            updateActiveNav();
            lastScroll = currentScroll;
        });
        
        hamburger.addEventListener('click', toggleMobileMenu);
        themeToggles.forEach(toggle => toggle.addEventListener('click', handleThemeToggle));
        navItems.forEach(item => item.addEventListener('click', smoothScroll));
    }

    let lastScroll = 0;
    init();
});