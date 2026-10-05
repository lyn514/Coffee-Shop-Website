let iconCart = document.querySelector('.icon-cart');
let cart = document.querySelector('.cart');
let closeButton = document.querySelector('.close');

// .cart is positioned off-screen with `right: -100%` in style.css.
// Slide it in by overriding `right` with an inline style.
function openCart() {
    cart.style.right = '0';
    cart.style.boxShadow = '-10px 0 30px rgba(0, 0, 0, 0.5)';
}

function closeCart() {
    cart.style.right = '-100%';
    cart.style.boxShadow = 'none';
}

if (iconCart && cart) {
    iconCart.addEventListener('click', () => {
        // already open? then close it, otherwise show it
        if (cart.style.right === '0') {
            closeCart();
        } else {
            openCart();
        }
    });
}

if (closeButton && cart) {
    closeButton.addEventListener('click', () => {
        closeCart();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cart) {
        closeCart();
    }
});
