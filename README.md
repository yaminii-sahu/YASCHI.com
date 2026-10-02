# 🌸 Yaschi — Couture-Core & Artisan Fashion E-Commerce

Yaschi is an elegant, feminine fashion and beauty e-commerce platform blending a cottagecore/blush pink aesthetic with modern, production-grade web architecture.

---

## ✨ Features

- **Universal Responsive Header & Navigation**:
  - Consistent layout across all pages (`index.html`, `shop.html`, `product.html`, `gift-cards.html`, `sell.html`, etc.).
  - Search bar with real-time category filtering and dynamic "All" reset.
  - Interactive wishlist and shopping bag with live counter badges.
  - Delivery location PIN code selector with persistent local storage.
  - Mobile slide-out drawer with accordion navigation and category links.

- **Artisan Product Catalog**:
  - 32 carefully curated products across 8 couture categories: Corsets, Dresses, Tops & Tunics, Skirts, Bottoms, Shrugs, Jewellery, and Makeup.
  - Detailed product preview pages with image zoom/thumbnails, size/color selectors, customer reviews, and stock indicators.

- **Interactive Gift Cards Configurator (`gift-cards.html`)**:
  - 4 boutique themes: *Blush Rosewater*, *Victorian Lace*, *Golden Wildflower*, and *Couture Noir*.
  - Live card preview updating denomination, custom value, recipient details, and personal message in real time.
  - Delivery date scheduler and direct "Add to Bag" / "Buy Now" flows.

- **Artisan & Seller Portal (`sell.html`)**:
  - Partner application form for indie fashion creators and artisans.
  - Interactive "Product Listing Creator" with a real-time live preview card, discount calculator, and publishing to catalog.

- **Dual-Mode Resilient Architecture**:
  - **Full-Stack Mode**: Node.js + Express backend powered by `node:sqlite` (`yaschi.sqlite`) for relational persistence.
  - **Static / Offline Mode**: Full graceful fallback to browser `localStorage` and optional Supabase cloud syncing if opened without a Node server.

---

## 🚀 Getting Started

### Option 1: Full-Stack Express Server (Recommended)

1. Make sure Node.js (v18+) is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Option 2: Static Mode

Simply open `index.html` directly in your browser or run any static file server (such as VS Code Live Server or `npx serve .`). All catalog items, cart, wishlist, and filter features will seamlessly function via the client-side state manager and `localStorage`.

---

## 🎨 Visual Identity & Palette

- **Soft Blush Pink**: `#fbf6f6` / `#d8b4b6`
- **Rose Cream**: `#fffaf8`
- **Muted Sage Green**: `#9aada0`
- **Charcoal Espresso**: `#2d2522` / `#5a4d47`
- **Typography**: *Playfair Display*, *Cormorant Garamond*, and *Montserrat*

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express 5, `node:sqlite`
- **Persistence**: SQLite (`yaschi.sqlite`), `localStorage`, Supabase-compatible
