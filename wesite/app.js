//Select DOM  elements
let openShopping = document.querySelector('.icon-cart');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCart = document.querySelector('.listCart');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');


// event listeners for opening and closing the shopping cart
if (openShopping) {
    openShopping.addEventListener('click', ()=>{
        body.classList.add('active');// add 'active' class to body to show cart
    });
}
if (closeShopping) {
    closeShopping.addEventListener('click', ()=>{
        body.classList.remove('active');// remove 'active' class to hide cart
    });
}

// define prodiucts available for purchase
let products = [
    {
        id: 1,
        name: 'CANDY CANE LATTE',
        description: '"Designed to embody a childlike quality but with a kick of caffeine, this is a delightful Christmas drink that brings a holiday staple of candy canes to your Christmas coffee that will take you on a trip to the Land of Sweets!"',
        image: 'Candy latte.jpg',
        sign: '&#8369;',
        price: 179.00
    },
    {
        id: 2,
        name: 'APPLE CIDER CHAI LATTE',
        description:'"The Apple Cider Chai Latte combines the fruity sweetness of apple cider with the smooth spice of traditional tea, or chai." ',
        image: 'Apple cider chai.jpg',
        sign: '&#8369;',
        price: 210.00
    },
    {
        id: 3,
        name: 'GINGERBREAD MAPLE LATTE',
        description:'"Bursting with rich flavor and packed with aromatic spices, a gingerbread maple latte is the type of Christmas coffee that is a must-try for holiday cheer." ',
        image: 'Gingerbread latte.jpg',
        sign: '&#8369;',
        price: 200.00
    },
    {
        id: 4,
        name: 'CANNOLI BITES',
        description: '"The crunchy exterior and creamy interior of a cannoli is one of the world’s best bites. Unfortunately, that bite is usually a messy thing to navigate, with the shell and filling going in all sorts of directions."',
        image: 'cannoli.avif',
        sign: '&#8369;',
        price: 65.00
    },
    {
        id: 5,
        name: 'GINGERBREAD COOKIES',
        description: '"Gingerbread should have a lot of ground ginger, a bit of cinnamon, and a tiny amount of cloves. Its the perfect Christmas desserts." ',
        image: 'gingerbread cookies.avif',
        sign: '&#8369;',
        price: 50.00
    },
    {
        id: 6,
        name: 'SANTA HAT CUPCAKE',
        description:'"Pipe a tall swirling mound of red frosting on top, then add a little white around the edges and top." ',
        image: 'santa-hat-cupcakes.avif',
        sign: '&#8369;',
        price: 40.00
    },
];
//array to store items added to the cart
let listCarts = [];
// initialize the app by rendering product items
function initApp(){
    products.forEach((value, key)=>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
        <img src="${value.image}"/>
        <div class="title">${value.name}</div>
        <div class="description">${value.description}</div>
        <div class="price">${value.sign}${value.price.toLocaleString()}</div>
        <button onclick="addtoCart(${key})">Add To Cart</button>
        `;
        list.appendChild(newDiv); // append the new product item to the list
    });
}
if (list) { initApp(); }// call the function to initialize the app
// function to add selected product to the cart
function addtoCart(key){
    if(listCarts[key] == null){ // check if product is already in cart
        listCarts[key] = products[key]; // add product to cart
        listCarts[key].quantity = 1; // initialize quantity
    }
    reloadCart(); //update cart display
}
// function to reload and display the cart
function reloadCart() {
    if (!listCart) { return; } //no cart list on this page
    listCart.innerHTML = ''; //clear the current cart display
    let count = 0; //initialize total item count
    let totalPrice = 0; // initialize total price

    listCarts.forEach((value, key) => {
        if (value != null) {
            totalPrice += value.price * value.quantity; //calculate total price
            count += value.quantity; // update total item count

            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.sign}${value.price.toLocaleString()}</div>
                <div>${value.quantity}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>
            `;
            listCart.appendChild(newDiv); //append item details to the cart
        }
    });

    // update total price and quantity in the cart
    if (total) { total.innerText = totalPrice.toLocaleString(); }
    if (quantity) { quantity.innerText = count; }
}

// function to change the quantity of items in the cart
function changeQuantity(key, quantity) {
    if (quantity <= 0) {
        delete listCarts[key]; // remove item if quantity is zero
    } else {
        listCarts[key].quantity = quantity; //update quantity
    }
    reloadCart(); //refresh cart display
}

