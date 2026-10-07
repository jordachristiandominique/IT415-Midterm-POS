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
    if (payment.transactionReference || payment.processing) return;
    if (cart.length === 0) {
        returnToItemSelection();
        cartFeedback.textContent = "Choose a product before reviewing your order.";
        return;
    }
    renderOrderSummary();
    document.getElementById("review-items").hidden = false;
    document.getElementById("summary-actions").hidden = false;
    document.getElementById("payment-view").hidden = true;
    document.getElementById("payment-success").hidden = true;
    document.getElementById("receipt-view").hidden = true;
    document.getElementById("review-total").parentElement.hidden = false;
    setReviewHeading("Order Summary", "Step 2 \u00b7 Order review", "Check your items below before continuing to payment.");
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
    else productGrid.querySelector(".product-card").focus();
});
// The confirmed total comes from the same calculation used by Order Summary.
const payment = {
    total: 0,
    paymentMethod: "",
    amountPaid: 0,
    change: 0,
    transactionReference: "",
    processing: false,
    items: [],
    completedAt: null
};
let cardPaymentTimer = null;

function setReviewHeading(title, step, note) {
    document.getElementById("review-heading").textContent = title;
    reviewDialog.querySelector(".step-label").textContent = step;
    document.getElementById("review-note").textContent = note;
    // Each dialog screen starts with its step label and heading visible.
    reviewDialog.scrollTop = 0;
}

function showPaymentMethods() {
    if (payment.processing || payment.transactionReference) return;
    document.getElementById("review-items").hidden = true;
    document.getElementById("summary-actions").hidden = true;
    document.getElementById("payment-view").hidden = false;
    document.getElementById("payment-methods").hidden = false;
    ["cash-payment", "qr-payment", "card-payment", "back-to-methods"].forEach(function (id) {
        document.getElementById(id).hidden = true;
    });
    setReviewHeading("Payment Method", "Step 3 \u00b7 Payment", "Choose how you would like to pay. The amount due is shown below.");
    document.getElementById("review-total").textContent = formatPrice(payment.total);
    document.getElementById("review-heading").focus();
}

function showPaymentPanel(method, panelId) {
    showPaymentMethods();
    payment.paymentMethod = method;
    document.getElementById("payment-methods").hidden = true;
    document.getElementById(panelId).hidden = false;
    document.getElementById("back-to-methods").hidden = false;
    setReviewHeading(method + " Payment", "Step 3 \u00b7 Payment", "Amount due for your confirmed order.");
    document.getElementById("review-heading").focus();
}

function showCashPayment() {
    showPaymentPanel("Cash", "cash-payment");
    document.getElementById("amount-paid").value = "";
    document.getElementById("amount-paid").removeAttribute("aria-invalid");
    document.getElementById("cash-error").textContent = "";
    document.getElementById("cash-change").textContent = "";
    document.getElementById("amount-paid").focus();
}

function validateCash() {
    const input = document.getElementById("amount-paid");
    const value = input.value.trim();
    const amount = Number(value);
    let error = "";
    if (!value) error = "Please enter the amount paid.";
    else if (!/^\d+(\.\d{1,2})?$/.test(value) || !Number.isFinite(amount) || !Number.isSafeInteger(Math.round(amount * 100))) {
        error = "Enter a valid non-negative amount with up to two decimal places.";
    } else if (Math.round(amount * 100) < Math.round(payment.total * 100)) {
        error = "Insufficient payment. Please enter at least " + formatPrice(payment.total) + ".";
    }
    input.setAttribute("aria-invalid", String(Boolean(error)));
    document.getElementById("cash-error").textContent = error;
    document.getElementById("cash-change").textContent = error ? "" : "Change: " + formatPrice((Math.round(amount * 100) - Math.round(payment.total * 100)) / 100);
    return error ? null : Math.round(amount * 100) / 100;
}

