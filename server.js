const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const { db, hashPassword, verifyPassword } = require('./db.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname)));

// Helper to parse JSON fields safely from SQLite
function formatProduct(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        category: row.category,
        price: row.price,
        originalPrice: row.original_price,
        discount: row.discount || (row.original_price > row.price ? Math.round((1 - row.price / row.original_price) * 100) : 0),
        description: row.description,
        images: JSON.parse(row.images || '[]'),
        videoUrl: row.video_url,
        sizes: JSON.parse(row.sizes || '["One Size"]'),
        colors: JSON.parse(row.colors || '["Blush"]'),
        stock: row.stock,
        rating: row.rating,
        reviewsCount: row.reviews_count,
        badge: row.badge,
        featured: Boolean(row.featured),
        details: JSON.parse(row.details || '{}'),
        sellerId: row.seller_id,
        isPublished: Boolean(row.is_published),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

// Session helper
function getSessionId(req) {
    return req.headers['x-session-id'] || req.query.sessionId || 'guest_default_session';
}

// ============================================================================
// 1. PRODUCTS API
// ============================================================================

// GET /api/products
app.get('/api/products', (req, res) => {
    try {
        let sql = 'SELECT * FROM products WHERE is_published = 1';
        const params = [];

        const { category, search, sort, minPrice, maxPrice, featured, deals } = req.query;

        if (category && category.toLowerCase() !== 'all') {
            sql += ' AND LOWER(category) = LOWER(?)';
            params.push(category.trim());
        }

        if (search && search.trim()) {
            const term = `%${search.trim().toLowerCase()}%`;
            sql += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ? OR LOWER(badge) LIKE ?)';
            params.push(term, term, term, term);
        }

        if (featured === 'true' || featured === '1') {
            sql += ' AND featured = 1';
        }

        if (deals === 'true' || deals === '1') {
            sql += ' AND original_price > price';
        }

        if (minPrice !== undefined && minPrice !== '') {
            sql += ' AND price >= ?';
            params.push(Number(minPrice));
        }

        if (maxPrice !== undefined && maxPrice !== '') {
            sql += ' AND price <= ?';
            params.push(Number(maxPrice));
        }

        // Sorting
        switch (sort) {
            case 'price-asc':
            case 'price-low':
                sql += ' ORDER BY price ASC';
                break;
            case 'price-desc':
            case 'price-high':
                sql += ' ORDER BY price DESC';
                break;
            case 'rating':
                sql += ' ORDER BY rating DESC';
                break;
            case 'newest':
                sql += ' ORDER BY created_at DESC';
                break;
            case 'discount':
                sql += ' ORDER BY (original_price - price) DESC';
                break;
            case 'featured':
            default:
                sql += ' ORDER BY featured DESC, id ASC';
                break;
        }

        const rows = db.prepare(sql).all(...params);
        res.json({
            success: true,
            count: rows.length,
            data: rows.map(formatProduct)
        });
    } catch (err) {
        console.error('[API Products Error]:', err);
        res.status(500).json({ success: false, error: 'Internal server error fetching products' });
    }
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        const row = db.prepare('SELECT * FROM products WHERE id = ? OR slug = ?').get(id, id);
        if (!row) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, data: formatProduct(row) });
    } catch (err) {
        console.error('[API Product Detail Error]:', err);
        res.status(500).json({ success: false, error: 'Internal server error fetching product' });
    }
});

