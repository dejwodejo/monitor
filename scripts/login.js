document.getElementById('login-button').addEventListener('click', async function (e) {
    e.preventDefault();

    // Get user inputs and trim whitespace
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const loadingIndicator = document.getElementById('loading');
    const loginButton = document.getElementById('login-button');

    // Basic empty field validation
    if (!email || !password) {
        errorMessage.textContent = "Please enter both email and password";
        errorMessage.style.display = "block";
        return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Please enter a valid email address";
        errorMessage.style.display = "block";
        return;
    }

    // Simple sanitization to prevent basic XSS
    const sanitizedEmail = email
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Hide login button and display loading spinner
    loginButton.style.display = "none";
    loadingIndicator.style.display = "flex";
    errorMessage.style.display = "none";

    try {
        // Track login attempts in session storage
        const loginAttempts = parseInt(sessionStorage.getItem('loginAttempts') || '0') + 1;
        sessionStorage.setItem('loginAttempts', loginAttempts.toString());

        // Simple rate limiting (3 attempts within short period)
        if (loginAttempts > 3) {
            const lastAttempt = parseInt(sessionStorage.getItem('lastLoginAttempt') || '0');
            const now = Date.now();

            if (now - lastAttempt < 60000) { // 1 minute cooldown
                throw new Error("Too many login attempts. Please try again later.");
            } else {
                // Reset counter after cooldown
                sessionStorage.setItem('loginAttempts', '1');
            }
        }

        sessionStorage.setItem('lastLoginAttempt', Date.now().toString());

        await new Promise(resolve => setTimeout(resolve, 10000));

        window.location.href = 'projects.html';

    } catch (error) {
        // Hide loading spinner and show login button again
        loadingIndicator.style.display = "none";
        loginButton.style.display = "inline"; // Show the login button again
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";
    }
});

// Add security attributes to the form inputs
document.getElementById('email').setAttribute('autocomplete', 'username');
document.getElementById('password').setAttribute('autocomplete', 'current-password');

document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.querySelector('label').classList.add('focused');
    });

    input.addEventListener('blur', () => {
        input.parentElement.querySelector('label').classList.remove('focused');
    });
});
