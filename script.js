/**
 * Yaschi E-Commerce Homepage Interactions
 * Connects central API layer, renders featured products, handles hero video and quick interactions.
 */

document.addEventListener('DOMContentLoaded', async () => {

    // =========================================================================
    // 1. HERO VIDEO AUTOPLAY RESILIENCE
    // =========================================================================
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // Ensure video is properly muted for browsers' autoplay policies
        heroVideo.muted = true;
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('[Yaschi] Hero video autoplay waiting for user gesture:', error);
                document.addEventListener('click', () => {
                    heroVideo.play().catch(() => {});
                }, { once: true });
            });
        }
    }

    // Load Hero Settings if CMS changed them
    if (window.YaschiAPI) {
        try {
            const heroSettings = await window.YaschiAPI.getHeroSettings();
            if (heroSettings) {
                const titleEl = document.getElementById('heroTitle');
                const subEl = document.getElementById('heroSubtitle');
                const btnEl = document.getElementById('shopNowBtn');
                if (titleEl && heroSettings.title) titleEl.textContent = heroSettings.title;
                if (subEl && heroSettings.subtitle) subEl.textContent = heroSettings.subtitle;
                if (btnEl && heroSettings.buttonText) btnEl.textContent = heroSettings.buttonText;
            }
        } catch (e) {
            console.warn('[Yaschi] Could not load dynamic hero settings:', e);
        }
    }


    // =========================================================================
    // 2. DYNAMIC FEATURED PRODUCTS
    // =========================================================================
    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid && window.YaschiAPI) {
        try {
            let products = await window.YaschiAPI.getProducts({ featured: true });
            if (!products || products.length === 0) {
                products = await window.YaschiAPI.getProducts();
            }
            // Display top 8 items
            const displayProducts = products.slice(0, 8);

            featuredGrid.innerHTML = displayProducts.map(p => {
                const img = (p.images && p.images[0]) || 'assets_processed/dresses_1.jpg';
                const badgeHtml = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';
                const discountHtml = p.originalPrice > p.price 
                    ? `<span class="original-price">₹${p.originalPrice}</span><span class="discount-tag">${Math.round((1 - p.price/p.originalPrice)*100)}% off</span>` 
                    : '';

                return `
                    <div class="product-card" data-product-id="${p.id}">
                        <div class="product-card-thumb">
                            ${badgeHtml}
                            <button type="button" class="product-wishlist-btn" data-wishlist-id="${p.id}" aria-label="Add to wishlist" title="Add to Wishlist">
                                <i class="fa-regular fa-heart"></i>
                            </button>
                            <a href="product.html?id=${p.id}">
                                <img src="${img}" alt="${p.name}" loading="lazy">
                            </a>
                        </div>
                        <div class="product-card-body">
                            <span class="product-card-category">${p.category}</span>
                            <h3 class="product-card-title">
                                <a href="product.html?id=${p.id}">${p.name}</a>
                            </h3>
                            <div class="product-card-rating">
                                <i class="fa-solid fa-star"></i>
                                <span>${p.rating || '4.8'}</span>
                                <span class="review-count">(${p.reviewsCount || 42})</span>
                            </div>
                            <div class="product-card-price-row">
                                <span class="current-price">₹${p.price}</span>
                                ${discountHtml}
                            </div>
                            <button type="button" class="product-card-btn btn-quick-add" data-id="${p.id}">
                                <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            // Bind Wishlist buttons
            if (window.YaschiWishlist) {
                window.YaschiWishlist.syncButtons();
                featuredGrid.querySelectorAll('.product-wishlist-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const id = btn.getAttribute('data-wishlist-id');
                        const product = await window.YaschiAPI.getProductById(id);
                        if (product) {
                            window.YaschiWishlist.toggleItem(product);
                        }
                    });
                });
            }

            // Bind Quick Add to Bag buttons
            if (window.YaschiCart) {
                featuredGrid.querySelectorAll('.btn-quick-add').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const id = btn.getAttribute('data-id');
                        const product = await window.YaschiAPI.getProductById(id);
                        if (product) {
                            const defaultSize = (product.sizes && product.sizes[0]) || 'M';
                            window.YaschiCart.addItem(product, defaultSize, 1);
                        }
                    });
                });
            }

        } catch (err) {
            console.error('[Yaschi] Error rendering featured products:', err);
        }
    }


    // =========================================================================
    // 3. CATEGORY CARDS INTERACTION & SEARCH HIGHLIGHT
    // =========================================================================
    const searchInput = document.getElementById('search');
    const searchCategory = document.getElementById('searchCategory');
    const categoryCards = document.querySelectorAll('.category-card');

    function filterCategoryCards() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();
        const selectedDept = searchCategory ? searchCategory.value.toLowerCase() : 'all';

        categoryCards.forEach(card => {
            const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
            const cardTitle = (card.querySelector('.card-title')?.innerText || '').toLowerCase();

            const matchesText = query === '' || cardTitle.includes(query) || cardCategory.includes(query);
            const matchesDept = selectedDept === 'all' || cardCategory.includes(selectedDept) || selectedDept.includes(cardCategory);

            if (matchesText && matchesDept) {
                card.style.display = 'flex';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

            if (searchInput) searchInput.addEventListener('input', filterCategoryCards);
    if (searchCategory) searchCategory.addEventListener('change', filterCategoryCards);


    // =========================================================================
    // 4. DYNAMIC NEW ARRIVALS (LATEST GARDEN DROPS)
    // =========================================================================
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    if (newArrivalsGrid && window.YaschiAPI) {
        try {
            const allProducts = await window.YaschiAPI.getProducts();
            // Take 4 fresh items different from the top 8
            const newDrops = (allProducts && allProducts.length > 8) 
                ? allProducts.slice(8, 12) 
                : (allProducts || []).slice(0, 4);

            newArrivalsGrid.innerHTML = newDrops.map(p => {
                const img = (p.images && p.images[0]) || 'assets_processed/dresses_2.jpg';
                const discountHtml = p.originalPrice > p.price 
                    ? `<span class="original-price">₹${p.originalPrice}</span><span class="discount-tag">${Math.round((1 - p.price/p.originalPrice)*100)}% off</span>` 
                    : '';

                return `
                    <div class="product-card" data-product-id="${p.id}">
                        <div class="product-card-thumb">
                            <span class="product-badge" style="background:#5a7364;">Fresh Drop</span>
                            <button type="button" class="product-wishlist-btn" data-wishlist-id="${p.id}" aria-label="Add to wishlist" title="Add to Wishlist">
                                <i class="fa-regular fa-heart"></i>
                            </button>
                            <a href="product.html?id=${p.id}">
                                <img src="${img}" alt="${p.name}" loading="lazy">
                            </a>
                        </div>
                        <div class="product-card-body">
                            <span class="product-card-category">${p.category}</span>
                            <h3 class="product-card-title">
                                <a href="product.html?id=${p.id}">${p.name}</a>
                            </h3>
                            <div class="product-card-rating">
                                <i class="fa-solid fa-star"></i>
                                <span>${p.rating || '4.9'}</span>
                                <span class="review-count">(${p.reviewsCount || 24})</span>
                            </div>
                            <div class="product-card-price-row">
                                <span class="current-price">₹${p.price}</span>
                                ${discountHtml}
                            </div>
                            <button type="button" class="product-card-btn btn-quick-add" data-id="${p.id}">
                                <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            if (window.YaschiWishlist) {
                window.YaschiWishlist.syncButtons();
                newArrivalsGrid.querySelectorAll('.product-wishlist-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const id = btn.getAttribute('data-wishlist-id');
                        const prod = await window.YaschiAPI.getProductById(id);
                        if (prod) window.YaschiWishlist.toggleItem(prod);
                    });
                });
            }

            if (window.YaschiCart) {
                newArrivalsGrid.querySelectorAll('.btn-quick-add').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const id = btn.getAttribute('data-id');
                        const prod = await window.YaschiAPI.getProductById(id);
                        if (prod) {
                            const defaultSize = (prod.sizes && prod.sizes[0]) || 'M';
                            window.YaschiCart.addItem(prod, defaultSize, 1);
                        }
                    });
                });
            }
        } catch (err) {
            console.error('[Yaschi] Error rendering new arrivals:', err);
        }
    }


    // =========================================================================
    // 5. VIP SISTERHOOD NEWSLETTER SUBSCRIPTION
    // =========================================================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput ? emailInput.value.trim() : '';
            if (email) {
                const subscribers = JSON.parse(localStorage.getItem('yaschi_vip_subscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('yaschi_vip_subscribers', JSON.stringify(subscribers));
                }
                if (window.YaschiCart && window.YaschiCart.showToast) {
                    window.YaschiCart.showToast('Welcome to the Yaschi Sisterhood! Use code YASCHI10 for 10% off.');
                }
                newsletterForm.reset();
            }
        });
    }
});

