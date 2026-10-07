const productGrid = document.getElementById("product-grid");

function displayProducts() {
    productGrid.replaceChildren();

    products.forEach(function (product) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "product-card";
        // Keep the product ID available for cart handling in a later stage.
        card.dataset.productId = product.id;

        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.name;

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = "₱" + product.price.toFixed(2);

        card.append(name, price);
        productGrid.appendChild(card);
    });
}

displayProducts();
