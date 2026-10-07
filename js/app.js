const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const orderTotal = document.getElementById("order-total");
const continueButton = document.querySelector(".continue-button");
const cartFeedback = document.getElementById("cart-feedback");
const cart = [];
const itemCount = document.getElementById("item-count");
const reviewDialog = document.getElementById("review-dialog");
// Decorative SVGs share one stroke style and never replace product labels.
const productIcons = {
    1: 'M8 12h15v12a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6Z M23 14h3a4 4 0 0 1 0 8h-3 M11 6v3 M16 4v5 M21 6v3 M6 33h23',
    2: 'M5 23 17 9a3 3 0 0 1 4 0l12 14Z M5 23v6h28v-6 M6 26h26 M13 20h1 M20 17h1 M24 21h1',
    3: 'M10 12h18l-3 21H13Z M8 12h22 M20 12l3-8h6 M14 18h10',
    4: 'M30 14a7 7 0 0 1-8-8 14 14 0 1 0 8 8Z M12 15h1 M17 24h1 M11 25h1 M23 29h1 M24 19h1',
    5: 'M15 4h10v6l3 5v17H12V15l3-5Z M15 8h10 M12 19h16 M12 27h16 M17 22h6',
    6: 'M9 5h22v30H9Z M9 15h22 M9 25h22 M20 5v30'
};

function createProductIcon(productId) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 40 40");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", productIcons[productId] || "M10 10h20v20H10Z");
    svg.appendChild(path);
    return svg;
}

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

        const visual = document.createElement("span");
        visual.className = "product-visual product-visual-" + product.id;
        visual.appendChild(createProductIcon(product.id));
        const badge = document.createElement("span");
        badge.className = "product-badge";
        badge.hidden = true;
        badge.setAttribute("aria-hidden", "true");
        const add = document.createElement("span");
        add.className = "product-add";
        add.textContent = "+";
        add.setAttribute("aria-hidden", "true");
        card.append(visual, badge, name, price, add);
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
    const count = cart.reduce(function (total, item) { return total + item.quantity; }, 0);
    itemCount.textContent = count + (count === 1 ? " item" : " items");
    productGrid.querySelectorAll(".product-card").forEach(function (card) {
        const item = cart.find(function (entry) { return entry.id === Number(card.dataset.productId); });
        const badge = card.querySelector(".product-badge");
        badge.hidden = !item;
        badge.textContent = item ? item.quantity : "";
        card.classList.toggle("is-selected", Boolean(item));
        const product = products.find(function (entry) { return entry.id === Number(card.dataset.productId); });
        card.setAttribute("aria-label", "Add " + product.name + ", " + formatPrice(product.price) + (item ? ", " + item.quantity + " in order" : ""));
    });

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

function renderOrderSummary() {
    const list = document.getElementById("review-items");
    list.replaceChildren();
    cart.forEach(function (item) {
        const row = document.createElement("li");
        const name = document.createElement("h3");
        name.textContent = item.name;
        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + item.quantity;
        const unitPrice = document.createElement("p");
        unitPrice.textContent = "Unit price: " + formatPrice(item.price);
        const subtotal = document.createElement("p");
        subtotal.className = "review-subtotal";
        subtotal.textContent = "Subtotal: " + formatPrice(item.price * item.quantity);
        row.append(name, quantity, unitPrice, subtotal);
        list.appendChild(row);
    });
    document.getElementById("review-total").textContent = formatPrice(calculateTotal());
}

function showOrderSummary() {
    if (cart.length === 0) {
        returnToItemSelection();
        cartFeedback.textContent = "Choose a product before reviewing your order.";
        return;
    }
    renderOrderSummary();
    document.getElementById("review-items").hidden = false;
    document.getElementById("summary-actions").hidden = false;
    document.getElementById("payment-placeholder").hidden = true;
    if (!reviewDialog.open) reviewDialog.showModal();
    document.getElementById("review-heading").focus();
}

function returnToItemSelection() {
    // Navigation leaves the shared cart array and quantities untouched.
    reviewDialog.close();
}

continueButton.addEventListener("click", showOrderSummary);
document.getElementById("back-to-order").addEventListener("click", returnToItemSelection);
reviewDialog.addEventListener("close", function () {
    if (!continueButton.disabled) continueButton.focus();
});
document.getElementById("continue-to-payment").addEventListener("click", function () {
    document.getElementById("review-items").hidden = true;
    document.getElementById("summary-actions").hidden = true;
    document.getElementById("payment-placeholder").hidden = false;
    document.getElementById("payment-heading").focus();
});
document.getElementById("back-to-summary").addEventListener("click", showOrderSummary);

displayProducts();
renderCart();
