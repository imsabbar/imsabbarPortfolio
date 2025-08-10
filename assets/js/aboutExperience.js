
// Counter animation for experience values
function animateCounters() {
    const expValues = document.querySelectorAll('.expValue');
    
    expValues.forEach(expValue => {
        const targetValue = parseInt(expValue.getAttribute('data-val'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeOutQuart for smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeProgress * targetValue);
            
            const displayValue = currentValue < 10 ? `0${currentValue}` : currentValue;
            expValue.textContent = displayValue + '+';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    });
}

// Start animation when page loads and when About section comes into view
document.addEventListener('DOMContentLoaded', function() {
    // Set up intersection observer for smooth animation
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(aboutSection);
    }
});
