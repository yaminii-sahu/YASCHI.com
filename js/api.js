/**
 * Yaschi E-Commerce — Central Unified API Layer
 * Seamlessly integrates Express REST API (/api/*) and Supabase with seeded localStorage fallback.
 */

const STORAGE_KEYS = {
    PRODUCTS: 'yaschi_products_v2',
    CATEGORIES: 'yaschi_categories_v2',
    HERO: 'yaschi_hero_settings_v2',
    ORDERS: 'yaschi_orders_v2'
};

const YaschiAPI = {
    /**
     * Ensure storage is seeded on first initialization
     */
    init: function() {
        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(window.INITIAL_PRODUCTS || []));
        }
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(window.INITIAL_CATEGORIES || []));
        }
        if (!localStorage.getItem(STORAGE_KEYS.HERO)) {
            localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(window.INITIAL_HERO_SETTINGS || {}));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
        }
    },

    /**
     * Check if running under HTTP/HTTPS server (can reach /api/*)
     */
    isHttp: function() {
        return typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http');
    },

    /**
     * Get all categories
     */
    getCategories: async function() {
        // 1. Try Express backend
        if (this.isHttp()) {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.categories) && data.categories.length > 0) {
                        return data.categories;
                    }
                }
            } catch (e) {}
        }

        // 2. Try Supabase
        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client) {
            try {
                const { data, error } = await client.from('categories').select('*').order('name');
                if (!error && data && data.length > 0) return data;
            } catch (err) {
                console.warn('[Yaschi API] Supabase categories fetch failed, using fallback:', err);
            }
        }

        // 3. Fallback to localStorage
        const local = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        return local ? JSON.parse(local) : (window.INITIAL_CATEGORIES || []);
    },

    /**
     * Get products with filtering, search, and sorting
     */
    getProducts: async function(filter = {}) {
        // 1. Try Express backend
        if (this.isHttp()) {
            try {
                const params = new URLSearchParams();
                if (filter.category && filter.category !== 'all') params.set('category', filter.category);
                if (filter.search) params.set('search', filter.search);
                if (filter.sort) params.set('sort', filter.sort);
                if (filter.minPrice !== undefined && filter.minPrice !== '') params.set('minPrice', filter.minPrice);
                if (filter.maxPrice !== undefined && filter.maxPrice !== '') params.set('maxPrice', filter.maxPrice);
                if (filter.featured) params.set('featured', 'true');

                const res = await fetch('/api/products' + (params.toString() ? '?' + params.toString() : ''));
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.products) && data.products.length > 0) {
                        return data.products;
                    }
                }
            } catch (e) {}
        }

        let products = [];

        // 2. Try Supabase
        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client) {
            try {
                const { data, error } = await client.from('products').select('*');
                if (!error && data && data.length > 0) {
                    products = data;
                }
            } catch (err) {
                console.warn('[Yaschi API] Supabase products fetch failed, using fallback:', err);
            }
        }

        // 3. Fallback to localStorage
        if (products.length === 0) {
            const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
            products = local ? JSON.parse(local) : (window.INITIAL_PRODUCTS || []);
        }

        // Apply filters
        if (filter.category && filter.category !== 'all') {
            products = products.filter(p => p.category && p.category.toLowerCase() === filter.category.toLowerCase());
        }

        if (filter.search) {
            const term = filter.search.trim().toLowerCase();
            products = products.filter(p => 
                (p.name && p.name.toLowerCase().includes(term)) ||
                (p.description && p.description.toLowerCase().includes(term)) ||
                (p.category && p.category.toLowerCase().includes(term)) ||
                (p.badge && p.badge.toLowerCase().includes(term))
            );
        }

        if (filter.featured) {
            products = products.filter(p => p.featured === true);
        }

        if (filter.minPrice !== undefined && filter.minPrice !== null && filter.minPrice !== '') {
            products = products.filter(p => p.price >= Number(filter.minPrice));
        }

        if (filter.maxPrice !== undefined && filter.maxPrice !== null && filter.maxPrice !== '') {
            products = products.filter(p => p.price <= Number(filter.maxPrice));
        }

        // Sorting
        if (filter.sort) {
            switch (filter.sort) {
                case 'price-low':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                case 'newest':
                    products.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
                    break;
                case 'discount':
                    products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                    break;
                case 'featured':
                default:
                    products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                    break;
            }
        }

        return products;
    },

    /**
     * Get a single product by ID
     */
    getProductById: async function(id) {
        if (!id) return null;

        // 1. Try Express backend
        if (this.isHttp()) {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.product) return data.product;
                }
            } catch (e) {}
        }

        // 2. Fallback to getProducts
        const products = await this.getProducts();
        return products.find(p => String(p.id) === String(id)) || null;
    },

    /**
     * Get a single product by slug
     */
    getProductBySlug: async function(slug) {
        if (!slug) return null;
        const products = await this.getProducts();
        return products.find(p => p.slug === slug) || null;
    },

    /**
     * Save product (Create or Update)
     */
    saveProduct: async function(productData) {
        let savedProduct = null;

        // 1. Try Express backend
        if (this.isHttp()) {
            try {
                const isUpdate = Boolean(productData.id);
                const url = isUpdate ? `/api/products/${productData.id}` : '/api/products';
                const method = isUpdate ? 'PUT' : 'POST';
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.product) savedProduct = data.product;
                }
            } catch (e) {}
        }

        // 2. Persist in localStorage
        const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        let products = local ? JSON.parse(local) : (window.INITIAL_PRODUCTS || []);
        
        if (productData.id) {
            const index = products.findIndex(p => String(p.id) === String(productData.id));
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
                if (!savedProduct) savedProduct = products[index];
            } else {
                if (!savedProduct) savedProduct = { ...productData };
                products.push(savedProduct);
            }
        } else {
            if (!savedProduct) {
                savedProduct = {
                    ...productData,
                    id: 'prod_' + Date.now(),
                    slug: (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                };
            }
            products.unshift(savedProduct);
        }

        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

        // 3. Sync to Supabase if connected
        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client && savedProduct) {
            try {
                await client.from('products').upsert([savedProduct]);
            } catch (err) {
                console.warn('[Yaschi API] Supabase product upsert failed:', err);
            }
        }

        return savedProduct;
    },

    /**
     * Delete product by ID
     */
    deleteProduct: async function(id) {
        if (this.isHttp()) {
            try {
                await fetch(`/api/products/${id}`, { method: 'DELETE' });
            } catch (e) {}
        }

        const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        let products = local ? JSON.parse(local) : [];
        products = products.filter(p => String(p.id) !== String(id));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client) {
            try {
                await client.from('products').delete().eq('id', id);
            } catch (err) {
                console.warn('[Yaschi API] Supabase product delete failed:', err);
            }
        }
        return true;
    },

    /**
     * Get Hero settings
     */
    getHeroSettings: async function() {
        if (this.isHttp()) {
            try {
                const res = await fetch('/api/settings/hero');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.settings) return data.settings;
                }
            } catch (e) {}
        }

        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client) {
            try {
                const { data, error } = await client.from('hero_settings').select('*').limit(1).single();
                if (!error && data) return data;
            } catch (err) {
                console.warn('[Yaschi API] Supabase hero fetch failed:', err);
            }
        }
        const local = localStorage.getItem(STORAGE_KEYS.HERO);
        return local ? JSON.parse(local) : (window.INITIAL_HERO_SETTINGS || {});
    },

    /**
     * Save Hero settings
     */
    saveHeroSettings: async function(settings) {
        if (this.isHttp()) {
            try {
                await fetch('/api/settings/hero', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                });
            } catch (e) {}
        }

        localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(settings));
        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client) {
            try {
                await client.from('hero_settings').upsert([{ id: 1, ...settings }]);
            } catch (err) {
                console.warn('[Yaschi API] Supabase hero upsert failed:', err);
            }
        }
        return settings;
    },

    /**
     * Create an order
     */
    createOrder: async function(orderData) {
        const order = {
            id: 'YAS-' + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toISOString(),
            status: 'Processing',
            ...orderData
        };

        if (this.isHttp()) {
            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(order)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.order) return data.order;
                }
            } catch (e) {}
        }

        const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
        const orders = local ? JSON.parse(local) : [];
        orders.unshift(order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client) {
            try {
                await client.from('orders').insert([order]);
            } catch (err) {
                console.warn('[Yaschi API] Supabase order insert failed:', err);
            }
        }

        return order;
    },

    /**
     * Get all orders
     */
    getOrders: async function() {
        if (this.isHttp()) {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.orders)) return data.orders;
                }
            } catch (e) {}
        }

        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (client) {
            try {
                const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
                if (!error && data && data.length > 0) return data;
            } catch (err) {
                console.warn('[Yaschi API] Supabase orders fetch failed:', err);
            }
        }
        const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
        return local ? JSON.parse(local) : [];
    },

    /**
     * Push all local catalog to Supabase (helper for Admin)
     */
    syncLocalToSupabase: async function() {
        const client = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (!client) throw new Error('Supabase client is not configured');

        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
        const hero = JSON.parse(localStorage.getItem(STORAGE_KEYS.HERO) || '{}');

        if (categories.length > 0) {
            await client.from('categories').upsert(categories);
        }
        if (products.length > 0) {
            await client.from('products').upsert(products);
        }
        if (hero.title) {
            await client.from('hero_settings').upsert([{ id: 1, ...hero }]);
        }

        return { success: true, count: products.length };
    },

    /**
     * Reset catalog to initial defaults
     */
    resetCatalog: function() {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(window.INITIAL_PRODUCTS || []));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(window.INITIAL_CATEGORIES || []));
        localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(window.INITIAL_HERO_SETTINGS || {}));
        return true;
    }
};

// Initialize right away
YaschiAPI.init();
window.YaschiAPI = YaschiAPI;
