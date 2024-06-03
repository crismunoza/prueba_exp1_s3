document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const alertContainer = document.getElementById('alertContainer');

    function showAlert(message, type) {
        alertContainer.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                                        ${message}
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
    }

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (registerForm.checkValidity()) {
            const fullName = document.getElementById('fullName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const birthdate = document.getElementById('birthdate').value;
            const address = document.getElementById('address').value;

            if (password !== confirmPassword) {
                showAlert("Las contraseñas no coinciden.", "danger");
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                showAlert("Ya existe un usuario registrado con este correo electrónico.", "danger");
                return;
            }

            const newUser = {
                fullName,
                username,
                email,
                password,
                birthdate,
                address,
                purchaseHistory: []
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showAlert("Registro exitoso. Ahora puedes iniciar sesión.", "success");
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            registerForm.classList.add('was-validated');
        }
    });
});
