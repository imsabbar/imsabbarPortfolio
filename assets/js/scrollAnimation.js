// Enhanced scroll progress with dot navigation integration
let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let progressValue = document.getElementById("progress-value");
    
    if (!scrollProgress) {
        console.error('Progress element not found');
        return;
    }
    
    let pos = document.documentElement.scrollTop;
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    let scrollValue = Math.round((pos * 100) / calcHeight);  

    if (pos > 100) {
        scrollProgress.style.display = "grid";
    } else {
        scrollProgress.style.display = "none";
    }  

    // Enhanced scroll progress styling with theme colors
    scrollProgress.style.background = `conic-gradient(var(--primary-color, #6C63FF) ${scrollValue}%, rgba(var(--text-color), 0.2) ${scrollValue}%)`;
    
    // Add smooth transition effect
    scrollProgress.style.transition = 'all 0.3s ease';
};

// Initialize scroll progress click handler
document.addEventListener('DOMContentLoaded', function() {
    const scrollProgress = document.getElementById("progress");
    if (scrollProgress) {
        console.log('Progress button found, adding click handler');
        scrollProgress.addEventListener("click", () => {
            console.log('Progress button clicked - scrolling to top');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.error('Progress button not found in DOM');
    }
});    
  




// disapear Scroll Icon when scrolling
const scrollDownDiv = document.querySelector('.scroll-down');

function handleScroll() {
  if (window.scrollY > 150) 
    scrollDownDiv.classList.add('isHidden');

  else 
    scrollDownDiv.classList.remove('isHidden');
  
}

// Combined scroll event handler
window.addEventListener('scroll', function() {
    handleScroll();
    calcScrollValue();
});

// Initialize on page load
window.addEventListener('load', calcScrollValue);
