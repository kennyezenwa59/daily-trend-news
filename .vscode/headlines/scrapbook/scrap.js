// ===================== SHOW ALL / SHOW LESS =====================
const showBtn = document.getElementById('showAllBtn');
if (showBtn) {
const hiddenCards = document.querySelectorAll('.hidden');
let expanded = false;

showBtn.addEventListener('click', () => {
hiddenCards.forEach(card => {
card.style.display = expanded ? 'none' : 'block';
});
showBtn.textContent = expanded ? 'Show All' : 'Show Less';
expanded = !expanded;
});
}

// ===================== CART FUNCTIONALITY =====================
document.addEventListener("DOMContentLoaded", () => {
const addCartButtons = document.querySelectorAll(".add-cart-btn");
const cartCount = document.getElementById("cart-count");
const cartContainer = document.querySelector(".cart-section");

// Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count
const updateCartCount = () => {
const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
if (cartCount) cartCount.textContent = totalItems;
};
updateCartCount();

// Add to cart
addCartButtons.forEach(button => {
button.addEventListener("click", () => {
const card = button.closest(".card");
const id = card.dataset.id;
const name = card.dataset.name;
const price = parseInt(card.dataset.price);
const img = card.dataset.img || "";

const existing = cart.find(item => item.id === id);
if (existing) {
existing.quantity += 1;
button.textContent = `Added! (${existing.quantity})`;
} else {
cart.push({ id, name, price, img, quantity: 1 });
button.textContent = "Added!";
}

localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();

setTimeout(() => { button.textContent = "Add to Cart"; }, 1000);
});
});

// Render cart page
const renderCart = () => {
if (!cartContainer) return;

if (cart.length === 0) {
cartContainer.innerHTML = `<p style="color:#ccc; text-align:center;">Your cart is empty.</p>`;
return;
}

let total = 0;
let html = `<h3>Items in your cart</h3>`;
cart.forEach(item => {
const itemTotal = item.price * item.quantity;
total += itemTotal;
html += `
<div class="cart-item">
<div class="cart-details">
<p class="item-name">${item.name} (x${item.quantity})</p>
<p class="item-price">₦${itemTotal.toLocaleString()}</p>
</div>
</div>
`;
});

html += `
<div class="cart-summary">
<h4>Total: ₦${total.toLocaleString()}</h4>
<button class="checkout-btn" id="checkoutBtn">Proceed to Checkout</button>
</div>
`;
cartContainer.innerHTML = html;
};

renderCart();

// Checkout
if (cartContainer) {
cartContainer.addEventListener("click", e => {
if (e.target && e.target.id === "checkoutBtn") {
if (cart.length === 0) return;

const orderId = `ORD-${Date.now()}`;
const orderData = { orderId, items: cart };

fetch("checkout.php", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(orderData)
})
.then(res => res.json())
.then(data => {
if (data.success) {
cart = [];
localStorage.removeItem("cart");
updateCartCount();
alert("Checkout successful ✅");
window.location.href = "scrap.html";
} else {
alert("Checkout failed: " + data.message);
}
})
.catch(err => {
console.error(err);
alert("Checkout failed. Please try again.");
});
}
});
}
});