// POST /api/products (Admin or Seller product creation)
app.post('/api/products', (req, res) => {
    try {
        const {
            name, category, price, originalPrice, discount, description,
            images, sizes, colors, stock, badge, featured, details, sellerId
        } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ success: false, error: 'Name, category, and price are required' });
        }

        const id = req.body.id || `prod-${Date.now()}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || id;

        db.prepare(`
            INSERT INTO products (
                id, name, slug, category, price, original_price, discount,
                description, images, sizes, colors, stock, rating, reviews_count,
                badge, featured, details, seller_id, is_published, created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, 5.0, 1,
                ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
        `).run(
            id,
            name.trim(),
            slug,
            category.trim().toLowerCase(),
            Number(price),
            originalPrice ? Number(originalPrice) : Number(price),
            discount ? Number(discount) : 0,
            description || '',
            JSON.stringify(Array.isArray(images) && images.length ? images : ['assets_processed/dresses_1.jpg']),
            JSON.stringify(Array.isArray(sizes) && sizes.length ? sizes : ['One Size']),
            JSON.stringify(Array.isArray(colors) && colors.length ? colors : ['Blush']),
            stock !== undefined ? Number(stock) : 10,
            badge || '',
            featured ? 1 : 0,
            JSON.stringify(details || {}),
            sellerId || null
        );

        const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        res.status(201).json({ success: true, data: formatProduct(created) });
    } catch (err) {
        console.error('[API Create Product Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to create product: ' + err.message });
    }
});

// PUT /api/products/:id
app.put('/api/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const {
            name, category, price, originalPrice, discount, description,
            images, sizes, stock, badge, featured, details
        } = req.body;

        db.prepare(`
            UPDATE products SET
                name = COALESCE(?, name),
                category = COALESCE(?, category),
                price = COALESCE(?, price),
                original_price = COALESCE(?, original_price),
                discount = COALESCE(?, discount),
                description = COALESCE(?, description),
                images = COALESCE(?, images),
                sizes = COALESCE(?, sizes),
                stock = COALESCE(?, stock),
                badge = COALESCE(?, badge),
                featured = COALESCE(?, featured),
                details = COALESCE(?, details),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            name ? name.trim() : null,
            category ? category.trim().toLowerCase() : null,
            price !== undefined ? Number(price) : null,
            originalPrice !== undefined ? Number(originalPrice) : null,
            discount !== undefined ? Number(discount) : null,
            description !== undefined ? description : null,
            images ? JSON.stringify(images) : null,
            sizes ? JSON.stringify(sizes) : null,
            stock !== undefined ? Number(stock) : null,
            badge !== undefined ? badge : null,
            featured !== undefined ? (featured ? 1 : 0) : null,
            details ? JSON.stringify(details) : null,
            id
        );

        const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        res.json({ success: true, data: formatProduct(updated) });
    } catch (err) {
        console.error('[API Update Product Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully', id });
    } catch (err) {
        console.error('[API Delete Product Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
});

// ============================================================================
// 2. CATEGORIES API
// ============================================================================

