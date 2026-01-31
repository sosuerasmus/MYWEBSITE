let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// --- NAVIGATION & MOBILE MENU LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        // Toggle menu when clicking the hamburger icon
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents immediate closing from the document listener below
            navLinks.classList.toggle('show');
        });

        // Close menu when clicking anywhere else on the screen
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('show');
            }
        });

        // Close menu when a link inside is clicked (useful for one-page navigation)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('show'));
        });
    }

    // Initialize UI
    updateCartUI();
});

// --- CART LOGIC ---
window.addToCart = function(product) {
    const item = cartItems.find(i => i.name === product.name);
    if (item) { 
        item.quantity += 1; 
    } else { 
        cartItems.push({ ...product, quantity: 1 }); 
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
    showToast(`${product.name} added to cart!`);
};

window.updateCartUI = function() {
    const list = document.getElementById('cart-items-list');
    const count = document.getElementById('cart-count');
    const totalDisp = document.getElementById('cart-total-display');
    
    if(!count) return;

    let totalItems = 0;
    let totalPrice = 0;
    if(list) list.innerHTML = "";

    cartItems.forEach(item => {
        totalItems += item.quantity;
        totalPrice += (parseFloat(item.price) || 0) * item.quantity;
        if(list) {
            const li = document.createElement('li');
            li.style.padding = "5px 0";
            li.innerHTML = `${item.name} (x${item.quantity}) - GH₵${item.price}`;
            list.appendChild(li);
        }
    });

    count.textContent = totalItems;
    if(totalDisp) totalDisp.textContent = `Total: GH₵${totalPrice.toFixed(2)}`;
};

// --- UTILITIES ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    toast.style.opacity = '1';
    
    // Shake the cart icon if it exists
    const cartIcon = document.querySelector('.cart-icon');
    if(cartIcon) {
        cartIcon.classList.add('shake');
        setTimeout(() => cartIcon.classList.remove('shake'), 300);
    }

    setTimeout(() => { 
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = "none"; }, 400); 
    }, 3000);
}