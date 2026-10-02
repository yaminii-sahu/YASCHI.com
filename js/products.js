/**
 * Yaschi E-Commerce — Initial Product Catalog
 * Rich dataset for cottagecore & feminine luxury fashion and beauty.
 */

const INITIAL_CATEGORIES = [
    { id: 'corsets', name: 'Corsets', slug: 'corsets', description: 'Structured bodices, vintage floral tapestries, and peasant lace-up corsets.' },
    { id: 'dresses', name: 'Dresses', slug: 'dresses', description: 'Romantic tiered sundresses, puff-sleeve midi dresses, and wildflower gowns.' },
    { id: 'skirts', name: 'Skirts', slug: 'skirts', description: 'Flowing fairycore lace skirts, tiered ruffle midis, and bohemian maxi skirts.' },
    { id: 'shrugs', name: 'Shrugs', slug: 'shrugs', description: 'Delicate open-knit shrugs, lace boleros, and cozy cottagecore crochet layers.' },
    { id: 'tops', name: 'Tops & Tunics', slug: 'tops', description: 'Peasant milkmaid blouses, ruffled collars, eyelet lace tunics, and embroidered tops.' },
    { id: 'bottoms', name: 'Bottoms', slug: 'bottoms', description: 'Soft vintage denim, floral-embroidered wide-leg trousers, and cottage linen pants.' },
    { id: 'accessories', name: 'Accessories', slug: 'accessories', description: 'Gilded pearls, baroque floral necklaces, vintage locket earrings, and hair ribbons.' },
    { id: 'makeup', name: 'Makeup', slug: 'makeup', description: 'Rosewater tints, blush elixirs, gilded highlighters, and cottage glow palettes.' }
];

