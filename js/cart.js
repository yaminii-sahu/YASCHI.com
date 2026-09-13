/**
 * Yaschi E-Commerce — Shopping Cart Manager
 * Handles local persistence, item updates, quantity calculations, and header badge sync.
 */

const CART_STORAGE_KEY = 'yaschi_shopping_cart_v2';

const YaschiCart = {
    /**
     * Get all cart items
     */
    getItems: function() {
        try {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Save items to localStorage and update badges
     */
    saveItems: function(items) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        this.updateBadges();
        window.dispatchEvent(new CustomEvent('yaschi:cart-updated', { detail: { items } }));
    },

    /**
     * Add product to cart
     */
    addItem: function(product, size = 'M', quantity = 1) {
        if (!product || !product.id) return;
        const items = this.getItems();
        const existingIndex = items.findIndex(item => item.id === product.id && item.size === size);

        if (existingIndex > -1) {
            items[existingIndex].quantity += Number(quantity);
        } else {
            items.push({
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category,
                price: Number(product.price),
                originalPrice: Number(product.originalPrice || product.price),
                image: (product.images && product.images[0]) || 'assets_processed/dresses_1.jpg',
                size: size,
                quantity: Number(quantity)
            });
        }

        this.saveItems(items);
        this.showToast(`Added "${product.name}" (${size}) to your bag!`);
    },

    /**
     * Update quantity of an item
     */
    updateQuantity: function(productId, size, quantity) {
        let items = this.getItems();
        const targetIndex = items.findIndex(item => item.id === productId && item.size === size);

        if (targetIndex > -1) {
            const newQty = Number(quantity);
            if (newQty <= 0) {
                items.splice(targetIndex, 1);
            } else {
                items[targetIndex].quantity = newQty;
            }
            this.saveItems(items);
        }
    },

    /**
     * Remove item completely
     */
    removeItem: function(productId, size) {
        let items = this.getItems();
        items = items.filter(item => !(item.id === productId && item.size === size));
        this.saveItems(items);
        this.showToast('Item removed from cart');
    },

    /**
     * Clear the cart
     */
    clear: function() {
        localStorage.removeItem(CART_STORAGE_KEY);
        this.updateBadges();
        window.dispatchEvent(new CustomEvent('yaschi:cart-updated', { detail: { items: [] } }));
    },

    /**
     * Get total count of items in cart
     */
    getItemCount: function() {
        const items = this.getItems();
        return items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
    },

    /**
     * Get subtotal amount
     */
    getSubtotal: function() {
        const items = this.getItems();
        return items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    },

    /**
     * Update header cart badge across pages
     */
    updateBadges: function() {
        const count = this.getItemCount();
        const badges = document.querySelectorAll('#cart-count, .cart-badge');
        badges.forEach(b => {
            b.textContent = count;
            b.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    /**
     * Elegant bottom-right feedback toast
     */
    showToast: function(message, type = 'success') {
        let toast = document.getElementById('yaschiToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'yaschiToast';
            toast.className = 'yaschi-toast';
            document.body.appendChild(toast);
        }

        const iconHtml = type === 'success' 
            ? '<i class="fa-solid fa-circle-check" style="color:#758b7e;"></i>' 
            : '<i class="fa-solid fa-circle-info" style="color:#d8b4b6;"></i>';

        toast.innerHTML = `
            <div class="toast-content">
                ${iconHtml}
                <span>${message}</span>
            </div>
            <a href="cart.html" class="toast-link">View Bag &rarr;</a>
        `;
        toast.classList.add('show');

        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
};

// Global export & auto-badge update on DOM ready
window.YaschiCart = YaschiCart;
document.addEventListener('DOMContentLoaded', () => {
    YaschiCart.updateBadges();
});
