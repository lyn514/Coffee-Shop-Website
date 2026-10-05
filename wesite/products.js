/* ==========================================================================
   products.js - single source of truth for both catalogues.
   Paths are relative to this file's folder (wesite/), so the same entry works
   from any page inside the project.
   ========================================================================== */

const CURRENCY = 'PHP';

const COFFEE_PRODUCTS = [
    {
        id: 'c1',
        store: 'coffee',
        name: 'Candy Cane Latte',
        tagline: 'The holiday staple in a cup',
        description:
            'Designed to embody a childlike quality but with a kick of caffeine, this is a delightful Christmas drink that brings a holiday staple of candy canes to your coffee and will take you on a trip to the Land of Sweets.',
        image: 'Candy latte.jpg',
        price: 179,
        tag: 'Best seller',
        rating: 4.8,
        reviews: 214,
        brew: 'Espresso, steamed milk, candy cane syrup',
        size: '16 oz',
        origin: 'Blend of Brazil & Colombia'
    },
    {
        id: 'c2',
        store: 'coffee',
        name: 'Apple Cider Chai Latte',
        tagline: 'Fruity sweetness meets warm spice',
        description:
            'The Apple Cider Chai Latte combines the fruity sweetness of apple cider with the smooth spice of traditional tea, or chai. A gentle, warming cup for the colder months.',
        image: 'Apple cider chai.jpg',
        price: 210,
        tag: 'New',
        rating: 4.7,
        reviews: 158,
        brew: 'Chai concentrate, apple cider, steamed milk',
        size: '16 oz',
        origin: 'Assam & Darjeeling black tea'
    },
    {
        id: 'c3',
        store: 'coffee',
        name: 'Gingerbread Maple Latte',
        tagline: 'Bursting with aromatic spice',
        description:
            'Bursting with rich flavour and packed with aromatic spices, a gingerbread maple latte is the type of Christmas coffee that is a must-try for holiday cheer.',
        image: 'Gingerbread latte.jpg',
        price: 200,
        tag: 'Spiced',
        rating: 4.9,
        reviews: 302,
        brew: 'Espresso, gingerbread, maple, steamed milk',
        size: '16 oz',
        origin: 'Blend of Brazil & Colombia'
    },
    {
        id: 'c4',
        store: 'coffee',
        name: 'Cannoli Bites',
        tagline: 'Crunchy shell, creamy filling',
        description:
            'The crunchy exterior and creamy interior of a cannoli is one of the world’s best bites. Unfortunately, that bite is usually a messy thing to navigate, with the shell and filling going in all sorts of directions. We solved that problem.',
        image: 'cannoli.avif',
        price: 65,
        tag: 'Dessert',
        rating: 4.9,
        reviews: 411,
        brew: 'Baked fresh daily',
        size: 'Set of 3',
        origin: 'Sicilian recipe'
    },
    {
        id: 'c5',
        store: 'coffee',
        name: 'Gingerbread Cookies',
        tagline: 'Ginger, cinnamon, a tiny bit of clove',
        description:
            'Gingerbread should have a lot of ground ginger, a bit of cinnamon, and a tiny amount of cloves. These are the perfect Christmas dessert, baked in small batches every morning.',
        image: 'gingerbread cookies.avif',
        price: 50,
        tag: 'Dessert',
        rating: 4.8,
        reviews: 276,
        brew: 'Baked fresh daily',
        size: 'Set of 4',
        origin: 'Family recipe'
    },
    {
        id: 'c6',
        store: 'coffee',
        name: 'Santa Hat Cupcake',
        tagline: 'A swirl of red and a snowy trim',
        description:
            'Pipe a tall swirling mound of red frosting on top, then add a little white around the edges and top. Finished with a chocolate peppermint crumb.',
        image: 'santa-hat-cupcakes.avif',
        price: 40,
        tag: 'Dessert',
        rating: 4.6,
        reviews: 143,
        brew: 'Baked fresh daily',
        size: 'Single',
        origin: 'Peppermint chocolate'
    }
];

