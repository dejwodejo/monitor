/**
 * Helper function for displaying login errors.
 * @param {string} message
 */
function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

/**
 * Basic input checks of login data.
 * @param {string} email
 * @param {string} password
 * @returns {boolean} True if both of inputs pass basic client side validation
 */
function loginInputsValidation(email, password) {
    if (!email || !password) {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }

    return true;
}

/**
 * Authenticate user with email and password.
 * @param {MouseEvent} event
 */
async function authenticateUser(event) {
    event.preventDefault();
    const loadingIndicator = document.getElementById('loading');
    const loginButton = document.getElementById('login-button');

    const { email, password } = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };

    const areInputsValid = loginInputsValidation(email, password);
    if (!areInputsValid) {
        displayError("Please enter a valid email address");
        return;
    }

    loginButton.style.display = "none";
    loadingIndicator.style.display = "flex";

    try {
        const response = await fetch("/api/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                'username': email,
                'password': password
            })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("access_token", data.access_token);

            const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes in milisec
            localStorage.setItem("token_expires_at", expiresAt.toString());

            localStorage.setItem("user_email", email);

            window.location.href = "projects.html";
        } else {
            throw new Error(data.detail || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        loadingIndicator.style.display = "none";
        loginButton.style.display = "inline";
        displayError(error.message)
    }
}

/**
 * Checks if user should be redirected to login page.
 */
function redirectUser() {
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

    // If user has valid token, log him
    const token = localStorage.getItem('access_token');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');

    if (token && tokenExpiresAt && Date.now() < parseInt(tokenExpiresAt)) {
        window.location.href = "projects.html";
    }
}

document.getElementById('login-button').addEventListener('click', authenticateUser);
document.addEventListener('DOMContentLoaded', redirectUser);

document.getElementById('email').setAttribute('autocomplete', 'username');
document.getElementById('password').setAttribute('autocomplete', 'current-password');
