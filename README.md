# 🌸 YASCHI.com — Couture-Core & Artisan Fashion E-Commerce

**Yaschi** is an elegant, feminine fashion and beauty e-commerce platform blending a cottagecore/blush pink aesthetic with modern, production-grade web architecture. It delivers a fast, responsive shopping experience optimized across mobile, tablet, laptop, and desktop viewports.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Environment Configuration](#-environment-configuration)
- [Installation & Getting Started](#-installation--getting-started)
- [Project Structure](#-project-structure)
- [Private CMS / Admin Studio Notice](#-private-cms--admin-studio-notice)
- [Visual Identity & Design System](#-visual-identity--design-system)
- [License](#-license)

---

## 🌟 Overview

Yaschi offers an immersive shopping destination for couture fashion, corsetry, bespoke dresses, and curated beauty. Designed with meticulous attention to typography, soft blush color harmonies, and intuitive touch/desktop interactions, the platform supports dynamic catalog browsing, multi-category search, cart and wishlist management, interactive gift cards, and an artisan onboarding hub.

---

## ✨ Key Features

- **Universal Cross-Device Header & Navigation**:
  - Consistent navigation across all pages (`index.html`, `shop.html`, `product.html`, `gift-cards.html`, `sell.html`, etc.).
  - Left navigation button ("All") opens a smooth slide-out drawer with accordion navigation on both mobile and laptop/desktop viewports.
  - "All Products" link routes cleanly to the catalog (`shop.html?category=all`) and resets filters without opening the drawer.
  - Interactive search bar with real-time category filtering and enter-to-search support.
  - Dynamic cart badge and wishlist indicator with persistent counts.
  - Delivery location PIN code selector with persistent local storage.

- **Artisan Product Catalog & Filtering**:
  - 32 carefully curated products across 8 couture categories: Corsets, Dresses, Tops & Tunics, Skirts, Bottoms, Shrugs, Jewellery, and Makeup.
  - Interactive faceted filters: category selection, price range sliders, sizing, colors, and sorting (Price Low-to-High, High-to-Low, Newest, Top Rated).
  - Responsive 2-column mobile card layout with quick-view, wishlist toggles, and stock status indicators.

- **Product Detail & Preview Engine (`product.html`)**:
  - High-resolution image gallery with interactive thumbnail switching and magnification preview.
  - Variant selectors (sizes XS–XXL, boutique color swatches).
  - Customer review submission system with star ratings and local persistence.
  - Related product recommendations based on active categories.

- **Interactive Gift Cards Studio (`gift-cards.html`)**:
  - 4 boutique themes: *Blush Rosewater*, *Victorian Lace*, *Golden Wildflower*, and *Couture Noir*.
  - Live card preview updating denomination, custom value, recipient details, and personal message in real time.
  - Delivery date scheduler and direct "Add to Bag" / "Buy Now" checkout flows.

- **Artisan & Seller Portal (`sell.html`)**:
  - Onboarding and partnership application flow for indie fashion designers and creators.
  - Interactive "Product Listing Creator" with real-time live preview card, discount calculator, and simulated publishing to the catalog.

- **Resilient Dual-Mode Architecture**:
  - **Full-Stack Mode**: Node.js + Express backend powered by `node:sqlite` (`yaschi.sqlite`) for fast relational persistence and RESTful API endpoints.
  - **Static / Offline Mode**: Graceful client-side fallback using `localStorage` and optional Supabase cloud synchronization, allowing the storefront to function as a standalone web application without a running backend server.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Vanilla JS architecture, componentized modules (`js/header.js`, `script.js`, `cart.js`, etc.), zero framework bloat |
| **Styling** | Modern CSS | CSS Variables, Flexbox, CSS Grid, mobile-first responsive breakpoints, custom glassmorphism effects |
| **Backend** | Node.js, Express 5 | RESTful API routes (`/api/products`, `/api/orders`, `/api/users`, `/api/reviews`), static file serving |
| **Database** | SQLite (`node:sqlite`) | Built-in zero-dependency SQLite database (`yaschi.sqlite`), schema migrations, initial seeding |
| **Optional Cloud** | Supabase | Client-side cloud backup / sync support via `.env` / config |

---

## 🔐 Environment Configuration

The application includes an environment template file: [`.env.example`](.env.example).

To configure your local environment:

1. Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Configure the variables to match your environment:
   ```env
   # Server & Network Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration (SQLite default / PostgreSQL compatible)
   DATABASE_URL=sqlite:yaschi.sqlite

   # API & Storefront Endpoints
   API_URL=http://localhost:3000/api
   STORE_FRONT_URL=http://localhost:3000

   # Authentication & Security Secrets
   AUTH_SECRET=your-production-auth-secret-here
   JWT_SECRET=your-production-jwt-secret-here
   ADMIN_DEFAULT_PASSWORD=your-secure-admin-password-here

   # CMS Studio Configuration (Maintained locally/separately)
   CMS_URL=http://localhost:3000/admin
   CMS_API_KEY=your-production-cms-api-key-here

   # Optional Supabase Integration (Leave blank to use local SQLite / localStorage)
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-public-key-here
   ```

> [!CAUTION]
> Never commit `.env`, `.env.local`, or any private security keys to Git. These patterns are strictly ignored by `.gitignore`.

---

## 🚀 Installation & Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` (bundled with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/yaminisahu1302-jpg/YASCHI.com.git
cd YASCHI.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```
*Alternatively, run in development mode:*
```bash
npm run dev
```

### 4. Access the Website

Open your browser and navigate to:
```
http://localhost:3000
```

### 5. Running in Static / Offline Mode

If you prefer to run the public storefront without the Node.js backend:
- Open `index.html` directly in your browser, or
- Serve the root directory using any static web server:
  ```bash
  npx serve .
  ```
The client-side state engine will seamlessly use built-in catalog data and browser `localStorage`.

---

## 📁 Project Structure

```text
YASCHI.com/
├── .env.example          # Environment variables template
├── .gitignore            # Git exclusion rules (CMS, secrets, node_modules)
├── README.md             # Project documentation
├── package.json          # Node dependencies and scripts
├── server.js             # Express API server & static routes
├── db.js                 # SQLite database schema, initialization & seeding
│
├── index.html            # Yaschi homepage with hero video & featured edits
├── shop.html             # Full collection catalog with faceted filters
├── product.html          # Product preview, gallery & reviews
├── gift-cards.html       # Boutique gift card customizer
├── sell.html             # Artisan & partner listing portal
├── cart.html             # Shopping bag & checkout flow
│
├── style.css             # Core stylesheet & design tokens
├── script.js             # Storefront client-side logic & product rendering
├── products.json         # Master product catalog seed data
│
├── js/                   # Modular client scripts
│   ├── header.js         # Header, search, drawer & location interactions
│   ├── cart.js           # Cart state & local storage synchronization
│   └── supabase-config.js# Optional cloud sync configuration
│
└── assets/               # Public images, hero video, and icons
    ├── hero-fashion.mp4  # Homepage hero video banner
    └── ...
```

---

## 🛡️ Private CMS / Admin Studio Notice

> [!IMPORTANT]
> The **Yaschi CMS / Admin Studio** is maintained as an independent, private administration tool.
>
> All CMS frontend files, admin dashboards, and proprietary management interfaces (`/admin/`, `/cms/`, `/studio/`) are **strictly excluded from this public repository** via [`.gitignore`](.gitignore) and are kept in a separate, secure local or private deployment environment.
>
> This repository contains the complete public-facing storefront, database schemas, and API layer necessary to run and develop the Yaschi e-commerce platform.

---

## 🎨 Visual Identity & Design System

The visual identity of Yaschi is centered around softness, artisan craft, and romantic sophistication:

- **Soft Blush Pink**: `#fbf6f6` / `#d8b4b6` (Backgrounds, subtle accents)
- **Rose Cream**: `#fffaf8` (Cards, elevated surfaces)
- **Muted Sage Green**: `#9aada0` (Badges, botanical accents)
- **Charcoal Espresso**: `#2d2522` / `#5a4d47` (Legible luxury typography)
- **Couture Typography**: *Playfair Display*, *Cormorant Garamond*, and *Montserrat*

---

## 📄 License

All rights reserved © Yaschi Couture & Artisan Fashion.