function processCashPayment(event) {
    event.preventDefault();
    const amount = validateCash();
    if (amount === null) {
        document.getElementById("amount-paid").focus();
        return;
    }
    completePayment(amount);
}

function showQRPayment() {
    showPaymentPanel("QR Payment", "qr-payment");
    setReviewHeading("QR Payment", "Step 3 \u00b7 Payment", "Amount to pay for your confirmed order.");
}

function showCardPayment() {
    showPaymentPanel("Credit/Debit Card", "card-payment");
    document.getElementById("card-status").textContent = "";
}

function processCardPayment() {
    if (payment.processing || payment.transactionReference) return;
    payment.processing = true;
    document.getElementById("process-card").disabled = true;
    document.getElementById("back-to-methods").disabled = true;
    document.getElementById("card-payment").setAttribute("aria-busy", "true");
    document.getElementById("card-status").textContent = "Processing payment...";
    cardPaymentTimer = window.setTimeout(function () {
        cardPaymentTimer = null;
        payment.processing = false;
        document.getElementById("card-payment").removeAttribute("aria-busy");
        document.getElementById("process-card").disabled = false;
        document.getElementById("back-to-methods").disabled = false;
        completePayment(payment.total);
    }, 1200);
}

function generateTransactionReference() {
    return "TXN-" + Date.now() + "-" + crypto.randomUUID();
}

function completePayment(amount) {
    // Ignore repeated taps once this order has been paid.
    if (payment.transactionReference) return;
    payment.amountPaid = amount;
    payment.change = (Math.round(amount * 100) - Math.round(payment.total * 100)) / 100;
    payment.transactionReference = generateTransactionReference();
    // Keep the paid items and timestamp with the existing payment data.
    payment.items = cart.map(function (item) { return { ...item }; });
    payment.completedAt = new Date();
    showPaymentSuccess();
}

function renderReceipt() {
    const list = document.getElementById("receipt-items");
    list.replaceChildren();
    payment.items.forEach(function (item) {
        const row = document.createElement("li");
        const name = document.createElement("h3");
        name.textContent = item.name;
        const detail = document.createElement("p");
        detail.textContent = item.quantity + " \u00d7 " + formatPrice(item.price) + " each";
        const subtotal = document.createElement("p");
        subtotal.className = "review-subtotal";
        subtotal.textContent = "Subtotal: " + formatPrice(item.price * item.quantity);
        row.append(name, detail, subtotal);
        list.appendChild(row);
    });
    document.getElementById("receipt-reference").textContent = payment.transactionReference;
    const date = document.getElementById("receipt-date");
    date.dateTime = payment.completedAt.toISOString();
    date.textContent = new Intl.DateTimeFormat("en-PH", {
        dateStyle: "long", timeStyle: "long"
    }).format(payment.completedAt);
    document.getElementById("receipt-total").textContent = formatPrice(payment.total);
    document.getElementById("receipt-method").textContent = payment.paymentMethod;
    document.getElementById("receipt-paid").textContent = formatPrice(payment.amountPaid);
    document.getElementById("receipt-change").textContent = formatPrice(payment.change);
    document.getElementById("receipt-status").textContent = "Payment Successful";
}

function showReceipt() {
    if (!payment.transactionReference) return;
    renderReceipt();
    document.getElementById("payment-success").hidden = true;
    document.getElementById("receipt-view").hidden = false;
    setReviewHeading("Digital Receipt", "Payment complete", "Your completed transaction. Start a new transaction when you are ready.");
    reviewDialog.scrollTop = 0;
    document.getElementById("review-heading").focus();
}