const INITIAL_PRODUCTS = [
    // CORSETS
    {
        id: 'c1',
        name: 'Peasant Lace-Up Tapestry Corset',
        slug: 'peasant-lace-up-tapestry-corset',
        category: 'corsets',
        price: 1899,
        originalPrice: 2499,
        discount: 24,
        images: ['assets_processed/corsets_1.jpg', 'corset1.jpeg', 'corset4.jpeg'],
        description: 'An ethereal structured corset crafted from jacquard floral tapestry with delicate brass eyelets and ribbon lacing. Features boning support and a flattering sweetheart neckline, designed to pair over puff-sleeved peasant blouses.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Earthy Floral', 'Ivory Cream'],
        stock: 12,
        rating: 4.8,
        reviewsCount: 84,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: 'Floral Cotton Jacquard & Satin Lining',
            care: 'Dry clean or gentle hand wash cold',
            fit: 'True to size with adjustable lace-up back'
        }
    },
    {
        id: 'c2',
        name: 'Meadow Floral Embroidered Bodice',
        slug: 'meadow-floral-embroidered-bodice',
        category: 'corsets',
        price: 2199,
        originalPrice: 2899,
        discount: 24,
        images: ['assets_processed/corsets_2.jpg', 'corset2.jpeg', 'corset3.jpeg'],
        description: 'Featuring soft sage embroidery on dusty cream linen. Designed with flexible steel boning and dainty satin shoulder ties, bringing storybook romanticism to your wardrobe.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Sage Garden', 'Rose Quartz'],
        stock: 7,
        rating: 4.9,
        reviewsCount: 62,
        badge: 'Trending',
        featured: true,
        details: {
            fabric: '100% Linen with Botanical Embroidery',
            care: 'Spot clean or hand wash cold',
            fit: 'Structured bodice with 2-inch adjustability'
        }
    },
    {
        id: 'c3',
        name: 'Antique Tapestry Overbust Corset',
        slug: 'antique-tapestry-overbust-corset',
        category: 'corsets',
        price: 2499,
        originalPrice: 3299,
        discount: 24,
        images: ['assets_processed/corsets_3.jpg', 'corset3.jpeg', 'corset1.jpeg'],
        description: 'Inspired by 18th-century palace archives. Woven with rich olive and dusty rose florals, complete with scallop edge binding and back lacing.',
        sizes: ['S', 'M', 'L'],
        colors: ['Antique Olive', 'Burgundy Rose'],
        stock: 5,
        rating: 4.7,
        reviewsCount: 45,
        badge: 'Limited Edition',
        featured: false,
        details: {
            fabric: 'Heavyweight Tapestry Damask',
            care: 'Dry clean only',
            fit: 'Fitted overbust shape'
        }
    },
    {
        id: 'c4',
        name: 'Victorian Rose Garden Bodice',
        slug: 'victorian-rose-garden-bodice',
        category: 'corsets',
        price: 1999,
        originalPrice: 2599,
        discount: 23,
        images: ['assets_processed/corsets_4.jpg', 'corset4.jpeg', 'corset2.jpeg'],
        description: 'Sweetheart contouring with delicate velvet piping and pastel rose clusters. Perfect for picnics and garden rendezvous.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Rose Floral', 'Parchment'],
        stock: 9,
        rating: 4.8,
        reviewsCount: 39,
        badge: 'New',
        featured: false,
        details: {
            fabric: 'Embroidered Satin Jacquard',
            care: 'Hand wash gently',
            fit: 'Snug contour silhouette'
        }
    },

    // DRESSES
    {
        id: 'd1',
        name: 'Wildflower Tiered Cottagecore Maxi Dress',
        slug: 'wildflower-tiered-cottagecore-maxi-dress',
        category: 'dresses',
        price: 2499,
        originalPrice: 3499,
        discount: 28,
        images: ['assets_processed/dresses_1.jpg', 'dress1.jpeg', 'dress4.jpeg'],
        description: 'Crafted from breathable organic cotton batiste sprinkled with pastel climbing wild roses. Designed with a tiered flowing skirt, ruffled cap sleeves, and smocked back bodice.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Petal Pink', 'Meadow White'],
        stock: 14,
        rating: 4.9,
        reviewsCount: 110,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: '100% Breathable Lightweight Cotton',
            care: 'Machine wash delicate cold, line dry in shade',
            fit: 'Flowing relaxed fit with elasticated smocking'
        }
    },
    {
        id: 'd2',
        name: 'Buttercup Yellow Puff-Sleeve Midi Dress',
        slug: 'buttercup-yellow-puff-sleeve-midi-dress',
        category: 'dresses',
        price: 2199,
        originalPrice: 2999,
        discount: 26,
        images: ['assets_processed/dresses_2.jpg', 'dress2.jpeg', 'dress3.jpg'],
        description: 'Delicate pastel yellow midi with dramatic puffed sleeves, a sweetheart collar, and functional mother-of-pearl buttons along the front. A sunshine dream.',
        sizes: ['S', 'M', 'L'],
        colors: ['Buttercup Yellow', 'Soft Ivory'],
        stock: 8,
        rating: 4.8,
        reviewsCount: 76,
        badge: 'Trending',
        featured: true,
        details: {
            fabric: 'Linen-Viscose Blend',
            care: 'Hand wash cold',
            fit: 'A-line midi with fitted waist'
        }
    },
    {
        id: 'd3',
        name: 'Cornflower Blue Milkmaid Sundress',
        slug: 'cornflower-blue-milkmaid-sundress',
        category: 'dresses',
        price: 2299,
        originalPrice: 3199,
        discount: 28,
        images: ['assets_processed/dresses_3.jpg', 'dress3.jpg', 'dress1.jpeg'],
        description: 'Fine blue botanical motifs on ivory lawn. Features a ruched tie bust, side-slit hemline, and hidden side seam pockets.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Cornflower Blue', 'Vintage White'],
        stock: 11,
        rating: 4.7,
        reviewsCount: 52,
        badge: 'Popular',
        featured: false,
        details: {
            fabric: 'Soft Cotton Poplin with Full Cotton Lining',
            care: 'Machine wash cold inside-out',
            fit: 'Tie-adjustable bust with flare skirt'
        }
    },
    {
        id: 'd4',
        name: 'Heritage Rose Romance Tiered Gown',
        slug: 'heritage-rose-romance-tiered-gown',
        category: 'dresses',
        price: 2799,
        originalPrice: 3899,
        discount: 28,
        images: ['assets_processed/dresses_4.jpg', 'dress4.jpeg', 'dress2.jpeg'],
        description: 'Deep crimson roses strewn over cream organza with delicate lace insets and sweeping hem tiers. Designed for twilight galas and countryside garden weddings.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Crimson Bloom', 'Cream Rose'],
        stock: 6,
        rating: 5.0,
        reviewsCount: 68,
        badge: 'Exclusive',
        featured: false,
        details: {
            fabric: 'Double-Layered Organza with Lace Trims',
            care: 'Professional dry clean',
            fit: 'Floor length silhouette with back zipper'
        }
    },

    // SKIRTS
    {
        id: 's1',
        name: 'Bohemian Crochet Tiered Maxi Skirt',
        slug: 'bohemian-crochet-tiered-maxi-skirt',
        category: 'skirts',
        price: 1799,
        originalPrice: 2399,
        discount: 25,
        images: ['assets_processed/skirts_1.jpg', 'skirt1.jpeg', 'skirt3.jpeg'],
        description: 'A fairycore dream featuring tiers of sheer crochet lace, scalloped hem details, and an elasticized drawstring waist with wooden beads.',
        sizes: ['XS-S', 'M-L', 'XL'],
        colors: ['Antique Cream', 'Pale Sage'],
        stock: 16,
        rating: 4.8,
        reviewsCount: 57,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: '100% Cotton Crochet & Rayon Slip Lining',
            care: 'Hand wash cold flat dry',
            fit: 'Free-flowing elastic waist'
        }
    },
    {
        id: 's2',
        name: 'English Rose Ruffle Midi Skirt',
        slug: 'english-rose-ruffle-midi-skirt',
        category: 'skirts',
        price: 1599,
        originalPrice: 2199,
        discount: 27,
        images: ['assets_processed/skirts_2.jpg', 'skirt2.jpeg', 'skirt4.jpeg'],
        description: 'Whimsical high-waisted midi skirt with cascading diagonal ruffles and soft pink botanicals. Glides gracefully with every step.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Blush Flora', 'Parchment'],
        stock: 9,
        rating: 4.7,
        reviewsCount: 41,
        badge: 'Sale',
        featured: false,
        details: {
            fabric: 'Lightweight Chiffon with Full Lining',
            care: 'Machine wash delicate',
            fit: 'High-rise waist with concealed zipper'
        }
    },
    {
        id: 's3',
        name: 'Dusty Pink Romantic Tiered Lace Skirt',
        slug: 'dusty-pink-romantic-tiered-lace-skirt',
        category: 'skirts',
        price: 1899,
        originalPrice: 2499,
        discount: 24,
        images: ['assets_processed/skirts_3.jpg', 'skirt3.jpeg', 'skirt1.jpeg'],
        description: 'Soft rose hue with tiered English lace panels. Lightweight, breathable, and designed for effortless pairing with corset tops.',
        sizes: ['S', 'M', 'L'],
        colors: ['Dusty Pink', 'Ivory Rose'],
        stock: 10,
        rating: 4.9,
        reviewsCount: 48,
        badge: 'Trending',
        featured: true,
        details: {
            fabric: 'Cotton Voile & Guipure Lace',
            care: 'Hand wash gently',
            fit: 'Comfortable elasticized back waistband'
        }
    },
    {
        id: 's4',
        name: 'Fairycore Asymmetrical Lace Hem Skirt',
        slug: 'fairycore-asymmetrical-lace-hem-skirt',
        category: 'skirts',
        price: 1999,
        originalPrice: 2699,
        discount: 26,
        images: ['assets_processed/skirts_4.jpg', 'skirt4.jpeg', 'skirt2.jpeg'],
        description: 'Handcrafted with tiered sage and off-white lace ribbons. An asymmetrical handkerchief hem creates an enchanting storybook silhouette.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Moss & Ivory', 'Washed Rose'],
        stock: 7,
        rating: 4.9,
        reviewsCount: 35,
        badge: 'Unique',
        featured: false,
        details: {
            fabric: 'Multi-Textured Vintage Lace & Linen',
            care: 'Hand wash cold',
            fit: 'Adjustable drawstring waist'
        }
    },

    // SHRUGS
    {
        id: 'sh1',
        name: 'Delicate Open-Knit Pointelle Shrug',
        slug: 'delicate-open-knit-pointelle-shrug',
        category: 'shrugs',
        price: 1299,
        originalPrice: 1799,
        discount: 27,
        images: ['assets_processed/shrugs_1.jpg', 'shrug1.jpeg', 'shrug3.jpeg'],
        description: 'Featherlight pointelle shrug knitted from organic combed cotton. Features bell cuffs, scalloped ribbing, and a single satin tie closure at the chest.',
        sizes: ['XS-S', 'M-L'],
        colors: ['Soft Ivory', 'Dusty Rose', 'Pale Sage'],
        stock: 20,
        rating: 4.8,
        reviewsCount: 92,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: '100% Combed Organic Cotton Knit',
            care: 'Hand wash cold, dry flat',
            fit: 'Cropped bolero fit'
        }
    },
    {
        id: 'sh2',
        name: 'Victorian Lace Bolero Cardigan',
        slug: 'victorian-lace-bolero-cardigan',
        category: 'shrugs',
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        images: ['assets_processed/shrugs_2.jpg', 'shrug2.jpeg', 'shrug4.jpeg'],
        description: 'Allover floral lace with romantic eyelash trims and delicate covered buttons. Elegant over evening gowns and corset ensembles.',
        sizes: ['S', 'M', 'L'],
        colors: ['Cream Lace', 'Black Rose'],
        stock: 12,
        rating: 4.7,
        reviewsCount: 33,
        badge: 'New',
        featured: false,
        details: {
            fabric: 'Cotton-Blend Floral Lace',
            care: 'Hand wash cold',
            fit: 'Tailored shoulder with cropped waist'
        }
    },
    {
        id: 'sh3',
        name: 'Chunky Cottage Cable-Knit Shrug',
        slug: 'chunky-cottage-cable-knit-shrug',
        category: 'shrugs',
        price: 1699,
        originalPrice: 2299,
        discount: 26,
        images: ['assets_processed/shrugs_3.jpg', 'shrug3.jpeg', 'shrug1.jpeg'],
        description: 'Cozy oversized cable knitting with dropped shoulders and roomy puff sleeves. Provides warmth for autumn strolls without hiding your dress.',
        sizes: ['One Size Fits Most'],
        colors: ['Oatmeal', 'Blush Heather'],
        stock: 15,
        rating: 4.9,
        reviewsCount: 78,
        badge: 'Popular',
        featured: true,
        details: {
            fabric: 'Soft Wool-Acrylic Blend',
            care: 'Hand wash cold, reshape and dry flat',
            fit: 'Slouchy cocoon fit'
        }
    },
    {
        id: 'sh4',
        name: 'Rosebud Embroidered Mohair Shrug',
        slug: 'rosebud-embroidered-mohair-shrug',
        category: 'shrugs',
        price: 1899,
        originalPrice: 2499,
        discount: 24,
        images: ['assets_processed/shrugs_4.jpg', 'shrug4.jpeg', 'shrug2.jpeg'],
        description: 'Fluffy mohair texture dotted with miniature hand-embroidered pink bullion roses. A truly collectible cottage luxury piece.',
        sizes: ['S', 'M', 'L'],
        colors: ['Powder Pink', 'Cloud White'],
        stock: 8,
        rating: 4.9,
        reviewsCount: 29,
        badge: 'Exclusive',
        featured: false,
        details: {
            fabric: 'Mohair-Angora Blend',
            care: 'Dry clean only',
            fit: 'Cropped silhouette'
        }
    },

    // TOPS & TUNICS
    {
        id: 't1',
        name: 'Vintage Peasant Milkmaid Blouse',
        slug: 'vintage-peasant-milkmaid-blouse',
        category: 'tops',
        price: 1399,
        originalPrice: 1899,
        discount: 26,
        images: ['assets_processed/tops_1.jpg', 'top1.jpeg', 'top3.jpeg'],
        description: 'Classic milkmaid top with puffed elastic sleeves, square neckline, sweetheart bust gathering, and delicate eyelet embroidery.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Pure White', 'Blush Cream'],
        stock: 18,
        rating: 4.8,
        reviewsCount: 104,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: '100% Lightweight Cotton Lawn',
            care: 'Machine wash cold delicate',
            fit: 'Can be worn on or off the shoulder'
        }
    },
    {
        id: 't2',
        name: 'Victorian High-Neck Lace Collar Blouse',
        slug: 'victorian-high-neck-lace-collar-blouse',
        category: 'tops',
        price: 1599,
        originalPrice: 2199,
        discount: 27,
        images: ['assets_processed/tops_2.jpg', 'top2.jpeg', 'top4.jpeg'],
        description: 'Victorian-inspired standing ruffle collar with pin-tucked yoke, delicate pearl buttons down the spine, and bishop sleeves.',
        sizes: ['S', 'M', 'L'],
        colors: ['Antique Ivory', 'Soft Black'],
        stock: 11,
        rating: 4.7,
        reviewsCount: 42,
        badge: 'Trending',
        featured: false,
        details: {
            fabric: 'Fine Cotton Muslin with Guipure Lace',
            care: 'Hand wash cold',
            fit: 'Tailored feminine fit'
        }
    },
    {
        id: 't3',
        name: 'Wildflower Embroidered Linen Tunic',
        slug: 'wildflower-embroidered-linen-tunic',
        category: 'tops',
        price: 1799,
        originalPrice: 2399,
        discount: 25,
        images: ['assets_processed/tops_3.jpg', 'top3.jpeg', 'top1.jpeg'],
        description: 'Breezy relaxed tunic crafted from washed European linen with multi-colored meadow botanicals embroidered across the cuffs and collar.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Natural Flax', 'Sage Green'],
        stock: 13,
        rating: 4.9,
        reviewsCount: 65,
        badge: 'Popular',
        featured: true,
        details: {
            fabric: '100% Washed European Linen',
            care: 'Machine wash cold gentle',
            fit: 'Relaxed easy drape'
        }
    },
    {
        id: 't4',
        name: 'Romantic Ruffled Eyelet Peplum Top',
        slug: 'romantic-ruffled-eyelet-peplum-top',
        category: 'tops',
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        images: ['assets_processed/tops_4.jpg', 'top4.jpeg', 'top2.jpeg'],
        description: 'Tiered peplum hem with broderie anglaise details, keyhole back closure, and flutter sleeves.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Pastel Rose', 'Ivory'],
        stock: 9,
        rating: 4.6,
        reviewsCount: 38,
        badge: 'New',
        featured: false,
        details: {
            fabric: '100% Broderie Anglaise Cotton',
            care: 'Machine wash delicate',
            fit: 'Flattering peplum waist'
        }
    },

    // BOTTOMS
    {
        id: 'b1',
        name: 'Embroidered Floral Wide-Leg Jeans',
        slug: 'embroidered-floral-wide-leg-jeans',
        category: 'bottoms',
        price: 1999,
        originalPrice: 2799,
        discount: 28,
        images: ['assets_processed/bottoms_1.jpg', 'denim1.jpeg', 'denim3.jpeg'],
        description: 'Vintage high-rise denim with gentle distressing and trailing pastel daisies embroidered along the pockets and leg hem.',
        sizes: ['26', '28', '30', '32', '34'],
        colors: ['Vintage Light Wash', 'Ecru Cream'],
        stock: 14,
        rating: 4.8,
        reviewsCount: 95,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: '100% Premium Cotton Denim',
            care: 'Machine wash cold inside out',
            fit: 'High rise with wide relaxed leg'
        }
    },
    {
        id: 'b2',
        name: 'Cottage Linen Culotte Trousers',
        slug: 'cottage-linen-culotte-trousers',
        category: 'bottoms',
        price: 1699,
        originalPrice: 2299,
        discount: 26,
        images: ['assets_processed/bottoms_2.jpg', 'denim2.jpeg', 'denim4.jpeg'],
        description: 'Airy linen culottes with a removable self-tie belt, pleated front, and deep functional pockets for country foraging.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Oatmeal Linen', 'Muted Olive'],
        stock: 10,
        rating: 4.7,
        reviewsCount: 51,
        badge: 'Trending',
        featured: false,
        details: {
            fabric: '100% Pure Organic Linen',
            care: 'Machine wash cold, air dry',
            fit: 'Cropped wide leg'
        }
    },
    {
        id: 'b3',
        name: 'Pastel Patchwork Denim Flares',
        slug: 'pastel-patchwork-denim-flares',
        category: 'bottoms',
        price: 2199,
        originalPrice: 2999,
        discount: 26,
        images: ['assets_processed/bottoms_3.jpg', 'denim3.jpeg', 'denim1.jpeg'],
        description: 'Nostalgic 70s-inspired flares with floral chintz denim patchwork inserts along the flare flare.',
        sizes: ['28', '30', '32'],
        colors: ['Medium Wash Denim'],
        stock: 6,
        rating: 4.9,
        reviewsCount: 38,
        badge: 'Limited',
        featured: false,
        details: {
            fabric: 'Stretch Cotton Denim Blend',
            care: 'Cold wash gentle',
            fit: 'Fitted thigh with flared bell bottom'
        }
    },
    {
        id: 'b4',
        name: 'Tailored High-Waist Linen Shorts',
        slug: 'tailored-high-waist-linen-shorts',
        category: 'bottoms',
        price: 1299,
        originalPrice: 1799,
        discount: 27,
        images: ['assets_processed/bottoms_4.jpg', 'denim4.jpeg', 'denim2.jpeg'],
        description: 'Scalloped lace hem shorts with mother-of-pearl buttons and tailored front pleats.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Sand Dunes', 'Blush Petal'],
        stock: 12,
        rating: 4.6,
        reviewsCount: 27,
        badge: 'Sale',
        featured: false,
        details: {
            fabric: 'Linen-Rayon Blend',
            care: 'Machine wash delicate',
            fit: 'High rise with relaxed leg opening'
        }
    },

    // ACCESSORIES / JEWELRY
    {
        id: 'j1',
        name: 'Baroque Pearl & Gold Floral Choker',
        slug: 'baroque-pearl-gold-floral-choker',
        category: 'accessories',
        price: 899,
        originalPrice: 1299,
        discount: 30,
        images: ['assets_processed/accessories_1.jpg', 'jwellery1.jpeg', 'jwellery3.jpeg'],
        description: 'Lustrous freshwater baroque pearls strung with 18k gold-plated miniature brass blossoms and an adjustable extension chain.',
        sizes: ['One Size'],
        colors: ['18k Gold & Pearl'],
        stock: 25,
        rating: 4.9,
        reviewsCount: 130,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: 'Cultured Freshwater Pearls & 18k Gold Dipped Brass',
            care: 'Keep away from water and perfume',
            fit: '14" length + 2.5" extension chain'
        }
    },
    {
        id: 'j2',
        name: 'Vintage Pressed Flower Glass Locket',
        slug: 'vintage-pressed-flower-glass-locket',
        category: 'accessories',
        price: 799,
        originalPrice: 1099,
        discount: 27,
        images: ['assets_processed/accessories_2.jpg', 'jwellery2.jpeg', 'jwellery4.jpeg'],
        description: 'Real dried baby breath and forget-me-nots preserved inside beveled glass with an antiqued brass filigree frame.',
        sizes: ['One Size'],
        colors: ['Antique Brass'],
        stock: 15,
        rating: 4.8,
        reviewsCount: 88,
        badge: 'Popular',
        featured: false,
        details: {
            fabric: 'Preserved Botanicals, Mineral Glass, Brass',
            care: 'Store in soft velvet pouch',
            fit: '18" rolo chain'
        }
    },
    {
        id: 'j3',
        name: 'Gilded Butterfly Dangle Earrings',
        slug: 'gilded-butterfly-dangle-earrings',
        category: 'accessories',
        price: 649,
        originalPrice: 899,
        discount: 27,
        images: ['assets_processed/accessories_3.jpg', 'jwellery3.jpeg', 'jwellery1.jpeg'],
        description: 'Ethereal iridescent enamel wings framed by micro-crystal zirconia and hypoallergenic sterling silver posts.',
        sizes: ['One Size'],
        colors: ['Rose Gold & Mother of Pearl'],
        stock: 22,
        rating: 4.7,
        reviewsCount: 64,
        badge: 'Trending',
        featured: true,
        details: {
            fabric: '925 Sterling Silver Posts, Enamel, Zirconia',
            care: 'Wipe with microfiber cloth',
            fit: 'Lightweight drop earring (1.8" drop)'
        }
    },
    {
        id: 'j4',
        name: 'French Silk Hair Ribbon Set (Set of 3)',
        slug: 'french-silk-hair-ribbon-set',
        category: 'accessories',
        price: 499,
        originalPrice: 699,
        discount: 28,
        images: ['assets_processed/accessories_4.jpg', 'jwellery4.jpeg', 'jwellery2.jpeg'],
        description: 'Pure silk crepe ribbons in Sage Green, Rose Champagne, and Soft Ivory. Ideal for braided hair and cottage bows.',
        sizes: ['Set of 3'],
        colors: ['Trio Pastels'],
        stock: 30,
        rating: 4.9,
        reviewsCount: 71,
        badge: 'Gift Idea',
        featured: false,
        details: {
            fabric: '100% Pure Mulberry Silk Crepe',
            care: 'Hand wash gently cold',
            fit: '38" ribbon length each'
        }
    },

    // MAKEUP
    {
        id: 'm1',
        name: 'Yaschi Rosewater Velvet Lip & Cheek Tint',
        slug: 'yaschi-rosewater-velvet-lip-cheek-tint',
        category: 'makeup',
        price: 699,
        originalPrice: 999,
        discount: 30,
        images: ['Makeup.jpeg', 'makeup1.jpeg', 'makeup2.jpeg'],
        description: 'Infused with real damask rose extract and jojoba oil. Delivers a natural, dewy, pinched-pink flush to cheeks and soft petal pout.',
        sizes: ['15ml'],
        colors: ['English Rose Petal', 'Wild Berry', 'Peach Blossom'],
        stock: 35,
        rating: 4.9,
        reviewsCount: 165,
        badge: 'Bestseller',
        featured: true,
        details: {
            fabric: 'Organic Damask Rose Water, Shea Butter, Vitamin E',
            care: 'Store in cool dry place away from direct sunlight',
            fit: 'Dab lightly with fingertips and blend'
        }
    },
    {
        id: 'm2',
        name: 'Gilded Nectar Glow Dew Drops',
        slug: 'gilded-nectar-glow-dew-drops',
        category: 'makeup',
        price: 849,
        originalPrice: 1199,
        discount: 29,
        images: ['makeup2.jpeg', 'Makeup.jpeg', 'makeup3.jpeg'],
        description: 'Liquid light highlighter enriched with squalane and crushed crystal pearls. Gives skin an angelic, lit-from-within glow.',
        sizes: ['30ml Glass Dropper'],
        colors: ['Champagne Pearl', 'Rose Gold Sheen'],
        stock: 28,
        rating: 4.8,
        reviewsCount: 94,
        badge: 'Trending',
        featured: true,
        details: {
            fabric: 'Squalane, Hyaluronic Acid, Mineral Mica',
            care: 'Shake well before use',
            fit: 'Mix with moisturizer or dab on high points'
        }
    },
    {
        id: 'm3',
        name: 'Cottage Bloom 9-Pan Eyeshadow Palette',
        slug: 'cottage-bloom-9-pan-eyeshadow-palette',
        category: 'makeup',
        price: 1199,
        originalPrice: 1699,
        discount: 29,
        images: ['makeup3.jpeg', 'makeup4.jpeg', 'Makeup.jpeg'],
        description: 'Curated bouquet of buttery mattes, sparkling duochromes, and silk shimmers in tones of dusty mauve, moss green, and spun gold.',
        sizes: ['9 Shades'],
        colors: ['Cottage Garden Palette'],
        stock: 18,
        rating: 4.9,
        reviewsCount: 82,
        badge: 'Must Have',
        featured: false,
        details: {
            fabric: 'Talc-Free, Vegan & Cruelty-Free Formulation',
            care: 'Keep lid closed when not in use',
            fit: 'High pigment with minimal fallout'
        }
    },
    {
        id: 'm4',
        name: 'Wild Honey Nourishing Lip Gloss Oil',
        slug: 'wild-honey-nourishing-lip-gloss-oil',
        category: 'makeup',
        price: 549,
        originalPrice: 799,
        discount: 31,
        images: ['makeup4.jpeg', 'makeup1.jpeg', 'Makeup.jpeg'],
        description: 'Non-sticky glass shine infused with organic raw honey and almond oil. Leaves lips deeply hydrated with a soft amber sheen.',
        sizes: ['8ml'],
        colors: ['Pure Honey Glaze', 'Spiced Cinnamon'],
        stock: 40,
        rating: 4.8,
        reviewsCount: 119,
        badge: 'Popular',
        featured: false,
        details: {
            fabric: 'Cold-Pressed Almond Oil, Honey Extract, Peptides',
            care: 'Apply as needed for instant hydration and shine',
            fit: 'Cushion doe-foot applicator'
        }
    }
];

const INITIAL_HERO_SETTINGS = {
    videoSrc: 'hero vdo.mp4',
    fallbackImage: 'hero-banner.jpg',
    title: 'Yaschi',
    subtitle: 'A Couture-Core Brand',
    buttonText: 'Shop Now',
    buttonLink: 'shop.html'
};

// Export to window for global access
if (typeof window !== 'undefined') {
    window.INITIAL_CATEGORIES = INITIAL_CATEGORIES;
    window.INITIAL_PRODUCTS = INITIAL_PRODUCTS;
    window.INITIAL_HERO_SETTINGS = INITIAL_HERO_SETTINGS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INITIAL_CATEGORIES,
        INITIAL_PRODUCTS,
        INITIAL_HERO_SETTINGS
    };
}
