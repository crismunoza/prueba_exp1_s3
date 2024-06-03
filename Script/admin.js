document.addEventListener('DOMContentLoaded', function () {
    const userTableBody = document.getElementById('user-table-body');
    const editUserForm = document.getElementById('editUserForm');
    const alertContainer = document.getElementById('alert-container');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let selectedUserIndex;

    function renderUserTable() {
        userTableBody.innerHTML = '';
        users.forEach((user, index) => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.birthdate}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-user" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editUserModal">Editar</button>
                    <button class="btn btn-danger btn-sm delete-user" data-index="${index}">Eliminar</button>
                </td>
            `;
            userTableBody.appendChild(userRow);
        });

        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function () {
                selectedUserIndex = this.getAttribute('data-index');
                const user = users[selectedUserIndex];
                document.getElementById('editFullName').value = user.fullName;
                document.getElementById('editUsername').value = user.username;
                document.getElementById('editEmail').value = user.email;
                document.getElementById('editBirthdate').value = user.birthdate;
                document.getElementById('editPassword').value = '';
            });
        });

        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                users.splice(index, 1);
                localStorage.setItem('users', JSON.stringify(users));
                showAlert("Usuario eliminado correctamente.", "danger");
                renderUserTable();
            });
        });
    }

    editUserForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (editUserForm.checkValidity()) {
            const fullName = document.getElementById('editFullName').value;
            const username = document.getElementById('editUsername').value;
            const email = document.getElementById('editEmail').value;
            const birthdate = document.getElementById('editBirthdate').value;
            const password = document.getElementById('editPassword').value;

            users[selectedUserIndex] = { ...users[selectedUserIndex], fullName, username, email, birthdate };
            if (password) {
                users[selectedUserIndex].password = password;
            }

            localStorage.setItem('users', JSON.stringify(users));
            showAlert("Usuario actualizado correctamente.", "success");
            renderUserTable();
            document.querySelector('#editUserModal .btn-close').click();
        } else {
            editUserForm.classList.add('was-validated');
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

    renderUserTable();
});
