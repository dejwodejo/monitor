function checkAuth() {
    const token = localStorage.getItem('access_token');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');

    // If no token exists or token has expired, redirect to login
    if (!token || !tokenExpiresAt || Date.now() > parseInt(tokenExpiresAt)) {
        // Clear any existing authentication data
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expires_at');
        localStorage.removeItem('user_email');

        // Redirect to login page with a reason parameter
        window.location.href = 'login.html?reason=auth_required';
        return false;
    }

    return true;
}

// Add this to immediately check authentication when the script loads
if (!checkAuth()) {
    // This prevents the rest of the page from loading if not authenticated
    throw new Error("Authentication required");
}

// Periodically check if token is still valid (every minute)
setInterval(checkAuth, 60000);

// Utility function to make authenticated API requests
async function fetchWithAuth(url, options = {}) {
    // Get the authentication token
    const token = localStorage.getItem('access_token');

    // Check if authenticated before making the request
    if (!checkAuth()) {
        throw new Error("Authentication required");
    }

    // Set up the authorization header
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    // Make the authenticated request
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        // If unauthorized (token expired during request), redirect to login
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_expires_at');
            window.location.href = 'login.html?reason=session_expired';
            throw new Error("Session expired");
        }

        return response;
    } catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
}

// Function to safely log out the user
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_email');
    window.location.href = 'login.html?reason=logout';
}