const PLUSH_PRODUCTS = [
    {
        id: 'p1',
        store: 'plush',
        name: 'Cinnamoroll White',
        tagline: 'Fluffy white bear costume',
        description:
            'Adorable Cinnamoroll in a fluffy white bear costume! Soft, cuddly, and made from premium low-allergy fibre. Perfect for a desk or a bedside shelf.',
        image: 'images/cinnamoroll white.jpg',
        price: 300,
        tag: 'Best seller',
        rating: 4.9,
        reviews: 188,
        material: 'Ultra-soft polyester fibre',
        size: '30 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p2',
        store: 'plush',
        name: 'Cinnamoroll Pink',
        tagline: 'Soft, cuddly, perfect for any Sanrio lover',
        description:
            'Adorable Cinnamoroll plush in a pink bear costume! Soft, cuddly, and perfect for any Sanrio lover. A very popular gift for birthdays and graduations.',
        image: 'images/cinnamoroll pink.jpg',
        price: 300,
        tag: 'Gift pick',
        rating: 4.8,
        reviews: 165,
        material: 'Ultra-soft polyester fibre',
        size: '30 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p3',
        store: 'plush',
        name: 'Cinnamoroll Light Blue',
        tagline: 'A cooler shade of cuddle',
        description:
            'Adorable Cinnamoroll in a fluffy light blue costume! Soft and cuddly, with a stitched smile that never quite goes away.',
        image: 'images/cinnamoroll blue.jpg',
        price: 300,
        tag: 'New',
        rating: 4.7,
        reviews: 121,
        material: 'Ultra-soft polyester fibre',
        size: '30 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p4',
        store: 'plush',
        name: 'Petal Rabbit',
        tagline: 'Plush bunny in a flower bonnet',
        description:
            'Adorable plush bunny in a flower bonnet! Soft and cuddly, with long floppy ears and a stitched flower that sits just off-centre the way real ones do.',
        image: 'images/petal rabbit.jpg',
        price: 350,
        tag: 'Gift pick',
        rating: 4.9,
        reviews: 203,
        material: 'Plush with polyester fill',
        size: '32 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p5',
        store: 'plush',
        name: 'Rabbit',
        tagline: 'Plush bunny with a carrot',
        description:
            'Adorable plush bunny with a carrot! Soft, cuddly, and perfect for snuggling. Comes with a stitched carrot accessory tucked into the paw.',
        image: 'images/rabbit.jpg',
        price: 200,
        tag: 'Everyday',
        rating: 4.6,
        reviews: 142,
        material: 'Plush with polyester fill',
        size: '28 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p6',
        store: 'plush',
        name: 'Fox',
        tagline: 'Our warmest plush',
        description:
            'Adorable plush fox! Soft and cuddly, with a thick brushed coat that holds heat beautifully. The single most requested plush in the shop.',
        image: 'images/fox.jpg',
        price: 450,
        tag: 'Premium',
        rating: 5.0,
        reviews: 318,
        material: 'Brushed premium plush',
        size: '38 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p7',
        store: 'plush',
        name: 'Cat',
        tagline: 'Plush animal in a pink hooded outfit',
        description:
            'Adorable plush animal in a pink hooded outfit! Soft and cuddly, with a removable hood so you can change the mood whenever you like.',
        image: 'images/cat.jpg',
        price: 150,
        tag: 'Value',
        rating: 4.5,
        reviews: 97,
        material: 'Plush with polyester fill',
        size: '24 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p8',
        store: 'plush',
        name: 'Duck',
        tagline: 'Plush duckling in a yellow outfit and hat',
        description:
            'Adorable plush duckling in a yellow outfit and hat! Soft and cuddly, and small enough to carry around without being annoying about it.',
        image: 'images/duck.jpg',
        price: 250,
        tag: 'Everyday',
        rating: 4.7,
        reviews: 134,
        material: 'Plush with polyester fill',
        size: '26 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p9',
        store: 'plush',
        name: 'Baby Dragon',
        tagline: 'Golden wings and a lot of personality',
        description:
            'Adorable plush dragon with golden wings! Soft and cuddly, with a stitched scale pattern along the back and wings that fold flat for storage.',
        image: 'images/baby dragon.jpg',
        price: 250,
        tag: 'New',
        rating: 4.8,
        reviews: 156,
        material: 'Plush with polyester fill',
        size: '30 cm',
        care: 'Surface wash only'
    },
    {
        id: 'p10',
        store: 'plush',
        name: 'Teddy Bear',
        tagline: 'Plush teddy in a piggy costume',
        description:
            'Adorable plush teddy bear in a piggy costume! Soft and cuddly, with a zip-on costume that is much easier to wash than the bear itself.',
        image: 'images/teddy bear.jpg',
        price: 450,
        tag: 'Premium',
        rating: 4.9,
        reviews: 221,
        material: 'Brushed premium plush',
        size: '36 cm',
        care: 'Machine wash costume only'
    }
];

const STORES = {
    coffee: {
        id: 'coffee',
        name: 'Christmas Coffee & Dessert',
        short: 'Coffee',
        icon: '☕',
        tagline: 'Roasted for the holidays',
        page: 'menu.html'
    },
    plush: {
        id: 'plush',
        name: 'Plushies',
        short: 'Plushies',
        icon: '🧸',
        tagline: 'Soft, cuddly, huggable',
        page: 'Itemscute.html'
    }
};

const CATALOG = {
    coffee: COFFEE_PRODUCTS,
    plush: PLUSH_PRODUCTS
};

const ALL_PRODUCTS = [...COFFEE_PRODUCTS, ...PLUSH_PRODUCTS];

/** Look up a product by id across both stores. */
function getProduct(id) {
    return ALL_PRODUCTS.find(function (p) {
        return p.id === id;
    });
}

/** Products for a store, optionally filtered by a search term. */
function getProducts(store, searchTerm) {
    const list = CATALOG[store] ? CATALOG[store].slice() : ALL_PRODUCTS.slice();
    if (!searchTerm) {
        return list;
    }
    const term = searchTerm.trim().toLowerCase();
    return list.filter(function (p) {
        return (
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            (p.tag || '').toLowerCase().includes(term)
        );
    });
}

/** Format a number as "₱1,234.00". */
function formatPrice(value) {
    return '₱' + Number(value).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function stars(rating) {
    const full = Math.round(Number(rating) || 0);
    return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
}