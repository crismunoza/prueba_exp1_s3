document.addEventListener('DOMContentLoaded', function () {
    const purchaseHistory = document.getElementById('purchase-history');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser && loggedInUser.purchaseHistory) {
        loggedInUser.purchaseHistory.forEach(purchase => {
            const purchaseElement = document.createElement('div');
            purchaseElement.classList.add('list-group-item');
            purchaseElement.innerHTML = `
                <h5 class="mb-1">${purchase.name}</h5>
                <p class="mb-1">$${purchase.price}</p>
                <small>Fecha: ${new Date(purchase.date).toLocaleDateString()}</small>
            `;
            purchaseHistory.appendChild(purchaseElement);
        });
    } else {
        purchaseHistory.innerHTML = '<p class="text-center">No hay historial de compras.</p>';
    }
});
