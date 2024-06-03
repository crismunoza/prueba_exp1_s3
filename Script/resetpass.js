document.addEventListener('DOMContentLoaded', function () {
    const resetForm = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const emailSection = document.getElementById('email-section');
    const passwordSection = document.getElementById('password-section');
    const confirmPasswordSection = document.getElementById('confirm-password-section');
    const submitButton = document.getElementById('submit-button');
    const alertContainer = document.getElementById('alert-container');

    let currentUser = null;

    resetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!emailSection.classList.contains('d-none')) {
            // Check email
            const email = emailInput.value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            currentUser = users.find(user => user.email === email);

            if (currentUser) {
                emailSection.classList.add('d-none');
                passwordSection.classList.remove('d-none');
                confirmPasswordSection.classList.remove('d-none');
                submitButton.textContent = 'Cambiar Contraseña';
            } else {
                showAlert('El correo electrónico no está registrado.', 'danger');
            }
        } else {
            // Change password
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (newPassword !== confirmPassword) {
                showAlert('Las contraseñas no coinciden.', 'danger');
                return;
            }

            // Update password
            if (currentUser) {
                currentUser.password = newPassword;
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const updatedUsers = users.map(user => user.email === currentUser.email ? currentUser : user);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                showAlert('Contraseña actualizada con éxito.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        }
    });

    function showAlert(message, type) {
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
