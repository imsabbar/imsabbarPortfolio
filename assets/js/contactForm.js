/**
 * Contact Form Handler with Client-side Validation and AJAX Submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactBtn = document.getElementById('contactbtn');
    const popup = document.getElementById('popup');
    
    if (!contactForm) return;

    // Form validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,100}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s+()-]{10,20}$/,
        subject: /^.{3,200}$/,
        message: /^.{10,2000}$/
    };

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Remove error state on input
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                removeErrorMessage(this);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showMessage('Please correct the errors in the form.', 'error');
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Prepare form data
        const formData = new FormData(contactForm);

        // Send AJAX request
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to send message');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Show success message
                showMessage('Your message has been sent successfully! I\'ll get back to you soon.', 'success');
                // Show success popup
                showSuccessPopup();
                // Reset form
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(error.message || 'An error occurred. Please try again later.', 'error');
        })
        .finally(() => {
            // Remove loading state
            setLoadingState(false);
        });
    });

    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Validate specific fields
        else if (value) {
            switch(fieldName) {
                case 'customerName':
                    if (!patterns.name.test(value)) {
                        isValid = false;
                        errorMessage = 'Name must be 2-100 characters (letters and spaces only)';
                    }
                    break;
                
                case 'customerEmail':
                    if (!patterns.email.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                
                case 'customerPhone':
                    if (!patterns.phone.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                    break;
                
                case 'customerSubject':
                    if (!patterns.subject.test(value)) {
                        isValid = false;
                        errorMessage = 'Subject must be 3-200 characters';
                    }
                    break;
                
                case 'customerMessage':
                    if (!patterns.message.test(value)) {
                        isValid = false;
                        errorMessage = 'Message must be 10-2000 characters';
                    }
                    break;
            }
        }

        // Show/hide error
        if (!isValid) {
            field.classList.add('error');
            showErrorMessage(field, errorMessage);
        } else {
            field.classList.remove('error');
            removeErrorMessage(field);
        }

        return isValid;
    }

    /**
     * Show error message below field
     */
    function showErrorMessage(field, message) {
        removeErrorMessage(field); // Remove existing error first
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentElement.appendChild(errorDiv);
    }

    /**
     * Remove error message
     */
    function removeErrorMessage(field) {
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    /**
     * Set loading state for form submission
     */
    function setLoadingState(isLoading) {
        const btnText = contactBtn.querySelector('.btn-text');
        const btnLoader = contactBtn.querySelector('.btn-loader');
        
        if (isLoading) {
            contactBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            contactForm.style.opacity = '0.6';
            contactForm.style.pointerEvents = 'none';
        } else {
            contactBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            contactForm.style.opacity = '1';
            contactForm.style.pointerEvents = 'auto';
        }
    }

    /**
     * Show general message
     */
    function showMessage(message, type = 'info') {
        const statusContainer = document.getElementById('formStatusMessages');
        if (!statusContainer) return;

        // Remove any existing messages
        statusContainer.innerHTML = '';

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        
        // Add icon based on type
        const icon = type === 'success' 
            ? '<i class="fa-solid fa-circle-check"></i>' 
            : '<i class="fa-solid fa-circle-exclamation"></i>';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${icon}
                <span>${message}</span>
            </div>
        `;

        statusContainer.appendChild(messageDiv);

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove after 8 seconds for success, 10 seconds for errors
        const timeout = type === 'success' ? 8000 : 10000;
        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, timeout);
    }

    /**
     * Show success popup
     */
    function showSuccessPopup() {
        if (popup) {
            popup.classList.add('open-popup');
        }
    }

    /**
     * Close popup function (called from OK button)
     */
    window.closePopup = function() {
        if (popup) {
            popup.classList.remove('open-popup');
        }
    };
});

// Add CSS animations and styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .inputBox input.error,
    .inputBox textarea.error {
        border-color: #e74c3c !important;
        background-color: #fee !important;
    }
    
    #contactbtn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .form-status-container {
        margin-bottom: 20px;
    }
    
    .form-message {
        padding: 16px 20px;
        border-radius: 12px;
        font-size: 0.95rem;
        animation: slideDown 0.3s ease;
        margin-bottom: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .form-message-success {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        border: 1px solid #28a745;
        color: #155724;
    }
    
    .form-message-error {
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
        border: 1px solid #dc3545;
        color: #721c24;
    }
    
    .form-message .message-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .form-message i {
        font-size: 1.3rem;
        flex-shrink: 0;
    }
    
    .form-message-success i {
        color: #28a745;
    }
    
    .form-message-error i {
        color: #dc3545;
    }
    
    .btn-loader {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    #contactForm {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
