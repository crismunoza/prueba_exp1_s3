document.addEventListener('DOMContentLoaded', function () {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    let cart = [];

    if (loggedInUser) {
        cart = loggedInUser.cart || [];
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            itemElement.innerHTML = `
                <div>
                    <h5 class="mb-1">${item.name}</h5>
                    <p class="mb-1">$${item.price}</p>
                </div>
                <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
            `;
            cartItems.appendChild(itemElement);
            total += item.price;
        });

        cartTotal.textContent = total;
        cartCount.textContent = cart.length;

        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
                updateCart();
            });
        });
    }

    function saveCart() {
        if (loggedInUser) {
            loggedInUser.cart = cart;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.map(user => user.email === loggedInUser.email ? loggedInUser : user);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Handle proceed to payment button
    const proceedPaymentButton = document.querySelector('.btn-primary');
    proceedPaymentButton.addEventListener('click', function () {
        if (!loggedInUser) {
            alert('Por favor, inicia sesión para proceder con el pago.');
            window.location.href = 'login.html';
        } else {
            window.location.href = 'pago.html';
        }
    });

    // Event listener for history button
    const historyButton = document.getElementById('history-button');
    historyButton.addEventListener('click', function () {
        window.location.href = 'historial.html';
    });

    // Inicializa el carrito al cargar la página
    updateCart();
});
