// ===================== SHOW ALL / SHOW LESS =====================
const showBtn = document.getElementById("showAllBtn");
if (showBtn) {
const hiddenCards = document.querySelectorAll(".hidden");
let expanded = false;

showBtn.addEventListener("click", () => {
hiddenCards.forEach(card => {
card.style.display = expanded ? "none" : "block";
});
showBtn.textContent = expanded ? "Show All" : "Show Less";
expanded = !expanded;
});
}

// ===================== CART FUNCTIONALITY =====================
document.addEventListener("DOMContentLoaded", () => {
const addCartButtons = document.querySelectorAll(".add-cart-btn");
const cartCount = document.getElementById("cart-count");
const cartContainer = document.querySelector(".cart-section");

// Load saved cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count display
const updateCartCount = () => {
const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
if (cartCount) cartCount.textContent = totalItems;
};
updateCartCount();

// ===================== FIXED ADD TO CART =====================
addCartButtons.forEach(button => {
button.addEventListener("click", () => {

// READ DATA FROM BUTTON (Correct)
const id = button.dataset.id;
const name = button.dataset.name;
const price = parseInt(button.dataset.price);
const image = button.dataset.image ? button.dataset.image : "";

const existing = cart.find(item => item.id === id);

if (existing) {
existing.quantity += 1;
button.textContent = `Added! (${existing.quantity})`;
} else {
cart.push({
id,
name,
price,
image,
quantity: 1
});
button.textContent = "Added!";
}

localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();

setTimeout(() => {
button.textContent = "Add to Cart";
}, 1000);
});
});

// ===================== RENDER CART PAGE =====================

const renderCart = () => {
if (!cartContainer) return;

if (cart.length === 0) {
cartContainer.innerHTML = `<p style="color:#ccc; text-align:center;">Your cart is empty.</p>`;
return;
}

let total = 0;
let html = `<h3>Items in your cart</h3>`;

cart.forEach((item, index) => {
const itemTotal = item.price * item.quantity;
total += itemTotal;

html += `

<div class="cart-item" data-index="${index}">
<img src="${item.image}" alt="{item.name}" />

<div class="cart-details">

<p class="item-name">${item.name}</p>

<p class="item-price">&#8358;${itemTotal.toLocaleString()}</p>



<div class="cart-controls"> 

<div style="display:flex; align-items:center; gap:8px; margin-top:8px;">

      <button class="qty-decrease" style="

        background:#000;

        color:gold;

        border:1px solid gold;

        width:28px;

        height:28px;

        border-radius:50%;

        font-weight:bold;

        cursor:pointer;

      ">−</button>



      <span style="color:white; font-weight:bold;">

        ${item.quantity}

      </span>



      <button class="qty-increase" style="

        background:#000;

        color:gold;

        border:1px solid gold;

        width:28px;

        height:28px;

        border-radius:50%;

        font-weight:bold;

        cursor:pointer;

      ">+</button>



      <button class="remove-item" style="

        background:transparent;

        color:#ff4d4d;

        border:1px solid #ff4d4d;

        padding:4px;
        border-radius:5px;

        font-size:12px;

        cursor:pointer;

      ">

        Remove

      </button>

    </div>

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

// ===================== CART ITEM CONTROLS =====================
if (cartContainer) {
cartContainer.addEventListener("click", e => {
const itemDiv = e.target.closest(".cart-item");
if (!itemDiv) return;

const index = parseInt(itemDiv.dataset.index);

// Increase quantity
if (e.target.classList.contains("qty-increase")) {
cart[index].quantity += 1;
localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();
renderCart();
}

// Decrease quantity
if (e.target.classList.contains("qty-decrease")) {
if (cart[index].quantity > 1) {
cart[index].quantity -= 1;
} else {
cart.splice(index, 1);
}
localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();
renderCart();
}

// Remove item
if (e.target.classList.contains("remove-item")) {
cart.splice(index, 1);
localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();
renderCart();
}

// ===================== CHECKOUT (PHP) =====================
if (e.target.id === "checkoutBtn") {
if (cart.length === 0) return;

const orderData = {
total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
items: cart
};

fetch("save_order.php", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(orderData)
})
.then(res => res.json())
.then(data => {
if (data.status === "success") {
cart = [];
localStorage.removeItem("cart");
updateCartCount();
alert("Order placed! ID: " + data.order_id);
window.location.href = "scrap.html";
} else {
alert("Checkout failed: " + data.message);
}
})
.catch(() => {
alert("Network error. Try again.");
});
}
});
}
});
