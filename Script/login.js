document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (loginForm.checkValidity()) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const adminMode = document.getElementById('adminMode').checked;

            if (adminMode && email === 'admin@gmail.com' && password === 'admin1234') {
                const adminUser = { email, role: 'admin', username: 'Admin' };
                localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
                showAlert('Inicio de sesión como administrador exitoso.', 'success');
                setTimeout(() => {
                    window.location.href = 'catalogo.html';
                }, 1500);
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                showAlert('Inicio de sesión exitoso.', 'success');
                setTimeout(() => {
                    window.location.href = 'catalogo.html';
                }, 1500);
            } else {
                showAlert('Correo electrónico o contraseña incorrectos.', 'danger');
            }
        } else {
            loginForm.classList.add('was-validated');
        }
    });

    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alert);
        setTimeout(() => {
            alert.classList.remove('show');
            alert.classList.add('hide');
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }
});
