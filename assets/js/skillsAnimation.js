// Optimized Skills Animation - Performance Enhanced
document.addEventListener('DOMContentLoaded', function() {
    const skillsSection = document.getElementById('skills');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const skillProgressSpans = document.querySelectorAll('.skill-progress span');
    const skillSubjects = document.querySelectorAll('.skill-info .subject');
    
    let animationTriggered = false;

    // Intersection Observer with optimized settings
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                animationTriggered = true;
                observer.unobserve(entry.target); // Disconnect after first trigger
                requestAnimationFrame(() => startSkillsAnimation());
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Optimized animation start
    function startSkillsAnimation() {
        // Batch DOM updates for better performance
        const batch = [];
        
        // Animate progress bars with reduced delay
        skillProgressBars.forEach((progressBar, index) => {
            batch.push(
                setTimeout(() => {
                    progressBar.classList.add('animate');
                }, index * 50)
            );
        });

        // Animate progress spans
        skillProgressSpans.forEach((span, index) => {
            batch.push(
                setTimeout(() => {
                    const skillElement = span.closest('.skill');
                    const percentageElement = skillElement.querySelector('.skill-percentage');
                    const targetWidth = percentageElement.textContent;
                    span.style.setProperty('--target-width', targetWidth);
                    span.classList.add('animate');
                }, index * 50 + 100)
            );
        });

        // Simplified percentage animation
        const skillPercentages = document.querySelectorAll('.skill-percentage');
        skillPercentages.forEach((percentage, index) => {
            batch.push(
                setTimeout(() => {
                    percentage.classList.add('animate');
                }, index * 50 + 100)
            );
        });
    }

    // Observe the skills section once
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
});