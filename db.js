const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const crypto = require('crypto');
const { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_HERO_SETTINGS } = require('./js/products.js');

const dbPath = path.join(__dirname, 'yaschi.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        original_price REAL,
        discount INTEGER DEFAULT 0,
        description TEXT,
        images TEXT NOT NULL, -- JSON array
        video_url TEXT,
        sizes TEXT NOT NULL, -- JSON array
        colors TEXT NOT NULL, -- JSON array
        stock INTEGER NOT NULL DEFAULT 10,
        rating REAL DEFAULT 4.8,
        reviews_count INTEGER DEFAULT 12,
        badge TEXT,
        featured INTEGER DEFAULT 0,
        details TEXT, -- JSON object
        seller_id TEXT,
        is_published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sellers (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        brand_name TEXT NOT NULL,
        founder_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        portfolio_url TEXT,
        category TEXT NOT NULL,
        bio TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        size TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        custom_attributes TEXT, -- JSON string for gift cards or personalizations
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, product_id, size)
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        shipping_address TEXT NOT NULL, -- JSON object string
        subtotal REAL NOT NULL,
        shipping_cost REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        total REAL NOT NULL,
        payment_method TEXT NOT NULL,
        payment_status TEXT DEFAULT 'Pending',
        order_status TEXT DEFAULT 'Processing',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        size TEXT NOT NULL,
        image_url TEXT,
        custom_data TEXT,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS gift_cards (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        balance REAL NOT NULL,
        initial_amount REAL NOT NULL,
        design_theme TEXT NOT NULL,
        recipient_name TEXT NOT NULL,
        recipient_email TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        message TEXT,
        delivery_date TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hero_settings (
        id TEXT PRIMARY KEY DEFAULT 'default',
        video_url TEXT NOT NULL DEFAULT 'hero vdo.mp4',
        fallback_image TEXT DEFAULT 'hero-banner.jpg',
        heading TEXT NOT NULL DEFAULT 'Yaschi',
        subtitle TEXT NOT NULL DEFAULT 'A Couture-Core Brand',
        button_text TEXT NOT NULL DEFAULT 'Shop Now',
        button_link TEXT NOT NULL DEFAULT 'shop.html',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Password hashing helper
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    if (!stored || !stored.includes(':')) return false;
    const [salt, key] = stored.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(hash, 'hex'));
}

// Auto-seed Categories if empty
const countCat = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (countCat.count === 0) {
    const insertCat = db.prepare(`
        INSERT INTO categories (id, name, slug, description, display_order)
        VALUES (?, ?, ?, ?, ?)
    `);
    INITIAL_CATEGORIES.forEach((cat, index) => {
        insertCat.run(cat.id, cat.name, cat.slug, cat.description || '', index);
    });
}

// Auto-seed Products if empty
const countProd = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (countProd.count === 0) {
    const insertProd = db.prepare(`
        INSERT INTO products (
            id, name, slug, category, price, original_price, discount,
            description, images, sizes, colors, stock, rating, reviews_count,
            badge, featured, details, is_published
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, 1
        )
    `);

    INITIAL_PRODUCTS.forEach(p => {
        insertProd.run(
            p.id,
            p.name,
            p.slug || p.id,
            p.category,
            p.price,
            p.originalPrice || p.price,
            p.discount || 0,
            p.description || '',
            JSON.stringify(p.images || []),
            JSON.stringify(p.sizes || ['One Size']),
            JSON.stringify(p.colors || ['Blush']),
            p.stock !== undefined ? p.stock : 10,
            p.rating || 4.8,
            p.reviewsCount || 42,
            p.badge || '',
            p.featured ? 1 : 0,
            JSON.stringify(p.details || {})
        );
    });
}

// Auto-seed Hero Settings if empty
const countHero = db.prepare('SELECT COUNT(*) as count FROM hero_settings').get();
if (countHero.count === 0) {
    const hero = INITIAL_HERO_SETTINGS || {};
    db.prepare(`
        INSERT INTO hero_settings (id, video_url, fallback_image, heading, subtitle, button_text, button_link)
        VALUES ('default', ?, ?, ?, ?, ?, ?)
    `).run(
        hero.videoSrc || 'hero vdo.mp4',
        hero.fallbackImage || 'hero-banner.jpg',
        hero.title || 'Yaschi',
        hero.subtitle || 'A Couture-Core Brand',
        hero.buttonText || 'Shop Now',
        hero.buttonLink || 'shop.html'
    );
}

// Auto-seed Default Admin and Demo Seller
const adminUser = db.prepare("SELECT * FROM users WHERE email = 'admin@yaschi.com'").get();
if (!adminUser) {
    db.prepare(`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ('user-admin-1', 'Yaschi Admin', 'admin@yaschi.com', ?, 'admin')
    `).run(hashPassword('yaschi123'));
}

const demoSeller = db.prepare("SELECT * FROM sellers WHERE email = 'artisan@yaschi.com'").get();
if (!demoSeller) {
    db.prepare(`
        INSERT INTO sellers (id, brand_name, founder_name, email, phone, category, bio, status)
        VALUES ('seller-demo-1', 'Willow & Wildflower Studio', 'Eleanor Vance', 'artisan@yaschi.com', '+91 98765 43210', 'corsets', 'Artisanal corsets and floral bodices handcrafted using heritage embroidery and silk ribbons.', 'active')
    `).run();
}

module.exports = {
    db,
    hashPassword,
    verifyPassword
};
