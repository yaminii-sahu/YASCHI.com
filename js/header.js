/**
 * Yaschi E-Commerce — Global Header & Navigation Controller
 * Handles mobile drawer, global Ctrl+Shift+A admin shortcut, location selector modal,
 * slide-out cart drawer, and sub-navigation links.
 */

(function() {
    function initHeader() {
        // =====================================================================
        // 1. HIDDEN ADMIN KEYBOARD SHORTCUT: CTRL + SHIFT + A
        // =====================================================================
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                // Determine path depending on whether we are in root or subfolder
                const isInAdmin = window.location.pathname.includes('/admin/');
                if (!isInAdmin) {
                    window.location.href = 'admin/login.html';
                }
            }
        });

        // =====================================================================
        // 1b. GREET SIGNED-IN USER
        // =====================================================================
        try {
            const rawUser = localStorage.getItem('yaschi_user');
            if (rawUser) {
                const user = JSON.parse(rawUser);
                if (user && user.name) {
                    const signinSmall = document.querySelector('.action-signin .action-small');
                    if (signinSmall) signinSmall.textContent = `Hello, ${user.name}`;
                    const drawerUserSpan = document.querySelector('.drawer-user span');
                    if (drawerUserSpan) drawerUserSpan.textContent = `Hello, ${user.name}`;
                }
            }
        } catch (e) {
            // Ignore parse errors
        }

        // =====================================================================
        // 2. MOBILE DRAWER NAVIGATION (HAMBURGER MENU)
        // =====================================================================
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const drawerOpenBtn = document.getElementById('drawerOpenBtn');
        const drawerCloseBtn = document.getElementById('drawerCloseBtn');
        const mobileDrawer = document.getElementById('mobileDrawer');
        const drawerOverlay = document.getElementById('drawerOverlay');

        function openDrawer() {
            if (mobileDrawer) mobileDrawer.classList.add('open');
            if (drawerOverlay) drawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            if (mobileDrawer) mobileDrawer.classList.remove('open');
            if (drawerOverlay) drawerOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
        if (drawerOpenBtn) drawerOpenBtn.addEventListener('click', openDrawer);
        if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
        if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

        // =====================================================================
        // 3. SLIDE-OUT CART DRAWER
        // =====================================================================
        let cartDrawer = document.getElementById('cartDrawer');
        let cartDrawerOverlay = document.getElementById('cartDrawerOverlay');

        if (!cartDrawer) {
            // Dynamically inject Cart Drawer if not present in markup
            cartDrawerOverlay = document.createElement('div');
            cartDrawerOverlay.id = 'cartDrawerOverlay';
            cartDrawerOverlay.className = 'cart-drawer-overlay';

            cartDrawer = document.createElement('aside');
            cartDrawer.id = 'cartDrawer';
            cartDrawer.className = 'cart-drawer';
            cartDrawer.innerHTML = `
                <div class="cart-drawer-header">
                    <div class="cart-drawer-title">
                        <i class="fa-solid fa-basket-shopping" style="color:var(--color-blush);"></i>
                        <span>Your Shopping Bag</span>
                    </div>
                    <button type="button" class="cart-drawer-close" id="cartDrawerCloseBtn" aria-label="Close cart">&times;</button>
                </div>
                <div class="cart-drawer-body" id="cartDrawerBody">
                    <!-- Items rendered dynamically -->
                </div>
                <div class="cart-drawer-footer" id="cartDrawerFooter">
                    <!-- Footer totals & checkout -->
                </div>
            `;
            document.body.appendChild(cartDrawerOverlay);
            document.body.appendChild(cartDrawer);

            const closeBtn = document.getElementById('cartDrawerCloseBtn');
            if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
            cartDrawerOverlay.addEventListener('click', closeCartDrawer);
        }

        function openCartDrawer() {
            renderCartDrawerItems();
            if (cartDrawer) cartDrawer.classList.add('open');
            if (cartDrawerOverlay) cartDrawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeCartDrawer() {
            if (cartDrawer) cartDrawer.classList.remove('open');
            if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function renderCartDrawerItems() {
            const body = document.getElementById('cartDrawerBody');
            const footer = document.getElementById('cartDrawerFooter');
            if (!body || !footer || !window.YaschiCart) return;

            const items = window.YaschiCart.getItems();
            if (items.length === 0) {
                body.innerHTML = `
                    <div style="text-align:center; padding:50px 20px;">
                        <i class="fa-solid fa-basket-shopping" style="font-size:3rem; color:var(--color-blush); margin-bottom:12px;"></i>
                        <h4 style="font-family:var(--font-serif-display); color:var(--color-text-dark); margin-bottom:8px;">Your bag is empty</h4>
                        <p style="font-size:0.85rem; color:#888; margin-bottom:20px;">Explore our cottagecore pieces and add your favorites.</p>
                        <a href="shop.html" class="btn-checkout" style="display:inline-block; width:auto; padding:10px 24px; font-size:0.9rem;">Shop Collection</a>
                    </div>
                `;
                footer.innerHTML = '';
                return;
            }

            const subtotal = window.YaschiCart.getSubtotal();
            const count = window.YaschiCart.getItemCount();

            body.innerHTML = items.map(item => `
                <div class="cart-drawer-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-drawer-thumb">
                    <div class="cart-drawer-info">
                        <div class="cart-drawer-name">${item.name}</div>
                        <div class="cart-drawer-meta">Size: ${item.size} • ₹${item.price} each</div>
                        <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                            <div class="qty-stepper" style="transform:scale(0.8); transform-origin:left center;">
                                <button type="button" class="qty-btn drawer-qty-minus" data-id="${item.id}" data-size="${item.size}">-</button>
                                <span class="qty-input" style="line-height:38px; display:inline-block;">${item.quantity}</span>
                                <button type="button" class="qty-btn drawer-qty-plus" data-id="${item.id}" data-size="${item.size}">+</button>
                            </div>
                            <button type="button" class="drawer-remove-btn" data-id="${item.id}" data-size="${item.size}" title="Remove">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cart-drawer-price">₹${item.price * item.quantity}</div>
                </div>
            `).join('');

            footer.innerHTML = `
                <div style="display:flex; justify-content:space-between; font-size:1rem; font-weight:700; margin-bottom:14px;">
                    <span>Subtotal (${count} items):</span>
                    <span style="color:var(--color-rose-gold);">₹${subtotal}</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <a href="checkout.html" class="btn-checkout" style="margin-top:0;">Proceed to Checkout &rarr;</a>
                    <a href="cart.html" style="text-align:center; font-size:0.88rem; color:var(--color-title-sage); font-weight:600; padding:6px 0;">View Full Bag</a>
                </div>
            `;

            // Bind drawer quantity controls
            body.querySelectorAll('.drawer-qty-minus').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const size = b.getAttribute('data-size');
                    const item = items.find(i => i.id === id && i.size === size);
                    if (item) {
                        window.YaschiCart.updateQuantity(id, size, item.quantity - 1);
                        renderCartDrawerItems();
                    }
                });
            });

            body.querySelectorAll('.drawer-qty-plus').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const size = b.getAttribute('data-size');
                    const item = items.find(i => i.id === id && i.size === size);
                    if (item) {
                        window.YaschiCart.updateQuantity(id, size, item.quantity + 1);
                        renderCartDrawerItems();
                    }
                });
            });

            body.querySelectorAll('.drawer-remove-btn').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const size = b.getAttribute('data-size');
                    window.YaschiCart.removeItem(id, size);
                    renderCartDrawerItems();
                });
            });
        }

        window.openCartDrawer = openCartDrawer;
        window.closeCartDrawer = closeCartDrawer;

        // Wire cart buttons in header to open drawer
        const cartBtn = document.getElementById('cartButton');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openCartDrawer();
            });
        }

        // Auto open drawer when an item is added if on non-cart page
        window.addEventListener('yaschi:cart-updated', () => {
            if (window.YaschiCart) window.YaschiCart.updateBadges();
        });

        // =====================================================================
        // 4. INTERACTIVE LOCATION SELECTOR MODAL
        // =====================================================================
        const locSelector = document.getElementById('locationSelector');
        let locModal = document.getElementById('locationModal');

        if (locSelector && !locModal) {
            locModal = document.createElement('div');
            locModal.id = 'locationModal';
            locModal.className = 'order-modal-overlay';
            locModal.innerHTML = `
                <div class="order-modal-card" style="max-width:420px; text-align:left;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <h3 style="font-family:var(--font-serif-display); color:var(--color-title-sage);">Choose Your Location</h3>
                        <button type="button" id="locModalClose" style="font-size:1.4rem; color:#888; cursor:pointer;">&times;</button>
                    </div>
                    <p style="font-size:0.85rem; color:#666; margin-bottom:16px;">Select your delivery destination across India to see accurate shipping times and availability.</p>
                    <div class="form-group">
                        <label class="form-label" for="locPincodeInput">Enter Pincode</label>
                        <div style="display:flex; gap:8px;">
                            <input type="text" id="locPincodeInput" class="form-input" placeholder="e.g. 400001" maxlength="6">
                            <button type="button" id="btnApplyPincode" class="btn-filter-apply" style="width:auto; margin-top:0; padding:8px 16px;">Apply</button>
                        </div>
                    </div>
                    <div style="font-size:0.8rem; color:#888; margin-top:12px;">
                        Currently delivering nationwide across all major Indian cities with 3-5 day express delivery.
                    </div>
                </div>
            `;
            document.body.appendChild(locModal);

            locSelector.addEventListener('click', () => {
                locModal.classList.add('active');
            });

            const locClose = document.getElementById('locModalClose');
            if (locClose) locClose.addEventListener('click', () => locModal.classList.remove('active'));
            locModal.addEventListener('click', (e) => {
                if (e.target === locModal) locModal.classList.remove('active');
            });

            const btnApplyPin = document.getElementById('btnApplyPincode');
            const pinInput = document.getElementById('locPincodeInput');
            if (btnApplyPin && pinInput) {
                btnApplyPin.addEventListener('click', () => {
                    const pin = pinInput.value.trim();
                    if (pin.length >= 6) {
                        const locName = document.querySelector('.loc-name');
                        if (locName) locName.textContent = `India (${pin})`;
                        locModal.classList.remove('active');
                        if (window.YaschiCart && window.YaschiCart.showToast) {
                            window.YaschiCart.showToast(`Delivery location updated to PIN ${pin}`);
                        }
                    } else {
                        alert('Please enter a valid 6-digit PIN code.');
                    }
                });
            }
        }

        // =====================================================================
        // 5. SEARCH & DEPARTMENT REDIRECTION
        // =====================================================================
        const searchInput = document.getElementById('search');
        const searchButton = document.getElementById('searchButton');
        const searchCategory = document.getElementById('searchCategory');

        const urlParams = new URLSearchParams(window.location.search);
        const qCategory = urlParams.get('category');
        const qSearch = urlParams.get('search');

        if (searchCategory && qCategory) searchCategory.value = qCategory;
        if (searchInput && qSearch) searchInput.value = qSearch;

        function executeSearch() {
            const query = searchInput ? searchInput.value.trim() : '';
            const category = searchCategory ? searchCategory.value : 'all';

            const isShopPage = window.location.pathname.endsWith('shop.html');

            if (isShopPage && window.YaschiShop && typeof window.YaschiShop.applyFilters === 'function') {
                window.YaschiShop.applyFilters({ search: query, category: category });
            } else {
                const params = new URLSearchParams();
                if (query) params.set('search', query);
                if (category && category !== 'all') params.set('category', category);
                window.location.href = 'shop.html' + (params.toString() ? '?' + params.toString() : '');
            }
        }

        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                executeSearch();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    executeSearch();
                }
            });
        }

        // =====================================================================
        // 6. SMOOTH "BACK TO TOP"
        // =====================================================================
        const backToTopBtn = document.getElementById('backToTopBtn') || document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // =====================================================================
        // 7. SYNC BADGES
        // =====================================================================
        if (window.YaschiCart) window.YaschiCart.updateBadges();
        if (window.YaschiWishlist) window.YaschiWishlist.syncButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeader);
    } else {
        initHeader();
    }
})();