function resetTransaction() {
    window.clearTimeout(cardPaymentTimer);
    cardPaymentTimer = null;
    cart.length = 0;
    Object.assign(payment, {
        total: 0, paymentMethod: "", amountPaid: 0, change: 0,
        transactionReference: "", processing: false, items: [], completedAt: null
    });
    document.getElementById("cash-payment").reset();
    document.getElementById("amount-paid").removeAttribute("aria-invalid");
    document.getElementById("card-payment").removeAttribute("aria-busy");
    document.getElementById("process-card").disabled = false;
    document.getElementById("back-to-methods").disabled = false;
    ["cash-error", "cash-change", "card-status", "success-total", "success-paid",
        "success-change", "success-method", "success-reference", "receipt-reference",
        "receipt-date", "receipt-total", "receipt-method", "receipt-paid", "receipt-change",
        "receipt-status", "review-total"].forEach(function (id) {
        document.getElementById(id).textContent = "";
    });
    document.getElementById("receipt-date").removeAttribute("datetime");
    document.getElementById("review-items").replaceChildren();
    document.getElementById("receipt-items").replaceChildren();
    ["payment-view", "payment-success", "receipt-view", "cash-payment", "qr-payment",
        "card-payment", "back-to-methods"].forEach(function (id) {
        document.getElementById(id).hidden = true;
    });
    document.getElementById("payment-methods").hidden = false;
    document.getElementById("summary-actions").hidden = false;
    document.getElementById("review-items").hidden = false;
    document.getElementById("review-total").parentElement.hidden = false;
    setReviewHeading("Order Summary", "Step 2 \u00b7 Order review", "Check your items below before continuing to payment.");
    renderCart();
    cartFeedback.textContent = "New transaction ready. Tap a product to add it to your order.";
    returnToItemSelection();
    document.getElementById("main-content").scrollIntoView({ block: "start" });
    productGrid.querySelector(".product-card").focus();
}

function showPaymentSuccess() {
    document.getElementById("payment-view").hidden = true;
    document.getElementById("payment-success").hidden = false;
    document.getElementById("review-total").parentElement.hidden = true;
    setReviewHeading("Payment Successful", "Payment complete", "Thank you. Your confirmed order has been preserved.");
    document.getElementById("success-total").textContent = formatPrice(payment.total);
    document.getElementById("success-paid").textContent = formatPrice(payment.amountPaid);
    document.getElementById("success-change").textContent = formatPrice(payment.change);
    document.getElementById("success-method").textContent = payment.paymentMethod;
    document.getElementById("success-reference").textContent = payment.transactionReference;
    document.getElementById("review-heading").focus();
}

reviewDialog.addEventListener("cancel", function (event) {
    if (payment.processing || payment.transactionReference) {
        event.preventDefault();
    } else if (!document.getElementById("payment-view").hidden) {
        event.preventDefault();
        if (document.getElementById("payment-methods").hidden) showPaymentMethods();
        else showOrderSummary();
    }
});
document.getElementById("continue-to-payment").addEventListener("click", function () {
    payment.total = calculateTotal();
    showPaymentMethods();
});
document.getElementById("back-to-summary").addEventListener("click", showOrderSummary);
document.getElementById("back-to-methods").addEventListener("click", showPaymentMethods);
document.getElementById("select-cash").addEventListener("click", showCashPayment);
document.getElementById("select-qr").addEventListener("click", showQRPayment);
document.getElementById("select-card").addEventListener("click", showCardPayment);
document.getElementById("cash-payment").addEventListener("submit", processCashPayment);
// Validate on submit so feedback cannot move Pay Now during a pointer tap.
document.getElementById("amount-paid").addEventListener("input", function () {
    document.getElementById("cash-error").textContent = "";
    document.getElementById("cash-change").textContent = "";
    document.getElementById("amount-paid").removeAttribute("aria-invalid");
});
document.getElementById("confirm-qr").addEventListener("click", function () { completePayment(payment.total); });
document.getElementById("process-card").addEventListener("click", processCardPayment);
document.getElementById("view-receipt").addEventListener("click", showReceipt);
document.getElementById("new-transaction").addEventListener("click", resetTransaction);

displayProducts();
renderCart();
