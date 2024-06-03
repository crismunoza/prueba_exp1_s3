document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.getElementById('profileForm');
    const adminButton = document.getElementById('adminButton');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        document.getElementById('fullName').value = loggedInUser.fullName || '';
        document.getElementById('username').value = loggedInUser.username || '';
        document.getElementById('email').value = loggedInUser.email || '';
        document.getElementById('birthdate').value = loggedInUser.birthdate || '';
        document.getElementById('address').value = loggedInUser.address || '';

        if (loggedInUser.role === 'admin') {
            adminButton.classList.remove('d-none');
        }
    } else {
        showAlert("No has iniciado sesión. Por favor, inicia sesión primero.", "danger");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }

    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const newPassword = document.getElementById('newPassword').value;

        if (profileForm.checkValidity()) {
            const fullName = document.getElementById('fullName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const birthdate = document.getElementById('birthdate').value;
            const address = document.getElementById('address').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === loggedInUser.email);

            if (userIndex !== -1) {
                users[userIndex] = { 
                    ...users[userIndex], 
                    fullName, 
                    username, 
                    email, 
                    birthdate, 
                    address 
                };

                if (newPassword) {
                    users[userIndex].password = newPassword;
                }

                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('loggedInUser', JSON.stringify(users[userIndex]));

                showAlert("Perfil actualizado correctamente.", "success");
            } else {
                showAlert("Error al actualizar el perfil.", "danger");
            }
        } else {
            profileForm.classList.add('was-validated');
        }
    });

    adminButton.addEventListener('click', function () {
        window.location.href = 'admin.html';
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
            window.location.href = 'catalogo.html';
            setTimeout(() => alert.remove(), 500);
        }, 1500);
    }
});
