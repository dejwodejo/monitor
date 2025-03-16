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
        displayError("Please enter both email and password");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayError("Please enter a valid email address");
        return;
    }

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

            if (now - lastAttempt < 4) { // 1 minute cooldown
                throw new Error("Too many login attempts. Please try again later.");
            } else {
                // Reset counter after cooldown
                sessionStorage.setItem('loginAttempts', '1');
            }
        }

        sessionStorage.setItem('lastLoginAttempt', Date.now().toString());

        const response = await fetch("/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'username': email,
                'password': password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and token expiration time
            localStorage.setItem('access_token', data.access_token);

            // Calculate and store token expiration (assuming 30 minutes from now)
            const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes in milliseconds
            localStorage.setItem('token_expires_at', expiresAt.toString());

            // Store user email for later use
            localStorage.setItem('user_email', email);

            // Redirect to projects page
            window.location.href = 'projects.html';
        } else {
            throw new Error(data.detail || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        // Hide loading spinner and show login button again
        loadingIndicator.style.display = "none";
        loginButton.style.display = "inline";
        displayError(error.message);
    }
});

// Helper function to display error messages
function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

// Add security attributes to the form inputs
document.getElementById('email').setAttribute('autocomplete', 'username');
document.getElementById('password').setAttribute('autocomplete', 'current-password');

// Form input styling
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.querySelector('label').classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.querySelector('label').classList.remove('focused');
        }
    });

    // Initialize label position based on whether the input has a value
    if (input.value) {
        input.parentElement.querySelector('label').classList.add('focused');
    }
});

// On login page load - check for redirect reasons
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');

    if (reason) {
        const errorMessage = document.getElementById('error-message');

        switch (reason) {
            case 'auth_required':
                errorMessage.textContent = "Please log in to access that page";
                break;
            case 'session_expired':
                errorMessage.textContent = "Your session has expired. Please log in again";
                break;
            case 'logout':
                errorMessage.textContent = "You have been logged out successfully";
                errorMessage.style.color = "green";
                break;
        }

        errorMessage.style.display = "block";
    }

    // If user already has a valid token, redirect to projects
    const token = localStorage.getItem('access_token');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');

    if (token && tokenExpiresAt && Date.now() < parseInt(tokenExpiresAt)) {
        window.location.href = 'projects.html';
    }
});

/**
 * Basic input checks of login data.
 * @param {string} email
 * @param {string} password
 * @returns {boolean} True if both of inputs pass basic client side validation
 */
function loginInputsValidation(email, password) {

}