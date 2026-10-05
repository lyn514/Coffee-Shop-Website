/* ==========================================================================
   site.js - shared runtime for every page in the project.

   Gives the site one coherent behaviour:
     * a sticky nav + footer injected from one place
     * a cart that survives navigation (localStorage)
     * a cart drawer, a checkout modal and toasts
     * reusable product-card / grid rendering

   Requires products.js to be loaded BEFORE this file.
   ========================================================================== */

const Shop = (function () {
    'use strict';

    const CART_KEY = 'shop.cart.v1';
    const TAX_RATE = 0.12; // VAT

    /* ---------------------------------------------------------------- state */

    let items = loadCart();
    const listeners = [];

    function loadCart() {
        try {
            const raw = window.localStorage.getItem(CART_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            // drop anything that no longer exists in the catalogue
            return parsed.filter(function (line) {
                return (
                    line &&
                    typeof line.id === 'string' &&
                    typeof line.quantity === 'number' &&
                    line.quantity > 0 &&
                    Boolean(getProduct(line.id))
                );
            });
        } catch (err) {
            console.warn('Cart could not be read, starting empty.', err);
            return [];
        }
    }

    function saveCart() {
        try {
            window.localStorage.setItem(CART_KEY, JSON.stringify(items));
        } catch (err) {
            console.warn('Cart could not be saved.', err);
        }
        emit();
    }

    function emit() {
        updateBadges();
        listeners.forEach(function (fn) {
            fn();
        });
    }

    /* ------------------------------------------------------------ cart logic */

    function add(id, quantity) {
        const qty = quantity || 1;
        const line = items.find(function (l) {
            return l.id === id;
        });
        if (line) {
            line.quantity += qty;
        } else {
            items.push({ id: id, quantity: qty });
        }
        saveCart();
    }

    function setQuantity(id, quantity) {
        const line = items.find(function (l) {
            return l.id === id;
        });
        if (!line) return;
        if (quantity <= 0) {
            remove(id);
            return;
        }
        line.quantity = quantity;
        saveCart();
    }

    function remove(id) {
        items = items.filter(function (l) {
            return l.id !== id;
        });
        saveCart();
    }

    function clear() {
        items = [];
        saveCart();
    }

    /** Cart lines joined with catalogue data, so prices are never stale. */
    function detailed() {
        return items
            .map(function (line) {
                const product = getProduct(line.id);
                if (!product) return null;
                return {
                    product: product,
                    quantity: line.quantity,
                    lineTotal: product.price * line.quantity
                };
            })
            .filter(Boolean);
    }

    function count() {
        return items.reduce(function (sum, line) {
            return sum + line.quantity;
        }, 0);
    }

    function subtotal() {
        return detailed().reduce(function (sum, line) {
            return sum + line.lineTotal;
        }, 0);
    }

    function tax() {
        return subtotal() * TAX_RATE;
    }

    function grandTotal() {
        return subtotal() + tax();
    }

    /* ------------------------------------------------------------- rendering */

    function money(value) {
        return formatPrice(value);
    }

    function lineHTML(line) {
        const p = line.product;
        return (
            '<div class="line" data-id="' + p.id + '">' +
            '<img class="line__media" src="' + p.image + '" alt="' + escapeHTML(p.name) + '">' +
            '<div>' +
            '<div class="line__title">' + escapeHTML(p.name) + '</div>' +
            '<div class="line__meta">' +
            '<span class="line__price">' + money(line.lineTotal) + '</span>' +
            '<span class="stepper">' +
            '<button type="button" data-act="dec" aria-label="Decrease quantity">&minus;</button>' +
            '<span>' + line.quantity + '</span>' +
            '<button type="button" data-act="inc" aria-label="Increase quantity">+</button>' +
            '</span>' +
            '</div>' +
            '<button type="button" class="line__remove" data-act="remove">Remove</button>' +
            '</div>' +
            '</div>'
        );
    }

    function drawerBodyHTML() {
        if (count() === 0) {
            return (
                '<div class="cart-empty">' +
                '<div class="big">🛒</div>' +
                '<p>Your cart is empty.</p>' +
                '<p style="font-size:.86rem;margin-top:6px;">Add something warm and festive.</p>' +
                '</div>'
            );
        }
        return detailed()
            .map(lineHTML)
            .join('');
    }

    function drawerFootHTML() {
        if (count() === 0) return '';
        return (
            '<div class="totals">' +
            '<div><span>Subtotal</span><span>' + money(subtotal()) + '</span></div>' +
            '<div><span>VAT (12%)</span><span>' + money(tax()) + '</span></div>' +
            '<div class="grand"><span>Total</span><span>' + money(grandTotal()) + '</span></div>' +
            '</div>' +
            '<button type="button" class="btn btn--gold btn--block" data-act="checkout">Checkout</button>' +
            '<button type="button" class="btn btn--ghost btn--block btn--sm" data-act="clear">Clear cart</button>'
        );
    }

    function renderDrawer() {
        const body = document.querySelector('[data-drawer-body]');
        const foot = document.querySelector('[data-drawer-foot]');
        if (body) body.innerHTML = drawerBodyHTML();
        if (foot) foot.innerHTML = drawerFootHTML();
    }

    function updateBadges() {
        const n = count();
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
            el.textContent = n;
            el.dataset.empty = n === 0 ? 'true' : 'false';
        });
        document.querySelectorAll('[data-cart-label]').forEach(function (el) {
            el.textContent = n === 1 ? '1 item' : n + ' items';
        });
    }

    /** A product card. `product` comes from products.js. */
    function cardHTML(product) {
        const href = 'items.html?id=' + encodeURIComponent(product.id);
        return (
            '<article class="card" data-id="' + product.id + '">' +
            '<a class="card__media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + product.image + '" alt="" loading="lazy">' +
            (product.tag ? '<span class="card__tag">' + escapeHTML(product.tag) + '</span>' : '') +
            '</a>' +
            '<div class="card__body">' +
            '<h3 class="card__title">' +
            '<a href="' + href + '">' + escapeHTML(product.name) + '</a>' +
            '</h3>' +
            '<p class="card__desc">' + escapeHTML(product.tagline) + '</p>' +
            '<div class="card__foot">' +
            '<span class="price">' + money(product.price) +
            '<small>' + stars(product.rating) + ' ' + product.rating + '</small></span>' +
            '<button type="button" class="btn btn--primary btn--sm" data-add="' + product.id + '">Add</button>' +
            '</div>' +
            '</div>' +
            '</article>'
        );
    }

    function mountGrid(target, products) {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return;
        if (!products || products.length === 0) {
            el.innerHTML =
                '<div class="empty"><div class="big">🔍</div>' +
                '<p>No products match that search.</p></div>';
            return;
        }
        el.innerHTML = products.map(cardHTML).join('');
    }

    function escapeHTML(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[c];
        });
    }

    /* ---------------------------------------------------------------- chrome */

    const NAV_ITEMS = [
        { href: 'home.html', label: 'Home' },
        { href: 'menu.html', label: 'Coffee' },
        { href: 'Itemscute.html', label: 'Plushies' },
        { href: 'Aboutcute.html', label: 'About' },
        { href: 'contactcute.html', label: 'Contact' }
    ];

    function navHTML(activePage) {
        const links = NAV_ITEMS.map(function (item) {
            const current = item.href === activePage ? ' aria-current="page"' : '';
            return '<a href="' + item.href + '"' + current + '>' + item.label + '</a>';
        }).join('');

        return (
            '<div class="site-nav__inner">' +
            '<a class="site-nav__brand" href="home.html">' +
            '<span class="mark">☕</span><span>Festive<span class="accent">Shop</span></span>' +
            '</a>' +
            '<button type="button" class="nav-toggle" data-nav-toggle aria-expanded="false" aria-label="Open menu">☰</button>' +
            '<nav class="site-nav__links" data-nav-links>' + links + '</nav>' +
            '<div class="site-nav__actions">' +
            '<button type="button" class="cart-btn" data-cart-open aria-label="Open cart">' +
            '<span aria-hidden="true">🛒</span><span class="label" data-cart-label>0 items</span>' +
            '<span class="cart-btn__count" data-cart-count data-empty="true">0</span>' +
            '</button>' +
            '</div>' +
            '</div>'
        );
    }

    function footerHTML() {
        return (
            '<div class="site-footer__inner">' +
            '<div>' +
            '<h4>FestiveShop</h4>' +
            '<p>Two little shops in one place: a Christmas coffee and dessert counter, ' +
            'and a shelf full of plushies worth hugging.</p>' +
            '</div>' +
            '<div>' +
            '<h4>Shop</h4>' +
            '<ul>' +
            '<li><a href="menu.html">Coffee &amp; Dessert</a></li>' +
            '<li><a href="Itemscute.html">Plushies</a></li>' +
            '<li><a href="items.html?from=grid">Product detail</a></li>' +
            '</ul>' +
            '</div>' +
            '<div>' +
            '<h4>Account</h4>' +
            '<ul>' +
            '<li><a href="Login.html">Log in</a></li>' +
            '<li><a href="registration.html">Register</a></li>' +
            '<li><a href="forgotpass.html">Forgot password</a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="site-footer__bottom">' +
            '<span>&copy; ' + new Date().getFullYear() + ' FestiveShop. School project.</span>' +
            '<span>Built with plain HTML, CSS and JavaScript.</span>' +
            '</div>'
        );
    }

    /* ----------------------------------------------------------------- toast */

    function toast(message, icon) {
        const host = document.querySelector('[data-toasts]');
        if (!host) return;
        const el = document.createElement('div');
        el.className = 'toast';
        el.innerHTML = '<span aria-hidden="true">' + (icon || '✓') + '</span><span>' +
            escapeHTML(message) + '</span>';
        host.appendChild(el);
        window.setTimeout(function () {
            el.dataset.leaving = 'true';
            window.setTimeout(function () {
                el.remove();
            }, 300);
        }, 2400);
    }

    /* -------------------------------------------------------------- checkout */

    function orderNumber() {
        return 'FS-' + Math.floor(100000 + Math.random() * 899999);
    }

    function handleCheckoutSubmit(form) {
        let valid = true;

        form.querySelectorAll('[required]').forEach(function (input) {
            const field = input.closest('.field');
            const ok = input.value.trim() !== '' && input.checkValidity();
            if (field) field.dataset.invalid = ok ? 'false' : 'true';
            input.setAttribute('aria-invalid', ok ? 'false' : 'true');
            if (!ok) valid = false;
        });

        if (!valid) {
            toast('Please fill in the highlighted fields.', '⚠️');
            return;
        }

        const panel = document.querySelector('[data-checkout-panel]');
        const number = orderNumber();
        const total = grandTotal();

        if (panel) {
            panel.innerHTML =
                '<div style="text-align:center;padding:18px 4px;">' +
                '<div style="font-size:3.2rem;line-height:1;">🎁</div>' +
                '<h2 style="margin:16px 0 6px;">Order placed</h2>' +
                '<p class="modal__sub" style="margin-bottom:20px;">Thank you! We have your order.</p>' +
                '<div class="notice" style="text-align:left;">' +
                '<span aria-hidden="true">📦</span>' +
                '<div><strong>' + number + '</strong><br>' +
                '<span style="font-size:.86rem;">Total paid: ' + money(total) +
                ' &middot; ' + count() + ' item(s) &middot; Delivery in 2&ndash;4 days.</span></div>' +
                '</div>' +
                '<button type="button" class="btn btn--gold btn--block" data-close-modal>Done</button>' +
                '</div>';
        }

        clear();
        renderDrawer();
    }

    function wireCheckout() {
        const form = document.querySelector('[data-checkout-form]');
        if (!form) return;
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (count() === 0) {
                toast('Your cart is empty.', '⚠️');
                return;
            }
            handleCheckoutSubmit(form);
        });
    }

    /* ---------------------------------------------------------------- wiring */

    function openDrawer() {
        const drawer = document.querySelector('[data-drawer]');
        const scrim = document.querySelector('[data-scrim]');
        if (!drawer) return;
        renderDrawer();
        drawer.dataset.open = 'true';
        if (scrim) scrim.dataset.open = 'true';
        document.body.style.overflow = 'hidden';
        const close = drawer.querySelector('[data-drawer-close]');
        if (close) close.focus();
    }

    function closeDrawer() {
        const drawer = document.querySelector('[data-drawer]');
        const scrim = document.querySelector('[data-scrim]');
        if (drawer) drawer.dataset.open = 'false';
        if (scrim) scrim.dataset.open = 'false';
        document.body.style.overflow = '';
    }

    function closeModal() {
        const modal = document.querySelector('[data-modal]');
        const scrim = document.querySelector('[data-scrim]');
        if (modal) modal.dataset.open = 'false';
        if (scrim) scrim.dataset.open = 'false';
        document.body.style.overflow = '';
    }

    function wireGlobal() {
        document.addEventListener('click', function (event) {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const addBtn = target.closest('[data-add]');
            if (addBtn) {
                const id = addBtn.dataset.add;
                const product = getProduct(id);
                add(id, 1);
                if (product) toast(product.name + ' added to cart', '🛒');
                return;
            }

            if (target.closest('[data-cart-open]')) {
                openDrawer();
                return;
            }

            if (target.closest('[data-drawer-close]')) {
                closeDrawer();
                return;
            }

            if (target.closest('[data-scrim]')) {
                closeDrawer();
                closeModal();
                return;
            }

            if (target.closest('[data-nav-toggle]')) {
                const links = document.querySelector('[data-nav-links]');
                const open = links && links.dataset.open === 'true';
                if (links) links.dataset.open = open ? 'false' : 'true';
                target.setAttribute('aria-expanded', open ? 'false' : 'true');
                return;
            }

            if (target.closest('[data-close-modal]')) {
                closeModal();
                return;
            }

            const stepBtn = target.closest('[data-act]');
            if (!stepBtn) return;

            const act = stepBtn.dataset.act;
            const row = stepBtn.closest('[data-id]');
            const id = row ? row.dataset.id : null;
            const line = items.find(function (l) {
                return l.id === id;
            });

            if (act === 'inc' && line) setQuantity(id, line.quantity + 1);
            if (act === 'dec' && line) setQuantity(id, line.quantity - 1);
            if (act === 'remove') {
                const product = getProduct(id);
                remove(id);
                if (product) toast(product.name + ' removed', '🗑️');
            }
            if (act === 'clear') {
                clear();
                toast('Cart cleared', '🗑️');
            }
            if (act === 'checkout') {
                const panel = document.querySelector('[data-checkout-panel]');
                const modal = document.querySelector('[data-modal]');
                const scrim = document.querySelector('[data-scrim]');
                closeDrawer();
                if (panel) {
                    panel.innerHTML = checkoutFormHTML();
                    wireCheckout();
                }
                if (modal) modal.dataset.open = 'true';
                if (scrim) scrim.dataset.open = 'true';
                document.body.style.overflow = 'hidden';
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            closeDrawer();
            closeModal();
        });

        // keep multiple open tabs in sync
        window.addEventListener('storage', function (event) {
            if (event.key !== CART_KEY) return;
            items = loadCart();
            emit();
            renderDrawer();
        });
    }

    function checkoutFormHTML() {
        return (
            '<h2>Checkout</h2>' +
            '<p class="modal__sub">This is a school demo, so no real payment is taken.</p>' +
            '<form data-checkout-form novalidate>' +
            '<div class="field"><label for="co-name">Full name</label>' +
            '<input id="co-name" name="name" type="text" required autocomplete="name">' +
            '<span class="err">Please enter your name.</span></div>' +
            '<div class="field"><label for="co-email">Email</label>' +
            '<input id="co-email" name="email" type="email" required autocomplete="email">' +
            '<span class="err">Please enter a valid email.</span></div>' +
            '<div class="field"><label for="co-address">Delivery address</label>' +
            '<textarea id="co-address" name="address" rows="3" required></textarea>' +
            '<span class="err">Please enter a delivery address.</span></div>' +
            '<div class="field"><label for="co-pay">Payment method</label>' +
            '<select id="co-pay" name="payment" required>' +
            '<option value="cod">Cash on delivery</option>' +
            '<option value="gcash">GCash</option>' +
            '<option value="card">Debit / credit card</option>' +
            '</select><span class="err">Please choose a payment method.</span></div>' +
            '<button type="submit" class="btn btn--gold btn--block">Place order</button>' +
            '</form>'
        );
    }

    /* ------------------------------------------------------------------- init */

    /**
     * Boot the shared chrome. Call once per page after products.js.
     * @param {string} activePage filename of the current page, e.g. 'menu.html'
     */
    function init(activePage) {
        const navHost = document.querySelector('[data-site-nav]');
        if (navHost) navHost.innerHTML = navHTML(activePage);

        const footHost = document.querySelector('[data-site-footer]');
        if (footHost) footHost.innerHTML = footerHTML();

        if (!document.querySelector('[data-drawer]')) {
            const chrome = document.createElement('div');
            chrome.innerHTML =
                '<div class="scrim" data-scrim data-open="false"></div>' +
                '<aside class="drawer" data-drawer data-open="false" aria-label="Shopping cart">' +
                '<div class="drawer__head">' +
                '<h2>🛒 Your cart</h2>' +
                '<button type="button" class="drawer__close" data-drawer-close aria-label="Close cart">✕</button>' +
                '</div>' +
                '<div class="drawer__body" data-drawer-body></div>' +
                '<div class="drawer__foot" data-drawer-foot></div>' +
                '</aside>';
            while (chrome.firstChild) {
                document.body.appendChild(chrome.firstChild);
            }
        }

        if (!document.querySelector('[data-modal]')) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.dataset.open = 'false';
            modal.setAttribute('data-modal', '');
            modal.innerHTML = '<div class="modal__panel" data-checkout-panel></div>';
            document.body.appendChild(modal);
        }

        if (!document.querySelector('[data-toasts]')) {
            const toasts = document.createElement('div');
            toasts.className = 'toasts';
            toasts.setAttribute('data-toasts', '');
            document.body.appendChild(toasts);
        }

        updateBadges();
        renderDrawer();
        wireGlobal();
        listeners.push(renderDrawer);
    }

    return {
        init: init,
        add: add,
        setQuantity: setQuantity,
        remove: remove,
        clear: clear,
        count: count,
        subtotal: subtotal,
        tax: tax,
        grandTotal: grandTotal,
        detailed: detailed,
        toast: toast,
        cardHTML: cardHTML,
        mountGrid: mountGrid,
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
        onChange: function (fn) {
            listeners.push(fn);
        },
        escapeHTML: escapeHTML
    };
})();