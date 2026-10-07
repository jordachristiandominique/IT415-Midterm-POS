const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const orderTotal = document.getElementById("order-total");
const continueButton = document.querySelector(".continue-button");
const cartFeedback = document.getElementById("cart-feedback");
const cart = [];

function formatPrice(amount) {
    return "₱" + amount.toFixed(2);
}

function displayProducts() {
    productGrid.replaceChildren();

    products.forEach(function (product) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "product-card";
        card.dataset.productId = product.id;
        card.addEventListener("click", function () {
            addToCart(product.id);
        });

        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.name;

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        card.append(name, price);
        productGrid.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(function (product) { return product.id === productId; });
    if (!product) return;

    const item = cart.find(function (item) { return item.id === productId; });
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    renderCart();
    cartFeedback.textContent = product.name + " added to your order.";
}

function increaseQuantity(productId) {
    const item = cart.find(function (item) { return item.id === productId; });
    if (!item) return;
    item.quantity += 1;
    renderCart();
    cartFeedback.textContent = item.name + " quantity increased to " + item.quantity + ".";
}

function decreaseQuantity(productId) {
    const item = cart.find(function (item) { return item.id === productId; });
    if (!item) return;
    // Minus at one removes the row, so zero or negative quantities never remain.
    if (item.quantity === 1) {
        removeFromCart(productId);
        return;
    }
    item.quantity -= 1;
    renderCart();
    cartFeedback.textContent = item.name + " quantity decreased to " + item.quantity + ".";
}

function removeFromCart(productId) {
    const index = cart.findIndex(function (item) { return item.id === productId; });
    if (index === -1) return;
    const name = cart[index].name;
    cart.splice(index, 1);
    renderCart();
    cartFeedback.textContent = name + " removed from your order.";
}

function calculateTotal() {
    return cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);
}

function createCartButton(label, action, item) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cart-button";
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.productId = item.id;
    const actionLabels = { increase: "Increase quantity of ", decrease: "Decrease quantity of ", remove: "Remove " };
    button.setAttribute("aria-label", actionLabels[action] + item.name);
    return button;
}

function renderCart() {
    // Restore keyboard focus after replacing cart rows.
    const focusedButton = cartItems.contains(document.activeElement) ? document.activeElement : null;
    cartItems.replaceChildren();

    cart.forEach(function (item) {
        const row = document.createElement("li");
        row.className = "cart-item";

        const name = document.createElement("h3");
        name.textContent = item.name;
        const unitPrice = document.createElement("p");
        unitPrice.className = "cart-unit-price";
        unitPrice.textContent = formatPrice(item.price) + " each";

        const controls = document.createElement("div");
        controls.className = "quantity-controls";
        const quantity = document.createElement("span");
        quantity.className = "cart-quantity";
        quantity.textContent = item.quantity;
        quantity.setAttribute("aria-label", "Quantity: " + item.quantity);
        controls.append(createCartButton("−", "decrease", item), quantity, createCartButton("+", "increase", item));

        const subtotal = document.createElement("p");
        subtotal.className = "cart-subtotal";
        subtotal.textContent = "Subtotal: " + formatPrice(item.price * item.quantity);
        const removeButton = createCartButton("Remove", "remove", item);
        removeButton.classList.add("remove-button");

        row.append(name, unitPrice, controls, subtotal, removeButton);
        cartItems.appendChild(row);
    });

    emptyCart.hidden = cart.length > 0;
    cartItems.hidden = cart.length === 0;
    orderTotal.textContent = formatPrice(calculateTotal());
    continueButton.disabled = cart.length === 0;

    if (focusedButton) {
        const id = focusedButton.dataset.productId;
        const action = focusedButton.dataset.action;
        const replacement = cartItems.querySelector('[data-product-id="' + id + '"][data-action="' + action + '"]');
        const productCard = productGrid.querySelector('[data-product-id="' + id + '"]');
        (replacement || productCard).focus();
    }
}

// One listener handles the buttons in every newly rendered cart row.
cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button || !cartItems.contains(button)) return;
    const productId = Number(button.dataset.productId);
    if (button.dataset.action === "increase") increaseQuantity(productId);
    if (button.dataset.action === "decrease") decreaseQuantity(productId);
    if (button.dataset.action === "remove") removeFromCart(productId);
});

displayProducts();
renderCart();
