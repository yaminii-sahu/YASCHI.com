/**
 * Yaschi E-Commerce — Wishlist Manager
 * Handles local persistence, toggle states, and visual sync of heart icons.
 */

const WISHLIST_STORAGE_KEY = 'yaschi_wishlist_v2';

const YaschiWishlist = {
    /**
     * Get all wishlist items (array of IDs or objects)
     */
    getItems: function() {
        try {
            const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Save wishlist items
     */
    saveItems: function(items) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        this.syncButtons();
        this.updateBadge();
        window.dispatchEvent(new CustomEvent('yaschi:wishlist-updated', { detail: { items } }));
    },

    /**
     * Update wishlist badge counters
     */
    updateBadge: function() {
        const items = this.getItems();
        const count = items.length;
        const badges = document.querySelectorAll('#wishlist-count, .wishlist-badge');
        badges.forEach(b => {
            b.textContent = count;
            b.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    },

    /**
     * Check if a product is in wishlist
     */
    hasItem: function(productId) {
        const items = this.getItems();
        return items.some(item => item.id === productId);
    },

    /**
     * Toggle wishlist for a product
     */
    toggleItem: function(product) {
        if (!product || !product.id) return;
        let items = this.getItems();
        const index = items.findIndex(item => item.id === product.id);

        if (index > -1) {
            items.splice(index, 1);
            this.saveItems(items);
            if (window.YaschiCart && window.YaschiCart.showToast) {
                window.YaschiCart.showToast(`Removed "${product.name}" from wishlist`, 'info');
            }
            return false;
        } else {
            items.push({
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category,
                price: Number(product.price),
                originalPrice: Number(product.originalPrice || product.price),
                image: (product.images && product.images[0]) || 'assets_processed/dresses_1.jpg',
                badge: product.badge || ''
            });
            this.saveItems(items);
            if (window.YaschiCart && window.YaschiCart.showToast) {
                window.YaschiCart.showToast(`Saved "${product.name}" to wishlist ♡`);
            }
            return true;
        }
    },

    /**
     * Remove item by ID
     */
    removeItem: function(productId) {
        let items = this.getItems();
        items = items.filter(item => item.id !== productId);
        this.saveItems(items);
    },

    /**
     * Sync heart buttons on the page with current wishlist status
     */
    syncButtons: function() {
        const items = this.getItems();
        const ids = new Set(items.map(item => item.id));

        const heartBtns = document.querySelectorAll('[data-wishlist-id]');
        heartBtns.forEach(btn => {
            const id = btn.getAttribute('data-wishlist-id');
            const icon = btn.querySelector('i');
            if (ids.has(id)) {
                btn.classList.add('active');
                if (icon) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');
                }
            } else {
                btn.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');
                }
            }
        });
    }
};

window.YaschiWishlist = YaschiWishlist;
document.addEventListener('DOMContentLoaded', () => {
    YaschiWishlist.syncButtons();
    YaschiWishlist.updateBadge();
});
