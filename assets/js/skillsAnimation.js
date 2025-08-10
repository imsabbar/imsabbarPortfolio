// Skills Animation with Intersection Observer and Loading Progress
document.addEventListener('DOMContentLoaded', function() {
    const skillsSection = document.getElementById('skills');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const skillProgressSpans = document.querySelectorAll('.skill-progress span');
    const skillSubjects = document.querySelectorAll('.skill-info .subject');
    
    let animationTriggered = false;
    let loadingProgress = 0;
    
    // Create loading progress indicator
    function createLoadingIndicator() {
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'skills-loading-container';
        loadingContainer.innerHTML = `
            <div class="skills-loading-progress">
                <div class="loading-bar">
                    <div class="loading-fill"></div>
                </div>
                <div class="loading-text">Loading Skills... <span class="loading-percentage">0%</span></div>
            </div>
        `;
        return loadingContainer;
    }

    // Intersection Observer for skills section
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {

                animationTriggered = true;
                showLoadingProgress();
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Show loading progress before skills animation
    function showLoadingProgress() {
        const technicalSkills = document.querySelector('.technical-skills');
        const loadingIndicator = createLoadingIndicator();
        
        // Hide skills initially
        technicalSkills.style.opacity = '0';
        technicalSkills.style.transform = 'translateY(20px)';
        
        // Insert loading indicator
        technicalSkills.parentNode.insertBefore(loadingIndicator, technicalSkills);
        
        // Animate loading progress
        const loadingFill = loadingIndicator.querySelector('.loading-fill');
        const loadingPercentage = loadingIndicator.querySelector('.loading-percentage');
        
        const progressInterval = setInterval(() => {
            loadingProgress += Math.random() * 15 + 5;
            if (loadingProgress > 100) loadingProgress = 100;
            
            loadingFill.style.width = loadingProgress + '%';
            loadingPercentage.textContent = Math.round(loadingProgress) + '%';
            
            if (loadingProgress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    loadingIndicator.style.opacity = '0';
                    loadingIndicator.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        loadingIndicator.remove();
                        startSkillsAnimation();
                    }, 500);
                }, 500);
            }
        }, 100);
    }

    // Start animations
    function startSkillsAnimation() {
        const technicalSkills = document.querySelector('.technical-skills');
        
        // Show skills with fade-in effect
        technicalSkills.style.transition = 'all 0.8s ease-out';
        technicalSkills.style.opacity = '1';
        technicalSkills.style.transform = 'translateY(0)';
        
        // Animate skill subjects first and add staggered bounce delays
        skillSubjects.forEach((subject, index) => {
            setTimeout(() => {
                subject.style.animation = 'showText 0.5s ease-out forwards';
                // Add staggered bounce animation delay
                const skillCard = subject.closest('.skill');
                skillCard.style.animationDelay = `${index * 0.2}s`;
            }, index * 100 + 200);
        });

        // Animate progress bars
        skillProgressBars.forEach((progressBar, index) => {
            setTimeout(() => {
                progressBar.classList.add('animate');
            }, index * 150 + 300);
        });

        // Animate progress spans
        skillProgressSpans.forEach((span, index) => {
            setTimeout(() => {
                // Set the target width based on the skill percentage
                const skillElement = span.closest('.skill');
                const percentageElement = skillElement.querySelector('.skill-percentage');
                const targetWidth = percentageElement.textContent;
                span.style.setProperty('--target-width', targetWidth);
                span.classList.add('animate');
            }, index * 150 + 800);
        });

        // Animate percentage displays with counting effect
        const skillPercentages = document.querySelectorAll('.skill-percentage');
        skillPercentages.forEach((percentage, index) => {
            setTimeout(() => {
                percentage.classList.add('animate');
                animatePercentageCounter(percentage);
            }, index * 150 + 800);
        });
    }
    
    // Animate percentage counter from 0 to target value
    function animatePercentageCounter(element) {
        const targetValue = parseInt(element.textContent);
        let currentValue = 0;
        const increment = targetValue / 60; // 60 frames for smooth animation
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 60;
        
        element.textContent = '0%';
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counter);
            }
            element.textContent = Math.round(currentValue) + '%';
        }, stepTime);
    }

    // Add hover effects for better interactivity
    document.querySelectorAll('.skill').forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            const progressSpan = this.querySelector('.skill-progress span');
            
            // Add a subtle pulse effect
            progressSpan.style.animation = 'pulse 0.6s ease-in-out';
            
            setTimeout(() => {
                progressSpan.style.animation = '';
            }, 600);
        });
    });

    // Add pulse animation keyframe dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(1.02) scaleY(1.1); }
        }
    `;
    document.head.appendChild(style);

    // Observe the skills section
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Add a reset function for development/testing
    window.resetSkillsAnimation = function() {

        animationTriggered = false;
        loadingProgress = 0;
        // Remove any existing loading indicators
        const existingLoading = document.querySelector('.skills-loading-container');
        if (existingLoading) {
            existingLoading.remove();
        }
        skillProgressBars.forEach(bar => bar.classList.remove('animate'));
        skillProgressSpans.forEach(span => span.classList.remove('animate'));
        skillSubjects.forEach(subject => subject.style.animation = '');
        const skillPercentages = document.querySelectorAll('.skill-percentage');
        skillPercentages.forEach(percentage => {
            percentage.classList.remove('animate');
            // Reset to original percentage values
            const skillElement = percentage.closest('.skill');
            const progressBar = skillElement.querySelector('.skill-progress');
            if (progressBar.classList.contains('html5')) percentage.textContent = '95%';
            else if (progressBar.classList.contains('css3')) percentage.textContent = '90%';
            else if (progressBar.classList.contains('js')) percentage.textContent = '100%';
            else if (progressBar.classList.contains('jquery')) percentage.textContent = '100%';
            else if (progressBar.classList.contains('ajax')) percentage.textContent = '75%';
            else if (progressBar.classList.contains('php')) percentage.textContent = '88%';
            else if (progressBar.classList.contains('mysql')) percentage.textContent = '85%';
            else if (progressBar.classList.contains('mongodb')) percentage.textContent = '78%';
            else if (progressBar.classList.contains('laravel')) percentage.textContent = '82%';
            else if (progressBar.classList.contains('wordpress')) percentage.textContent = '92%';
            else if (progressBar.classList.contains('woocomerce')) percentage.textContent = '87%';
            else if (progressBar.classList.contains('git')) percentage.textContent = '90%';
            else if (progressBar.classList.contains('github')) percentage.textContent = '88%';
            else if (progressBar.classList.contains('react')) percentage.textContent = '75%';
            else if (progressBar.classList.contains('python')) percentage.textContent = '70%';
            else if (progressBar.classList.contains('java')) percentage.textContent = '72%';
            else if (progressBar.classList.contains('R')) percentage.textContent = '65%';
            else if (progressBar.classList.contains('jupyter')) percentage.textContent = '68%';
            else if (progressBar.classList.contains('perfex')) percentage.textContent = '100%';
            else if (progressBar.classList.contains('codeigniter')) percentage.textContent = '100%';
        });
        const technicalSkills = document.querySelector('.technical-skills');
        if (technicalSkills) {
            technicalSkills.style.opacity = '1';
            technicalSkills.style.transform = 'translateY(0)';
            technicalSkills.style.transition = '';
        }
        // Re-observe the skills section
        if (skillsSection) {
            skillsObserver.observe(skillsSection);
        }

    };
});