// GET /api/categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = db.prepare(`
            SELECT c.*, COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON LOWER(p.category) = LOWER(c.id) AND p.is_published = 1
            GROUP BY c.id
            ORDER BY c.display_order ASC
        `).all();

        res.json({ success: true, data: categories });
    } catch (err) {
        console.error('[API Categories Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
});

// GET /api/categories/:category/products
app.get('/api/categories/:category/products', (req, res) => {
    try {
        const { category } = req.params;
        const rows = db.prepare(`
            SELECT * FROM products
            WHERE is_published = 1 AND LOWER(category) = LOWER(?)
            ORDER BY id ASC
        `).all(category);

        res.json({ success: true, count: rows.length, data: rows.map(formatProduct) });
    } catch (err) {
        console.error('[API Category Products Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch category products' });
    }
});

// ============================================================================
// 3. CART API
// ============================================================================

// GET /api/cart
app.get('/api/cart', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const rows = db.prepare(`
            SELECT ci.id as cart_item_id, ci.size, ci.quantity, ci.custom_attributes,
                   p.*
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.session_id = ?
            ORDER BY ci.created_at DESC
        `).all(sessionId);

        const items = rows.map(r => ({
            id: r.id,
            cartItemId: r.cart_item_id,
            name: r.name,
            price: r.price,
            originalPrice: r.original_price,
            size: r.size,
            quantity: r.quantity,
            image: JSON.parse(r.images || '[]')[0] || 'assets_processed/dresses_1.jpg',
            customAttributes: JSON.parse(r.custom_attributes || '{}')
        }));

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const count = items.reduce((sum, item) => sum + item.quantity, 0);

        res.json({
            success: true,
            data: {
                sessionId,
                items,
                subtotal,
                count,
                freeShippingThreshold: 999,
                isFreeShipping: subtotal >= 999
            }
        });
    } catch (err) {
        console.error('[API Get Cart Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve cart' });
    }
});

// POST /api/cart
app.post('/api/cart', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const { productId, size = 'One Size', quantity = 1, customAttributes = {} } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID is required' });
        }

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const existing = db.prepare(`
            SELECT * FROM cart_items WHERE session_id = ? AND product_id = ? AND size = ?
        `).get(sessionId, productId, size);

        if (existing) {
            const newQty = existing.quantity + Number(quantity);
            db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
        } else {
            const id = `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            db.prepare(`
                INSERT INTO cart_items (id, session_id, product_id, size, quantity, custom_attributes)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(id, sessionId, productId, size, Number(quantity), JSON.stringify(customAttributes));
        }

        res.status(201).json({ success: true, message: 'Item added to bag' });
    } catch (err) {
        console.error('[API Add Cart Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to add item to cart' });
    }
});

// PUT /api/cart/:cartItemId
app.put('/api/cart/:cartItemId', (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        if (quantity <= 0) {
            db.prepare('DELETE FROM cart_items WHERE id = ?').run(cartItemId);
        } else {
            db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(Number(quantity), cartItemId);
        }

        res.json({ success: true, message: 'Cart updated' });
    } catch (err) {
        console.error('[API Update Cart Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to update cart' });
    }
});

// DELETE /api/cart/:cartItemId
app.delete('/api/cart/:cartItemId', (req, res) => {
    try {
        const { cartItemId } = req.params;
        db.prepare('DELETE FROM cart_items WHERE id = ?').run(cartItemId);
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
        console.error('[API Delete Cart Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to remove cart item' });
    }
});

// DELETE /api/cart (Clear all)
app.delete('/api/cart', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
        res.json({ success: true, message: 'Shopping bag cleared' });
    } catch (err) {
        console.error('[API Clear Cart Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to clear cart' });
    }
});

// ============================================================================
// 4. WISHLIST API
// ============================================================================

// GET /api/wishlist
app.get('/api/wishlist', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const rows = db.prepare(`
            SELECT wi.id as wishlist_id, p.*
            FROM wishlist_items wi
            JOIN products p ON wi.product_id = p.id
            WHERE wi.session_id = ?
            ORDER BY wi.created_at DESC
        `).all(sessionId);

        res.json({
            success: true,
            count: rows.length,
            data: rows.map(formatProduct)
        });
    } catch (err) {
        console.error('[API Get Wishlist Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to get wishlist' });
    }
});

// POST /api/wishlist (toggle)
app.post('/api/wishlist', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID required' });
        }

        const existing = db.prepare(`
            SELECT * FROM wishlist_items WHERE session_id = ? AND product_id = ?
        `).get(sessionId, productId);

        if (existing) {
            db.prepare('DELETE FROM wishlist_items WHERE id = ?').run(existing.id);
            return res.json({ success: true, action: 'removed', inWishlist: false });
        } else {
            const id = `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            db.prepare('INSERT INTO wishlist_items (id, session_id, product_id) VALUES (?, ?, ?)').run(id, sessionId, productId);
            return res.status(201).json({ success: true, action: 'added', inWishlist: true });
        }
    } catch (err) {
        console.error('[API Wishlist Toggle Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to update wishlist' });
    }
});

