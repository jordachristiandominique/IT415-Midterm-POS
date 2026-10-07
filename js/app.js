const productGrid = document.getElementById("product-grid");
// Decorative menu artwork stays local so the kiosk also works offline.
const productArtwork = [
    '<path d="M18 24h25v17a10 10 0 0 1-10 10h-5a10 10 0 0 1-10-10Z"/><path d="M43 27h4a7 7 0 0 1 0 14h-4M24 16v-5m9 5v-5M14 55h35"/>',
    '<path d="M12 46 32 15l20 31Z"/><path d="M12 46v7h40v-7M22 34h20M26 40h12"/>',
    '<path d="M21 19h22l-3 36H24Z"/><path d="M19 19h26M34 19l5-12h8M23 30h18"/>',
    '<circle cx="32" cy="33" r="21"/><path d="m24 23 1 1m13-2 1 1m-8 12 1 1m-11 8 1 1m20-7 1 1m-11 10 1 1"/>',
    '<path d="M27 9h10v9l6 9v27H21V27l6-9Z"/><path d="M27 15h10M21 32h22M21 44h22"/>',
    '<path d="M17 12h30v42H17Z"/><path d="M17 26h30M17 40h30M32 12v42"/>'
];

function displayProducts() {
    productGrid.replaceChildren();

    products.forEach(function (product) {
        const card = document.createElement("article");
        card.className = "product-card";
        // Keep the product ID available for cart handling in a later stage.
        card.dataset.productId = product.id;
        const artwork = document.createElement("span");
        artwork.className = "product-artwork";
        artwork.innerHTML = '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">' + productArtwork[product.id - 1] + '</svg>';

        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.name;

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = "₱" + product.price.toFixed(2);

        card.append(artwork, name, price);
        productGrid.appendChild(card);
    });
}

displayProducts();
