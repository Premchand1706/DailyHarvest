document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.product-card button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('p').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            addToCart(product);
            alert(`${product.name} added to cart!`);
        });
    });

    // Load cart items on cart page
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
        setupCartEventListeners();
    }

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (email && password) {
                alert('Login successful! Welcome back to DailyHarvest.');
            } else {
                alert('Please fill in all fields');
            }
        });
    }
    
    // Signup Form Handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const termsAgreed = document.getElementById('termsAgree').checked;
            
            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!termsAgreed) {
                alert('You must agree to the terms and conditions');
                return;
            }
            
            alert('Account created successfully! Welcome to DailyHarvest.');
        });
    }
});

// Cart Functions
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartTableBody = document.querySelector('.cart-table tbody');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartTableBody) return;

    // Clear existing rows
    cartTableBody.innerHTML = '';

    let grandTotal = 0;

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Your cart is empty</td></tr>';
        cartSummary.innerHTML = '<p><strong>Grand Total:</strong> ₹0</p>';
        return;
    }

    cart.forEach(item => {
        const price = parseFloat(item.price.replace('₹', ''));
        const total = price * item.quantity;
        grandTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" width="50">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>
                <input type="number" min="1" value="${item.quantity}" data-name="${item.name}" class="quantity-input">
            </td>
            <td>${item.price}</td>
            <td>₹${total.toFixed(2)}</td>
            <td><button class="remove-btn" data-name="${item.name}">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    cartSummary.innerHTML = `
        <p><strong>Grand Total:</strong> ₹${grandTotal.toFixed(2)}</p>
        <a href="checkout.html" class="category-btn">Proceed to Checkout</a>
    `;
}

function setupCartEventListeners() {
    // Quantity change handler
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productName = this.getAttribute('data-name');
            const newQuantity = parseInt(this.value);

            if (newQuantity < 1) {
                this.value = 1;
                return;
            }

            updateCartQuantity(productName, newQuantity);
        });
    });

    // Remove button handler
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            removeFromCart(productName);
        });
    });
}

function updateCartQuantity(productName, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        cart[productIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        setupCartEventListeners();
    }
}

function removeFromCart(productName) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const updatedCart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    displayCartItems();
    setupCartEventListeners();
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count in navigation if the element exists
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Initialize cart count on page load
updateCartCount();