// DELETE /api/wishlist/:productId
app.delete('/api/wishlist/:productId', (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const { productId } = req.params;
        db.prepare('DELETE FROM wishlist_items WHERE session_id = ? AND product_id = ?').run(sessionId, productId);
        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (err) {
        console.error('[API Wishlist Remove Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
    }
});

// ============================================================================
// 5. USERS & AUTH API
// ============================================================================

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
        if (existing) {
            return res.status(409).json({ success: false, error: 'An account with this email already exists' });
        }

        const id = `user-${Date.now()}`;
        const passHash = hashPassword(password);
        db.prepare(`
            INSERT INTO users (id, name, email, password_hash, role)
            VALUES (?, ?, ?, ?, 'customer')
        `).run(id, name.trim(), cleanEmail, passHash);

        const token = crypto.randomBytes(32).toString('hex');
        res.status(201).json({
            success: true,
            data: { id, name: name.trim(), email: cleanEmail, role: 'customer' },
            token
        });
    } catch (err) {
        console.error('[API Register Error]:', err);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
        if (!user || !verifyPassword(password, user.password_hash)) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        res.json({
            success: true,
            data: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (err) {
        console.error('[API Login Error]:', err);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

// ============================================================================
// 6. ORDERS API
// ============================================================================

// POST /api/orders
app.post('/api/orders', (req, res) => {
    try {
        const {
            customer, items, subtotal, shipping = 0, discount = 0, total,
            paymentMethod = 'COD', notes = ''
        } = req.body;

        if (!customer || !customer.email || !customer.name) {
            return res.status(400).json({ success: false, error: 'Customer contact information is required' });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
        }

        const orderId = `YAS-${Date.now().toString().slice(-6)}`;
        const calcSubtotal = Number(subtotal) || items.reduce((s, i) => s + (Number(i.price) * Number(i.quantity)), 0);
        const calcShipping = Number(shipping);
        const calcTotal = Number(total) || (calcSubtotal + calcShipping - Number(discount));

        db.prepare(`
            INSERT INTO orders (
                id, customer_name, customer_email, customer_phone,
                shipping_address, subtotal, shipping_cost, discount_amount,
                total, payment_method, payment_status, order_status, notes
            ) VALUES (
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, 'Processing', ?
            )
        `).run(
            orderId,
            customer.name,
            customer.email.toLowerCase(),
            customer.phone || '',
            JSON.stringify(customer),
            calcSubtotal,
            calcShipping,
            Number(discount),
            calcTotal,
            paymentMethod.toUpperCase(),
            paymentMethod.toUpperCase() === 'COD' ? 'Pending' : 'Completed',
            notes
        );

        // Insert order items
        const insertItem = db.prepare(`
            INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, size, image_url, custom_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        items.forEach(item => {
            const itemId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            insertItem.run(
                itemId,
                orderId,
                item.id,
                item.name,
                Number(item.price),
                Number(item.quantity) || 1,
                item.size || 'One Size',
                item.image || '',
                JSON.stringify(item.customAttributes || {})
            );
        });

        res.status(201).json({
            success: true,
            data: {
                id: orderId,
                total: calcTotal,
                paymentMethod: paymentMethod.toUpperCase(),
                estimatedDelivery: '3 - 5 Business Days',
                customerName: customer.name
            }
        });
    } catch (err) {
        console.error('[API Create Order Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to place order: ' + err.message });
    }
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
    try {
        const { email } = req.query;
        let sql = 'SELECT * FROM orders';
        const params = [];

        if (email) {
            sql += ' WHERE LOWER(customer_email) = LOWER(?)';
            params.push(email.trim());
        }

        sql += ' ORDER BY created_at DESC';

        const orders = db.prepare(sql).all(...params);

        const fullOrders = orders.map(o => {
            const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
            return {
                id: o.id,
                customer: JSON.parse(o.shipping_address || '{}'),
                subtotal: o.subtotal,
                shipping: o.shipping_cost,
                discount: o.discount_amount,
                total: o.total,
                paymentMethod: o.payment_method,
                paymentStatus: o.payment_status,
                orderStatus: o.order_status,
                createdAt: o.created_at,
                items: items.map(i => ({
                    id: i.product_id,
                    name: i.product_name,
                    price: i.price,
                    quantity: i.quantity,
                    size: i.size,
                    image: i.image_url,
                    customData: JSON.parse(i.custom_data || '{}')
                }))
            };
        });

        res.json({ success: true, count: fullOrders.length, data: fullOrders });
    } catch (err) {
        console.error('[API Get Orders Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});

// ============================================================================
// 7. GIFT CARDS API
// ============================================================================

// POST /api/gift-cards
app.post('/api/gift-cards', (req, res) => {
    try {
        const { amount, designTheme, recipientName, recipientEmail, senderName, message, deliveryDate } = req.body;

        if (!amount || Number(amount) < 500) {
            return res.status(400).json({ success: false, error: 'Minimum gift card value is ₹500' });
        }
        if (!recipientName || !recipientEmail || !senderName) {
            return res.status(400).json({ success: false, error: 'Recipient name, email, and sender name are required' });
        }

        const id = `gc-${Date.now()}`;
        const code = `YASCHI-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        db.prepare(`
            INSERT INTO gift_cards (
                id, code, balance, initial_amount, design_theme,
                recipient_name, recipient_email, sender_name, message, delivery_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            code,
            Number(amount),
            Number(amount),
            designTheme || 'blush',
            recipientName.trim(),
            recipientEmail.trim().toLowerCase(),
            senderName.trim(),
            message || '',
            deliveryDate || new Date().toISOString().split('T')[0]
        );

        res.status(201).json({
            success: true,
            data: {
                id,
                code,
                amount: Number(amount),
                designTheme,
                recipientName,
                recipientEmail,
                senderName
            }
        });
    } catch (err) {
        console.error('[API Create Gift Card Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to create gift card' });
    }
});

// GET /api/gift-cards/:code
app.get('/api/gift-cards/:code', (req, res) => {
    try {
        const { code } = req.params;
        const card = db.prepare('SELECT * FROM gift_cards WHERE code = ?').get(code.toUpperCase().trim());
        if (!card) {
            return res.status(404).json({ success: false, error: 'Invalid gift card code' });
        }
        res.json({
            success: true,
            data: {
                code: card.code,
                balance: card.balance,
                designTheme: card.design_theme,
                recipientName: card.recipient_name,
                status: card.status
            }
        });
    } catch (err) {
        console.error('[API Validate Gift Card Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to validate gift card' });
    }
});

// ============================================================================
// 8. SELLER & ARTISAN PORTAL API
// ============================================================================

// POST /api/seller/register
app.post('/api/seller/register', (req, res) => {
    try {
        const { brandName, founderName, email, phone, category, bio, portfolioUrl } = req.body;

        if (!brandName || !founderName || !email || !category) {
            return res.status(400).json({ success: false, error: 'Brand name, founder name, email, and department are required' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const existing = db.prepare('SELECT * FROM sellers WHERE email = ?').get(cleanEmail);

        if (existing) {
            return res.status(409).json({ success: false, error: 'A seller atelier with this email is already registered' });
        }

        const id = `seller-${Date.now()}`;
        db.prepare(`
            INSERT INTO sellers (
                id, brand_name, founder_name, email, phone,
                portfolio_url, category, bio, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `).run(
            id,
            brandName.trim(),
            founderName.trim(),
            cleanEmail,
            phone || '',
            portfolioUrl || '',
            category.trim().toLowerCase(),
            bio || ''
        );

        res.status(201).json({
            success: true,
            data: {
                id,
                brandName: brandName.trim(),
                founderName: founderName.trim(),
                email: cleanEmail,
                category: category.trim().toLowerCase()
            }
        });
    } catch (err) {
        console.error('[API Seller Register Error]:', err);
        res.status(500).json({ success: false, error: 'Seller registration failed: ' + err.message });
    }
});

// GET /api/seller/products
app.get('/api/seller/products', (req, res) => {
    try {
        const { sellerId } = req.query;
        let sql = 'SELECT * FROM products';
        const params = [];

        if (sellerId) {
            sql += ' WHERE seller_id = ?';
            params.push(sellerId);
        }

        sql += ' ORDER BY created_at DESC';
        const rows = db.prepare(sql).all(...params);

        res.json({ success: true, count: rows.length, data: rows.map(formatProduct) });
    } catch (err) {
        console.error('[API Seller Products Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch seller products' });
    }
});

// POST /api/seller/products (Artisan adds product directly)
app.post('/api/seller/products', (req, res) => {
    try {
        const {
            name, category, price, originalPrice, discount,
            description, images, sizes, stock, details, sellerId
        } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ success: false, error: 'Title, category, and price are required' });
        }

        const id = `artisan-${Date.now()}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || id;

        db.prepare(`
            INSERT INTO products (
                id, name, slug, category, price, original_price, discount,
                description, images, sizes, colors, stock, rating, reviews_count,
                badge, featured, details, seller_id, is_published, created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, 5.0, 1,
                'Artisan Drop', 1, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
        `).run(
            id,
            name.trim(),
            slug,
            category.trim().toLowerCase(),
            Number(price),
            originalPrice ? Number(originalPrice) : Number(price),
            discount ? Number(discount) : 0,
            description || '',
            JSON.stringify(Array.isArray(images) && images.length ? images : ['assets_processed/corsets_1.jpg']),
            JSON.stringify(Array.isArray(sizes) && sizes.length ? sizes : ['One Size']),
            JSON.stringify(['Blush']),
            stock !== undefined ? Number(stock) : 10,
            JSON.stringify(details || {}),
            sellerId || 'seller-artisan-1'
        );

        const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        res.status(201).json({ success: true, data: formatProduct(created) });
    } catch (err) {
        console.error('[API Seller Add Product Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to list artisan product: ' + err.message });
    }
});

// ============================================================================
// 9. HERO & SETTINGS API
// ============================================================================

// GET /api/settings/hero
app.get('/api/settings/hero', (req, res) => {
    try {
        const row = db.prepare("SELECT * FROM hero_settings WHERE id = 'default'").get();
        res.json({
            success: true,
            data: row ? {
                videoSrc: row.video_url,
                fallbackImage: row.fallback_image,
                title: row.heading,
                subtitle: row.subtitle,
                buttonText: row.button_text,
                buttonLink: row.button_link
            } : null
        });
    } catch (err) {
        console.error('[API Get Hero Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch hero settings' });
    }
});

// PUT /api/settings/hero
app.put('/api/settings/hero', (req, res) => {
    try {
        const { videoSrc, fallbackImage, title, subtitle, buttonText, buttonLink } = req.body;
        db.prepare(`
            UPDATE hero_settings SET
                video_url = COALESCE(?, video_url),
                fallback_image = COALESCE(?, fallback_image),
                heading = COALESCE(?, heading),
                subtitle = COALESCE(?, subtitle),
                button_text = COALESCE(?, button_text),
                button_link = COALESCE(?, button_link),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 'default'
        `).run(videoSrc, fallbackImage, title, subtitle, buttonText, buttonLink);

        const updated = db.prepare("SELECT * FROM hero_settings WHERE id = 'default'").get();
        res.json({ success: true, data: updated });
    } catch (err) {
        console.error('[API Update Hero Error]:', err);
        res.status(500).json({ success: false, error: 'Failed to update hero settings' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        store: 'Yaschi E-Commerce',
        timestamp: new Date().toISOString()
    });
});

// Catch-all for non-API routes fallback or 404 for unhandled API
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, error: 'API route not found' });
    }
    next();
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🌸 Yaschi E-Commerce server running on http://localhost:${PORT}`);
        console.log(`✨ Connected to SQLite database: yaschi.sqlite`);
    });
}

module.exports = app;
module.exports.app = app;
