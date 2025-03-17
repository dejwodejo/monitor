function checkAuth() {
    const token = localStorage.getItem('access_token');
    const tokenExpiresAt = localStorage.getItem('token_expires_at');

    if (!token || !tokenExpiresAt || Date.now() > parseInt(tokenExpiresAt)) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expires_at');
        localStorage.removeItem('user_email');

        // Redirect to login page with a reason parameter
        window.location.href = 'login.html?reason=auth_required';
        return false;
    }

    return true;
}

const isUserAuthorized = checkAuth()
if (isUserAuthorized) {
    throw new Error("Authentication required");
}

setInterval(checkAuth, 60000);
