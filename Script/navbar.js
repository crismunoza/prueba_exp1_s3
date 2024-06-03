document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginLink = document.getElementById('login-link');
    const userMenu = document.getElementById('user-menu');
    const usernameDisplay = document.getElementById('username-display');
    const logoutLink = document.getElementById('logout-link');

    if (loggedInUser) {
        loginLink.classList.add('d-none');
        userMenu.classList.remove('d-none');
        usernameDisplay.textContent = loggedInUser.username;
    } else {
        loginLink.classList.remove('d-none');
        userMenu.classList.add('d-none');
    }

    logoutLink.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });
});
