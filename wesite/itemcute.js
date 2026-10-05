// Select DOM elements
let openShopping = document.querySelector('.icon-cart');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCart = document.querySelector('.listCart');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

// Event listeners for opening and closing the shopping cart
if (openShopping) {
    openShopping.addEventListener('click', (event) => {
        event.preventDefault(); // the cart icon can sit inside a link; do not navigate away
        body.classList.add('active'); // add 'active' class to body to show cart
    });
}
if (closeShopping) {
    closeShopping.addEventListener('click', () => {
        body.classList.remove('active'); // remove 'active' class to hide cart
    });
}

// Define products available for purchase
let products = [
    { id: 1, name: 'Cinnamoll White', description: 'Adorable Cinnamoroll in a fluffy white bear costume! Soft and Cuddly.', image: 'cinnamoroll white.jpg', sign: '&#8369;', price: 300.00 },
    { id: 2, name: 'Cinnamoroll Pink', description: 'Adorable Cinnamoroll plush in a pink bear costume! Soft, Cuddly, and perfect for any Sanrio lover.', image: 'cinnamoroll pink.jpg', sign: '&#8369;', price: 300.00 },
    { id: 3, name: 'Cinnamoroll Light Blue', description: 'Adorable Cinnamoroll in a fluffy light blue costume! Soft and Cuddly.', image: 'cinnamoroll blue.jpg', sign: '&#8369;', price: 300.00 },
    { id: 4, name: 'Petal Rabbit', description: 'Adorable plush bunny in a flower bonnet! Soft and Cuddly.', image: 'petal rabbit.jpg', sign: '&#8369;', price: 350.00 },
    { id: 5, name: 'Rabbit', description: 'Adorable plush bunny with a carrot! Soft, Cuddly, and perfect for snuggling.', image: 'rabbit.jpg', sign: '&#8369;', price: 200.00 },
    { id: 6, name: 'Fox', description: 'Adorable plush fox! Soft and Cuddly.', image: 'fox.jpg', sign: '&#8369;', price: 450.00 },
    { id: 7, name: 'Cat', description: 'Adorable plush animal in a pink hooded outfit! Soft and Cuddly.', image: 'cat.jpg', sign: '&#8369;', price: 150.00 },
    { id: 8, name: 'Duck', description: 'Adorable plush duckling in a yellow outfit and hat! Soft and Cuddly.', image: 'duck.jpg', sign: '&#8369;', price: 250.00 },
    { id: 9, name: 'Baby Dragon', description: 'Adorable plush dragon with golden wings! Soft and Cuddly.', image: 'baby dragon.jpg', sign: '&#8369;', price: 250.00 },
    { id: 10, name: 'Teddy Bear', description: 'Adorable plush teddy bear in a piggy costume! Soft and Cuddly.', image: 'teddy bear.jpg', sign: '&#8369;', price: 450.00 },
];

// Array to store items added to the cart
let listCarts = [];

// Initialize the app by rendering product items
function initApp() {
    products.forEach((value, key) => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="images/${value.image}"/>
            <div class="title">${value.name}</div>
            <div class="price">${value.sign}${value.price.toLocaleString()}</div>
            <div class="description">${value.description}</div>
            <button onclick="addtoCart(${key})">Add To Cart</button>
        `;
        list.appendChild(newDiv); // append the new product item to the list
    });
}
if (list) { initApp(); } // call the function to initialize the app

// Function to add selected product to the cart
function addtoCart(key) {
    if (listCarts[key] == null) { // check if product is already in cart
        listCarts[key] = products[key]; // add product to cart
        listCarts[key].quantity = 1; // initialize quantity
    }
    reloadCart(); // update cart display
}

// Function to reload and display the cart
function reloadCart() {
    if (!listCart) { return; } // no cart list on this page
    listCart.innerHTML = ''; // clear the current cart display
    let count = 0; // initialize total item count
    let totalPrice = 0; // initialize total price

    listCarts.forEach((value, key) => {
        if (value != null) {
            totalPrice += value.price * value.quantity; // calculate total price
            count += value.quantity; // update total item count

            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="images/${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.sign}${value.price.toLocaleString()}</div>
                <div>${value.quantity}</div>
                <div>
                    <select onchange="changeQuantity(${key}, this.value)">
                        ${Array.from({ length: 100 }, (_, i) => i + 1).map(i =>
                            `<option value="${i}" ${i === value.quantity ? 'selected' : ''}>${i}</option>`
                        ).join('')}
                    </select>
                </div>
                <button onclick="removeFromCart(${key})">Remove</button> <!-- Remove button -->
            `;
            listCart.appendChild(newDiv); // append item details to the cart
        }
    });

    // Update total price and quantity in the cart
    if (total) { total.innerText = `${totalPrice.toLocaleString()}`; } // update total price
    if (quantity) { quantity.innerText = count; } // update total quantity
}

// Function to change the quantity of items in the cart
function changeQuantity(key, newQuantity) {
    newQuantity = parseInt(newQuantity, 10); // ensure quantity is an integer
    if (newQuantity <= 0) {
        delete listCarts[key]; // remove item if quantity is zero
    } else {
        listCarts[key].quantity = newQuantity; // update quantity
    }
    reloadCart(); // refresh cart display
}

// Function to remove an item from the cart
function removeFromCart(key) {
    delete listCarts[key]; // remove the product from the cart
    reloadCart(); // refresh cart display
}
// Event listener for checkout when clicking the total price
if (total) {
    total.addEventListener('click', () => {
        if (listCarts.length > 0) {
            let confirmation = confirm(`Your total is ₱${total.innerText}. Proceed to checkout?`);
            if (confirmation) {
                alert('Thank you for your purchase!');
                listCarts = []; // Clear the cart
                reloadCart(); // Refresh the cart display
            }
        } else {
            alert('Your cart is empty. Please add items to proceed.');
        }
    });
}
