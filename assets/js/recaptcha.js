/**
 * reCAPTCHA v3 Integration for Contact Form
 * Get your keys from: https://www.google.com/recaptcha/admin
 */

// Load reCAPTCHA script dynamically
(function() {
    // Get reCAPTCHA site key from meta tag or environment
    const recaptchaSiteKey = document.querySelector('meta[name="recaptcha-site-key"]')?.content || '';
    
    if (!recaptchaSiteKey) {
        console.warn('reCAPTCHA site key not found. Please add it to your .env file and meta tag.');
        return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Wait for form submission
    script.onload = function() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;

        // Intercept form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Execute reCAPTCHA
            grecaptcha.ready(function() {
                grecaptcha.execute(recaptchaSiteKey, {action: 'contact_form'})
                    .then(function(token) {
                        // Add token to hidden input
                        document.getElementById('recaptchaToken').value = token;
                        
                        // Now submit the form via AJAX (contactForm.js will handle this)
                        // Trigger the original form submission event
                        const event = new Event('submit', {
                            bubbles: true,
                            cancelable: true
                        });
                        
                        // Mark it as already processed to prevent loop
                        event.recaptchaProcessed = true;
                        
                        // Dispatch the event
                        if (!e.recaptchaProcessed) {
                            contactForm.dispatchEvent(event);
                        }
                    })
                    .catch(function(error) {
                        console.error('reCAPTCHA error:', error);
                        alert('Security verification failed. Please try again.');
                    });
            });
        });
    };

    script.onerror = function() {
        console.error('Failed to load reCAPTCHA script');
    };
})();
