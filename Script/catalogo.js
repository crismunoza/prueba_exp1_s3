document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isAdmin = loggedInUser && loggedInUser.email === 'admin@gmail.com';

    // Función para actualizar el contador del carrito
    function updateCartCount() {
        const cart = loggedInUser ? loggedInUser.cart || [] : [];
        document.getElementById('cart-count').textContent = cart.length;
    }

    // Función para filtrar productos
    function filterProducts() {
        const checkedFilters = getCheckedFilters();
        const allProducts = document.querySelectorAll('.col-md-4.mb-4');

        allProducts.forEach(product => {
            const productFilters = getProductFilters(product);
            if (matchesFilters(checkedFilters, productFilters)) {
                product.classList.remove('hidden'); // Mostrar producto
            } else {
                product.classList.add('hidden'); // Ocultar producto
            }
        });
    }

    function getCheckedFilters() {
        const checkedFilters = {
            price: [],
            brand: [],
            type: []
        };
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const filterType = checkbox.parentElement.parentElement.previousElementSibling.textContent.trim().toLowerCase();
                const filterValue = checkbox.parentElement.textContent.trim();
                if (filterType === 'precio') {
                    checkedFilters.price.push(filterValue);
                } else if (filterType === 'marcas') {
                    checkedFilters.brand.push(filterValue);
                } else if (filterType === 'tipo') {
                    checkedFilters.type.push(filterValue);
                }
            }
        });
        return checkedFilters;
    }

    function getProductFilters(product) {
        const filters = {
            price: parseFloat(product.getAttribute('data-price')),
            brand: product.getAttribute('data-brand'),
            type: product.getAttribute('data-type')
        };
        return filters;
    }

    function matchesFilters(checkedFilters, productFilters) {
        for (const filterType in checkedFilters) {
            if (checkedFilters.hasOwnProperty(filterType)) {
                const filterValues = checkedFilters[filterType];
                if (filterValues.length > 0) {
                    if (filterType === 'price') {
                        if (!filterValues.some(value => checkPriceRange(productFilters.price, value))) {
                            return false;
                        }
                    } else if (!filterValues.includes(productFilters[filterType])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function checkPriceRange(price, range) {
        const [min, max] = range.replace('$', '').split(' - ').map(val => parseFloat(val.replace('.', '').replace(',', '.')));
        if (isNaN(min)) return price >= max; // Para rangos como "Sobre $100.000"
        if (isNaN(max)) return price <= min; // Para rangos como "Menos de $10.000"
        return price >= min && price <= max;
    }

    // Función para mostrar alertas
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
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
            setTimeout(() => {
                alert.remove();
            }, 200);
        }, 3000);
    }

    // Función para agregar productos al carrito
    function addToCart(event) {
        if (!loggedInUser) {
            showAlert("Por favor, inicia sesión para agregar productos al carrito.", "warning");
            return;
        }

        const productCard = event.target.closest('.col-md-4.mb-4');
        const product = {
            name: productCard.querySelector('.card-title').textContent,
            price: parseFloat(productCard.getAttribute('data-price')),
            brand: productCard.getAttribute('data-brand'),
            type: productCard.getAttribute('data-type')
        };

        loggedInUser.cart = loggedInUser.cart || [];
        loggedInUser.cart.push(product);
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.map(user => user.email === loggedInUser.email ? loggedInUser : user);
        localStorage.setItem('users', JSON.stringify(users));

        updateCartCount();
        showAlert("Producto agregado al carrito.", "success");
    }

    // Función para habilitar la edición de productos si el usuario es administrador
    function enableAdminEdit() {
        if (isAdmin) {
            const productNames = document.querySelectorAll('.product-name');
            const productPrices = document.querySelectorAll('.product-price');

            productNames.forEach((productName, index) => {
                const productCard = productName.closest('.col-md-4.mb-4');
                const productPrice = productCard.querySelector('.product-price');

                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.value = productName.textContent;
                nameInput.classList.add('form-control', 'mb-2', 'product-name-input');

                const priceInput = document.createElement('input');
                priceInput.type = 'number';
                priceInput.value = parseFloat(productPrice.textContent.replace('de $', '').replace('.', '').replace(',', '.'));
                priceInput.classList.add('form-control', 'mb-2', 'product-price-input');

                const updateButton = document.createElement('button');
                updateButton.textContent = 'Actualizar';
                updateButton.classList.add('btn', 'btn-success', 'btn-sm', 'update-product');

                productName.replaceWith(nameInput);
                productPrice.replaceWith(priceInput);
                productCard.querySelector('.card-body').appendChild(updateButton);

                updateButton.addEventListener('click', function () {
                    const newName = nameInput.value;
                    const newPrice = parseFloat(priceInput.value).toFixed(2);

                    productCard.setAttribute('data-name', newName);
                    productCard.setAttribute('data-price', newPrice);

                    const newNameSpan = document.createElement('h5');
                    newNameSpan.classList.add('card-title', 'product-name');
                    newNameSpan.textContent = newName;

                    const newPriceSpan = document.createElement('span');
                    newPriceSpan.classList.add('text-danger', 'product-price');
                    newPriceSpan.textContent = `de $${newPrice}`;

                    nameInput.replaceWith(newNameSpan);
                    priceInput.replaceWith(newPriceSpan);
                    updateButton.remove();
                });
            });
        }
    }

    // Inicializar el catálogo
    enableAdminEdit();
    updateCartCount();
});
