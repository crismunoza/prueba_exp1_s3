document.addEventListener('DOMContentLoaded', function () {
    const paymentForm = document.getElementById('payment-form');
    const alertContainer = document.getElementById('alert-container');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!loggedInUser) {
            showAlert("Por favor, inicia sesión para proceder con el pago.", "danger");
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        // Simulación de pago
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        if (cardNumber && expiryDate && cvv) {
            const cart = loggedInUser.cart || [];
            const purchaseDate = new Date().toISOString();

            loggedInUser.purchaseHistory = loggedInUser.purchaseHistory || [];
            cart.forEach(item => {
                loggedInUser.purchaseHistory.push({
                    ...item,
                    date: purchaseDate
                });
            });

            // Vaciar el carrito
            loggedInUser.cart = [];
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.map(user => user.email === loggedInUser.email ? loggedInUser : user);
            localStorage.setItem('users', JSON.stringify(users));

            showAlert("Pago realizado con éxito. Gracias por tu compra.", "success");
            setTimeout(() => {
                window.location.href = 'historial.html';
            }, 1500);
        } else {
            showAlert("Por favor, completa todos los campos para proceder con el pago.", "danger");
        }
    });

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade custom-alert`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alert);
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        setTimeout(() => {
            alert.classList.remove('show');
            alert.classList.add('hide');
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }
});
