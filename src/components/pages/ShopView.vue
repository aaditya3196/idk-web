<template>
  <div class="shop-page-root">
    <AppNavbar />

    <div class="hero-full-bleed-row">
      <header class="shop-hero-banner">
        <div class="hero-glow one"></div>
        <div class="hero-glow two"></div>
        <div class="banner-inner-container">
          <nav class="breadcrumb-nav">
            <a href="/" class="crumb-link">Home</a>
            <span class="separator">/</span>
            <span class="active-node">Shop</span>
            <span v-if="selectedCategory !== 'all'">
              <span class="separator">/</span>
              <span class="current-leaf">{{ selectedCategoryLabel }}</span>
            </span>
          </nav>
          <h1 class="page-title-main">{{ selectedCategory === 'all' ? 'All Collections' : selectedCategoryLabel }}</h1>
          <p class="page-subtitle">Premium Collections Crafted to Perfection.</p>
        </div>
      </header>
    </div>

    <div class="content-full-bleed-row">
      <main class="container shop-content">
        <section class="shop-layout">

          <!-- MOBILE CATEGORY TOGGLE BAR -->
          <div class="mobile-category-bar" @click="mobileMenuOpen = !mobileMenuOpen">
            <span class="mobile-cat-label">
              <i class="ri-layout-list-line"></i>
              Browse Categories
            </span>
            <span class="mobile-cat-selected">{{ selectedCategory === 'all' ? 'All Collections' : selectedCategoryLabel }}</span>
            <i class="ri-arrow-down-s-line mobile-chevron" :class="{ open: mobileMenuOpen }"></i>
          </div>

          <!-- CATEGORY PANEL -->
          <aside class="category-panel section-card" :class="{ 'mobile-open': mobileMenuOpen }">
            <div class="section-heading-row">
              <h2 class="section-title">Categories</h2>
              <span class="count-pill">{{ categories.length }}</span>
            </div>
            <div class="category-list">
              <div
                class="category-chip root-chip"
                :class="{ active: selectedCategory === 'all' }"
                @click="selectCategory('all')"
              >
                <span class="category-name">All Collections</span>
                <div class="chip-right">
                  <span class="category-total-count-badge">{{ allProducts.length }}</span>
                </div>
              </div>
              <div
                v-for="cat in categories"
                :key="cat.id"
                class="category-chip root-chip"
                :class="{ active: selectedCategory === cat.id }"
                @click="selectCategory(cat.id)"
              >
                <span class="category-name">{{ cat.name }}</span>
                <div class="chip-right">
                  <span class="category-total-count-badge">{{ getCountForCategory(cat.id) }}</span>
                </div>
              </div>
            </div>
          </aside>

          <section class="products-panel">
            <div class="catalog-header section-card">
              <div class="meta-info">
                <p class="active-category">
                  Showing: <strong>{{ selectedCategory === 'all' ? 'All Collections' : selectedCategoryLabel }}</strong>
                </p>
                <span class="count-summary">{{ displayedProducts.length }} products available</span>
              </div>

              <div class="control-actions">
                <div class="sort-group">
                  <select v-model="sortBy" class="sort-select">
                    <option value="">Sort By</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                  </select>
                </div>

                <button
                  class="filter-toggle-btn"
                  :class="{ active: showFiltersPanel }"
                  type="button"
                  @click="showFiltersPanel = !showFiltersPanel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  <span>{{ showFiltersPanel ? 'Hide Filters' : 'Filters' }}</span>
                </button>

                <div class="layout-toggle-group">
                  <button type="button" class="view-btn" :class="{ active: currentViewLayout === 'grid' }" @click="currentViewLayout = 'grid'" aria-label="Grid View">
                    <i class="ri-grid-fill"></i>
                  </button>
                  <button type="button" class="view-btn" :class="{ active: currentViewLayout === 'list' }" @click="currentViewLayout = 'list'" aria-label="List View">
                    <i class="ri-list-unordered"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- FILTER PANEL -->
            <div v-if="showFiltersPanel" class="filter-panel section-card-nested">
              <h3 class="mini-title">Refine Results</h3>
              <div class="filter-groups">

                <div class="filter-group">
                  <h4 class="filter-group-title">Price Range</h4>
                  <div class="filter-options">
                    <label v-for="range in priceRanges" :key="range.value" class="filter-option">
                      <input type="checkbox" class="custom-checkbox" :checked="selectedPriceRanges.includes(range.value)" @change="togglePriceRange(range.value)" />
                      <span class="checkbox-label-text">{{ range.label }}</span>
                    </label>
                  </div>
                </div>

                <div class="filter-group" v-if="selectedCategory === 'horology' || selectedCategory === 'all'">
                  <h4 class="filter-group-title">Variant</h4>
                  <div class="filter-options">
                    <label v-for="v in variantOptions" :key="v" class="filter-option">
                      <input type="checkbox" class="custom-checkbox" :checked="selectedVariants.includes(v)" @change="toggleVariant(v)" />
                      <span class="checkbox-label-text">{{ v }}</span>
                    </label>
                  </div>
                </div>

                <div class="filter-group" v-if="selectedCategory === 'jewellery' || selectedCategory === 'all'">
                  <h4 class="filter-group-title">Material</h4>
                  <div class="filter-options">
                    <label v-for="m in materialOptions" :key="m" class="filter-option">
                      <input type="checkbox" class="custom-checkbox" :checked="selectedMaterials.includes(m)" @change="toggleMaterial(m)" />
                      <span class="checkbox-label-text">{{ m }}</span>
                    </label>
                  </div>
                </div>

                <div class="filter-group">
                  <h4 class="filter-group-title">Product Type</h4>
                  <div class="filter-options">
                    <label v-for="t in typeOptions" :key="t" class="filter-option">
                      <input type="checkbox" class="custom-checkbox" :checked="selectedTypes.includes(t)" @change="toggleType(t)" />
                      <span class="checkbox-label-text">{{ t }}</span>
                    </label>
                  </div>
                </div>

                <div class="filter-actions-footer">
                  <button type="button" class="apply-filter-btn" @click="showFiltersPanel = false">Apply</button>
                  <button type="button" class="clear-filter-btn" @click="clearFilters">Reset</button>
                </div>
              </div>
            </div>

            <!-- PRODUCTS -->
            <p v-if="!displayedProducts.length" class="status-text catalog-empty section-card">
              No products found for the selected filters.
            </p>

            <div v-else :class="['product-cards-container', `view-${currentViewLayout}`]">
              <article
                v-for="product in displayedProducts"
                :key="product.id"
                class="premium-product-card"
                @click="handleProductClick(product)"
              >
                <!-- IMAGE — no badge, just the photo -->
                <div class="product-image-wrap">
                  <img
                    :src="getActiveImage(product)"
                    :alt="product.name"
                    class="product-img"
                    :style="{ background: product.imageBg || '#f0f4fa' }"
                  />
                </div>

                <div class="product-card-body">
                  <div class="content-text-group">
                    <p class="product-type-label">{{ product.type }}</p>
                    <h3 class="product-name">{{ product.name }}</h3>

                    <!-- SKU now shows the active variant's numeric product code -->
                    <p class="product-sku">SKU: {{ getActiveProductCode(product) }}</p>

                    <!-- VARIANT SWITCHER -->
                    <div v-if="product.variants && product.variants.length > 1" class="variant-switcher" @click.stop>
                      <span class="variant-label">Variant:</span>
                      <div class="variant-chips">
                        <button
                          v-for="variant in product.variants"
                          :key="variant.name"
                          type="button"
                          class="variant-chip"
                          :class="{ active: (activeVariants[product.id] || product.variants[0].name) === variant.name }"
                          @click.stop="setVariant(product.id, variant.name)"
                        >{{ variant.name }}</button>
                      </div>
                    </div>

                    <div class="product-prices">
                      <span class="price-chip net">{{ formatRs(getActivePrice(product, 'ba')) }}</span>
                      <span class="price-chip mrp">{{ formatRs(getActivePrice(product, 'retail')) }}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </section>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppNavbar from "../AppNavbar.vue";
import Footer from "../FooterView.vue";
import fabiusLuminaRoseGold from "@/assets/images/Indikonnect_FabiusLumina_RoseGold.jpg";
import fabiusLuminaGold from "@/assets/images/Indikonnect_FabiusLumina_Gold.jpg";
import fabiusLuminaSteel from "@/assets/images/Indikonnect_FabiusLumina_Steel.jpg";
import fabiusResoluteBlack from "@/assets/images/Indikonnect_FabiusResolute_Black.jpg";
import fabiusResoluteBlue from "@/assets/images/Indikonnect_FabiusResolute_Blue.jpg";
import fabiusResoluteBrown from "@/assets/images/Indikonnect_FabiusResolute_Brown.jpg";
import aureategold1 from "@/assets/images/Indikonnect_AureateGold1_Dinner_Set.jpeg";
import crimsonsoverign1 from "@/assets/images/Indikonnect_CrimsonSoverign1_Dinner_Set.jpeg";
import royalopulence1 from "@/assets/images/Indikonnect_RoyalOpulence1_Dinner_Set.jpeg";
import spectrumluxe1 from "@/assets/images/Indikonnect_SpectrumLuxe1_Dinner_Set.jpeg";


const router = useRouter();
const route = useRoute();
const selectedCategory = ref("all");
const showFiltersPanel = ref(false);
const currentViewLayout = ref("grid");
const mobileMenuOpen = ref(false);
const sortBy = ref("");
const selectedPriceRanges = ref([]);
const selectedVariants = ref([]);
const selectedMaterials = ref([]);
const selectedTypes = ref([]);
const activeVariants = ref({});

onMounted(() => {
  if (route.query.categoryId) {
    selectedCategory.value = route.query.categoryId;
  }
});

watch(
  () => route.query.categoryId,
  (newCategoryId) => {
    selectedCategory.value = newCategoryId || "all";
    clearFilters(); // Resets filters dynamically if switching categories
  }
);

const categories = [
  { id: "horology", name: "Timeless Horology" },
  { id: "dining", name: "Lifestyle Dining" },
  { id: "jewellery", name: "Elegant Jewellery" },
];

const priceRanges = [
  { value: "under-75k", label: "Under ₹75,000" },
  { value: "75k-125k", label: "₹75,000 – ₹1,25,000" },
  { value: "125k-175k", label: "₹1,25,000 – ₹1,75,000" },
  { value: "above-175k", label: "Above ₹1,75,000" },
];

const variantOptions = ["Rose Gold", "Steel", "Gold", "Black", "Brown", "Blue"];
const materialOptions = ["18K Yellow Gold", "Diamond", "Gold Plated"];

// Helper for high-quality inline jewellery placeholder cards
const jewelleryPlaceholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="100%" height="100%" fill="%23fcf8f2"/><circle cx="250" cy="230" r="70" fill="none" stroke="%23dfb06c" stroke-width="4"/><circle cx="250" cy="160" r="15" fill="%23e8f4fd" stroke="%23b0cddb" stroke-width="2"/><text x="50%" y="370" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="600" font-size="17" fill="%238c7653">Fine Jewellery Collection</text><text x="50%" y="400" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="%23b5a182">Image Not Available</text></svg>`;

// NOTE: This array is kept identical to the one in src/data/products.js
const allProducts = [
  // ─── TIMELESS HOROLOGY ───
  {
    id: "fabius-lumina-rose-gold",
    name: "Fabius Lumina Rose Gold",
    category: "horology",
    type: "Watch",
    imageBg: "#f5e6d8",
    specs: {
      movement: "Japanese",
      caseSize: "30.0mm",
      thickness: "6.7mm",
      caseMaterial: "Stainless Steel",
      topGlass: "Flat Sapphire Crystal",
      dial: "MOP with applied indexes",
      bandSize: "19.5mm",
      bandType: "Stainless steel solid separate 5 links bracelet with butterfly clasp",
      waterResistance: "5ATM",
    },
    variants: [
      {
        name: "Rose Gold",
        productCode: "3002610",
        baPrice: 86480,
        retailPrice: 90804,
        cv: 900,
        shippingCost: 750,
        image: fabiusLuminaRoseGold,
        description: "Inspired by the gentle warmth of dawn, the Fabius Lumina Rose Gold is a masterclass in clarity and feminine brilliance. At its heart lies a luminous Mother-of-Pearl dial that catches and refracts the light, creating a continuous, commanding glow. Housed beneath a pristine flat sapphire crystal, the ultra-slim 6.7mm case and elegantly integrated 5-link bracelet drape seamlessly across the wrist. Adorned with a shimmering, stone-set bezel and applied indices, this timepiece is a perfect harmony of graceful elegance and unwavering precision.",
      },
      {
        name: "Steel",
        productCode: "3002611",
        baPrice: 85540,
        retailPrice: 89817,
        cv: 900,
        shippingCost: 750,
        image: fabiusLuminaSteel,
        description: "Striking and sophisticated, the Fabius Lumina Steel draws the eye deep into its iridescent, dark Mother-of-Pearl dial. Enclosed in a sleek 30mm stainless steel silhouette, this timepiece reflects bold clarity and modern confidence. The brilliant, crystal-set bezel and delicately applied indexes create a dramatic, starry contrast against the cool, brushed-steel 5-link bracelet, catching the light dynamically with every movement. A commanding and versatile accessory for the woman who owns her time.",
      },
      {
        name: "Gold",
        productCode: "3002612",
        baPrice: 86480,
        retailPrice: 90804,
        cv: 900,
        shippingCost: 750,
        image: fabiusLuminaGold,
        description: "Radiating pure, classic opulence, the Fabius Lumina Gold frames its ethereal Mother-of-Pearl dial in a rich, golden hue. The flawless flat sapphire crystal protects a face that dances with light, highlighted by a halo of brilliant accents along the bezel and indices. Its solid 5-link bracelet, secured by a seamless butterfly clasp, ensures a delicate yet enduring fit. A celebration of majestic brilliance and commanding grace, designed to illuminate your most cherished moments.",
      },
    ],
  },
  {
    id: "fabius-resolute-black",
    name: "Fabius Resolute Black",
    category: "horology",
    type: "Watch",
    imageBg: "#2d3748",
    specs: {
      movement: "Seagull (Automatic Skeleton)",
      caseSize: "42.0mm",
      caseMaterial: "Stainless Steel",
      topGlass: "Flat Sapphire Crystal",
      bottomGlass: "Flat Mineral Crystal",
      dial: "Texture dial with applied indexes",
      bandSize: "22-20mm",
      bandType: "Stainless steel buckle, Leather Strap",
      waterResistance: "5ATM",
      caseback: "See-through screw caseback",
    },
    variants: [
      {
        name: "Black",
        productCode: "5002610",
        baPrice: 109980,
        retailPrice: 115479,
        cv: 1200,
        shippingCost: 750,
        image: fabiusResoluteBlack,
        description: "A tribute to architectural strength and precision engineering, the Fabius Resolute Black strips away the superfluous to reveal the beating heart within. The see-through skeleton dial and exhibition caseback expose the enduring, rhythmic dance of its automatic mechanics, protected by scratch-resistant flat sapphire crystal. Framed in a bold 42mm stainless steel case and paired with a premium textured black leather strap, this timepiece reflects an unwavering mindset and a strong core. Engineered for the modern man who thrives under pressure.",
      },
      {
        name: "Brown",
        productCode: "5002611",
        baPrice: 111860,
        retailPrice: 117453,
        cv: 1200,
        shippingCost: 750,
        image: fabiusResoluteBrown,
        description: "Blending vintage charm with high-tech mechanical mastery, the Fabius Resolute Brown showcases the exposed, perpetual motion of its automatic skeleton movement. The sophisticated 42mm case is accented by a striking golden bezel, seamlessly transitioning into a rich, textured brown leather strap. Guarded by a flat sapphire crystal, the intricate gears and springs within represent endurance and a resilient core. A timeless, distinguished companion for those who forge their own enduring path.",
      },
      {
        name: "Blue",
        productCode: "5002612",
        baPrice: 109980,
        retailPrice: 115479,
        cv: 1200,
        shippingCost: 750,
        image: fabiusResoluteBlue,
        description: "Bold, dynamic, and unyielding, the Fabius Resolute Blue commands attention with its striking nautical blue chapter ring and perfectly matched textured leather strap. The 42mm stainless steel case houses a fully exposed automatic skeleton movement, offering a transparent display of intricate mechanics through a flawless sapphire crystal. This exposure of the watch's inner workings serves as a daily reminder of inner strength and precision. A timepiece that perfectly balances contemporary, adventurous style with the enduring ability to withstand life's pressures.",
      },
    ],
  },

  // ─── LIFESTYLE DINING ───
  {
    id: "crimson-sovereign-dinner",
    name: "Crimson Sovereign — Dinner Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#fef2f2",
    description: "A 34-piece Porcelain 24kt Gold Plated dinner set of regal elegance. Each piece is finished with intricate gold detailing, bringing the grandeur of a royal table to your home.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 34,
      contents: [
        { item: "Dinner Plate", qty: 6 },
        { item: "Salad Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Salad Bowl", qty: 6 },
        { item: "Spoon", qty: 6 },
        { item: "Large Bowl", qty: 3 },
        { item: "Plate", qty: 1 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002612", baPrice: 184240, retailPrice: 193452, cv: 1800, image: crimsonsoverign1, shippingCost: 1500 },
    ],
  },
  {
    id: "spectrum-luxe",
    name: "Spectrum Luxe — Dinner & Tea Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#f0f4fe",
    description: "A bold 47-piece Porcelain 24kt Gold Plated set with a striking geometrical design. Combining a full dinner and tea service, Spectrum Luxe brings contemporary artistry to the luxury dining table.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 47,
      design: "Geometrical",
      contents: [
        { item: "Dinner Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Dessert Bowl", qty: 6 },
        { item: "Small Bowl", qty: 6 },
        { item: "Casserole", qty: 1 },
        { item: "Casserole Lid", qty: 1 },
        { item: "Platter", qty: 1 },
        { item: "Large Salad Bowl", qty: 2 },
        { item: "Large Bowl", qty: 1 },
        { item: "Tea Cup", qty: 6 },
        { item: "Saucer", qty: 6 },
        { item: "Tea Pot", qty: 1 },
        { item: "Tea Pot Lid", qty: 1 },
        { item: "Milk / Creamer", qty: 1 },
        { item: "Sugar Bowl", qty: 1 },
        { item: "Sugar Bowl Lid", qty: 1 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002611", baPrice: 131600, retailPrice: 138180, cv: 1200, image: spectrumluxe1, shippingCost: 1500 },
    ],
  },
  {
    id: "royal-opulance",
    name: "Royal Opulance — Dinner Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#f0fdf4",
    description: "A sweeping 54-piece Porcelain 24kt Gold Plated dinner set for those who entertain at the highest standard. Royal Opulance is a complete luxury dining experience, with every piece finished in the finest gold detailing.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 54,
      contents: [
        { item: "Soup Bowl", qty: 6 },
        { item: "Soup Spoon", qty: 6 },
        { item: "Dinner Plate", qty: 6 },
        { item: "Salad Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Dessert Bowl", qty: 6 },
        { item: "Small Bowl", qty: 6 },
        { item: "Cassarole", qty: 2 },
        { item: "Cassarole Lid", qty: 2 },
        { item: "Platter", qty: 1 },
        { item: "Large Salad Bowl", qty: 2 },
        { item: "Large Bowl", qty: 1 },
        { item: "Pickle Jar", qty: 2 },
        { item: "Pickle Jar Lid", qty: 2 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002610", baPrice: 183300, retailPrice: 192465, cv: 1800, image: royalopulence1, shippingCost: 1500 },
    ],
  },
  {
    id: "aureate-gold",
    name: "Aureate Gold — Dinner Set",
    category: "dining",
    type: "Dinner Set",
    imageBg: "#fffbeb",
    description: "A refined 20-piece Porcelain 24kt Gold Plated dinner set for intimate dining. Aureate Gold brings warmth and elegance to everyday occasions, with rich gold accents on every piece.",
    specs: {
      material: "Porcelain 24kt Gold Plated",
      pieces: 20,
      contents: [
        { item: "Dinner Plate", qty: 6 },
        { item: "Bread & Butter Plate", qty: 6 },
        { item: "Small Bowl", qty: 6 },
        { item: "Salad Bowl", qty: 1 },
        { item: "Platter", qty: 1 },
      ],
      disclaimer: "Gold Cannot Be Extracted",
    },
    variants: [
      { name: "Standard", productCode: "2002615", baPrice: 69635, retailPrice: 72992, cv: 600, image: aureategold1, shippingCost: 1500 },
    ],
  },

  // ─── ELEGANT JEWELLERY ───
  {
    id: "pendant-cv600-1",
    name: "Diamond Pendant — Amora",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "5 stones / 0.083 CTs",
      goldWeight: "0.3g gross: 0.308g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002610", 
        baPrice: 56250, 
        retailPrice: 58360, 
        cv: 600, 
        image: jewelleryPlaceholder, 
        description: "The Amora Pendant features a modern horizontal bar design with a subtle bridge of light. A sleek, gracefully arched bar of polished 18K gold cradles a horizontal row of graduated diamonds. The minimalist linear setting allows the stones to take center stage, creating a subtle, floating curve of light that rests perfectly along the natural contour of the collarbone. A reflection of modern minimal luxury, engineered for effortless daily wear." 
      },
    ],
  },
  {
    id: "pendant-cv600-2",
    name: "Diamond Pendant — Maya",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "7 stones / 0.112 CTs",
      goldWeight: "0.42g gross: 0.435g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002611", 
        baPrice: 56550, 
        retailPrice: 58750, 
        cv: 600, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Maya Pendant celebrates natural symmetry with a radiant teardrop cluster. A central, brilliant-cut diamond is ringed by an engineered layout of accent stones, working together to amplify fire and reflection. Suspended from an integrated structural loop, this piece captures a timeless aesthetic while adding unmatched, brilliant dimensionality to formal and smart-casual ensembles alike." 
      },
    ],
  },
  {
    id: "pendant-cv600-3",
    name: "Diamond Pendant — Chloe",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "12 stones / 0.145 CTs",
      goldWeight: "0.5g gross: 0.518g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002612", 
        baPrice: 58425, 
        retailPrice: 61048, 
        cv: 600, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Art Deco charm meets clean-lined modern architecture in the Chloe Pendant. This unique rectangular shield layout stacks brilliant diamonds within a subtle, highly polished gold border. Offering clean lines and a distinctly geometric presentation, it is designed for individuals who appreciate sharp elegance and structured, artistic execution." 
      },
    ],
  },
  {
    id: "pendant-cv1200-1",
    name: "Diamond Pendant — Cora",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "22 stones / 0.28 CTs",
      goldWeight: "1.2g gross: 1.235g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002613", 
        baPrice: 123163, 
        retailPrice: 128687, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Cora Pendant offers a spectacular open-weave medallion form that catches light from every angle. Featuring dual concentrated concentric rings of pavé-set diamonds divided by a channel of radiant gold, it provides a striking multi-dimensional landscape. A bold yet remarkably lightweight accessory crafted for red carpets and milestone occasions." 
      },
    ],
  },
  {
    id: "pendant-cv1200-2",
    name: "Diamond Pendant — Diana",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "18 stones / 0.25 CTs",
      goldWeight: "1.15g gross: 1.185g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002614", 
        baPrice: 120775, 
        retailPrice: 126036, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Inspired by classical celestial crowns, the Diana Pendant features an explosive crescent cluster of brilliant-cut diamonds. Each diamond points outward along structural polished gold prongs, maximizing standard dispersion and ambient reflection. This dramatic arrangement bridges historic royal status with contemporary luxury aesthetics." 
      },
    ],
  },
  {
    id: "pendant-cv1200-3",
    name: "Diamond Pendant — Elena",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "16 stones / 0.22 CTs",
      goldWeight: "1.08g gross: 1.112g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002615", 
        baPrice: 119510, 
        retailPrice: 124877, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A sweeping, fluid silhouette defining contemporary minimalism. The Elena Pendant features two overlapping ribbons of premium gold and meticulous pavé diamonds that twist together in a soft, organic wave. Its subtle asymmetric loop represents an endless journey, offering an elegant choice for daily statement styling." 
      },
    ],
  },
  {
    id: "pendant-cv1200-4",
    name: "Diamond Pendant — Freya",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "26 stones / 0.31 CTs",
      goldWeight: "1.32g gross: 1.365g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002616", 
        baPrice: 126990, 
        retailPrice: 132590, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Freya Pendant exhibits an intricate geometric web configuration layout. Inspired by classical architectural structures, its interlocking gold paths hold diamond nodes that form a brilliant floral mosaic pattern. A masterpiece of precise micro-setting execution tailored for sophisticated jewelry connoisseurs." 
      },
    ],
  },
  {
    id: "pendant-cv1200-5",
    name: "Diamond Pendant — Grace",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "24 stones / 0.29 CTs",
      goldWeight: "1.28g gross: 1.315g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002617", 
        baPrice: 127575, 
        retailPrice: 133364, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Capturing the serene balance of water droplets, the Grace Pendant showcases a long, elegant pear-shaped layout outline. The inner drop is micro-paved with brilliant diamonds, while an outer mirror-finished solid gold ring creates a high-contrast protective perimeter. A classic choice that elongates and flatters the neckline beautifully." 
      },
    ],
  },
  {
    id: "pendant-cv1800-1",
    name: "Diamond Pendant — Iris",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "38 stones / 0.45 CTs",
      goldWeight: "1.75g gross: 1.812g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002618", 
        baPrice: 161575, 
        retailPrice: 168792, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "An open shield medallion showcasing complex design and master-level setting. The Iris Pendant frames an elevated central flower motif within layers of precision pavé borders. Designed for maximum light reflection and movement, this substantial piece commands immediate attention across any room." 
      },
    ],
  },
  {
    id: "pendant-cv1800-2",
    name: "Diamond Pendant — Juno",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "42 stones / 0.48 CTs",
      goldWeight: "1.82g gross: 1.875g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002619", 
        baPrice: 163860, 
        retailPrice: 171173, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Juno Pendant exhibits an explosive starburst structure array. Slender rays of 18K yellow gold fan out from a brilliant center diamond cluster, with alternating polished gold lines and diamond tips. This striking graphic design brings structural drama and unmatched energy to high-fashion ensembles." 
      },
    ],
  },
  {
    id: "pendant-cv1800-3",
    name: "Diamond Pendant — Kiara",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "45 stones / 0.52 CTs",
      goldWeight: "1.91g gross: 1.968g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002620", 
        baPrice: 171760, 
        retailPrice: 180796, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A signature statement of high luxury. The Kiara Pendant holds an elegant grid of baguette-cut diamonds, securely framed by brilliant accent rows. Combining structural symmetry with exquisite luxury, it is a timeless investment piece for collectors who value premium craftsmanship." 
      },
    ],
  },
  {
    id: "pendant-cv1800-4",
    name: "Diamond Pendant — Lyra",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "40 stones / 0.46 CTs",
      goldWeight: "1.72g gross: 1.775g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002621", 
        baPrice: 162508, 
        retailPrice: 169988, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Inspired by classical stringed lyres, this pendant features sweeping, harp-like gold lines accented by precise diamond borders. The flowing negative space creates a delicate, lightweight appearance that moves gracefully with every step." 
      },
    ],
  },
  {
    id: "pendant-cv1800-5",
    name: "Diamond Pendant — Nova",
    category: "jewellery",
    type: "Pendant",
    imageBg: "#fdf0e0",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "44 stones / 0.50 CTs",
      goldWeight: "1.85g gross: 1.905g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002622", 
        baPrice: 167560, 
        retailPrice: 174693, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A bold astronomical interpretation featuring clean intersecting cosmic orbit vectors. Rings of polished gold and channels of brilliant diamonds intertwine, centering around an unyielding core diamond. A modern sculptural marvel tailored for progressive tastemakers." 
      },
    ],
  },
  {
    id: "earrings-cv1200-1",
    name: "Diamond Earrings — Opal Halo",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "28 stones / 0.32 CTs",
      goldWeight: "1.35g gross: 1.392g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002623", 
        baPrice: 119890, 
        retailPrice: 125353, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "A master study in classic harmony, the Opal Halo Studs arrange a border of diamonds around a clear central field. Balanced meticulously for weight, they rest flush against the earlobe, making them perfect for luxury daily wear." 
      },
    ],
  },
  {
    id: "earrings-cv1200-2",
    name: "Diamond Earrings — Square Drop",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fef9ec",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "32 stones / 0.36 CTs",
      goldWeight: "1.48g gross: 1.525g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002624", 
        baPrice: 127375, 
        retailPrice: 133075, 
        cv: 1200, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Featuring a cascading geometric drop, these earrings connect a polished square stud to an articulated open drop element. Lined completely with micro-paved stones, they catch the light beautifully with every movement." 
      },
    ],
  },
  {
    id: "earrings-cv1800-1",
    name: "Diamond Earrings — Darlene",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "48 stones / 0.55 CTs",
      goldWeight: "1.92g gross: 1.985g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002625", 
        baPrice: 177575, 
        retailPrice: 185579, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "The Darlene Earrings capture the vibrant energy of a sunrise. Slender arcs of 18K yellow gold fan outward from a central focal point, each ray culminating in a brilliant diamond setting. This cascading drop effect captures movement beautifully, offering an airy, sculptural silhouette that sways gracefully with every turn of the head. Feminine and bold, these earrings are designed to light up the face with an effortless, celebratory glow." 
      },
    ],
  },
  {
    id: "earrings-cv1800-2",
    name: "Diamond Earrings — Faye",
    category: "jewellery",
    type: "Earrings",
    imageBg: "#fff4e6",
    specs: {
      metal: "18K Yellow Gold",
      diamond: "40 stones / 0.221 CTs",
      goldWeight: "1.42g gross: 1.46g",
    },
    variants: [
      { 
        name: "Yellow Gold", 
        productCode: "1002626", 
        baPrice: 183855, 
        retailPrice: 192135, 
        cv: 1800, 
        shippingCost: 750,
        image: jewelleryPlaceholder, 
        description: "Inspired by the concept of eternal grace, the Faye Earrings feature a rhythmic infinity silhouette crafted in 18K yellow gold. Interlocking bands of polished gold and diamond-encrusted curves weave together to form a seamless figure-eight. This intricate overlapping of textures creates a continuous play of light and shadow, resulting in a look that is both fluid and structurally captivating. A sophisticated choice for the modern woman." 
      },
    ],
  },
];


const selectedCategoryLabel = computed(() => {
  const cat = categories.find(c => c.id === selectedCategory.value);
  return cat ? cat.name : "All Collections";
});

function getCountForCategory(catId) {
  return allProducts.filter(p => p.category === catId).length;
}

function getActiveVariant(product) {
  const variantName = activeVariants.value[product.id] || product.variants[0].name;
  return product.variants.find(v => v.name === variantName) || product.variants[0];
}

function getActivePrice(product, type) {
  const v = getActiveVariant(product);
  return type === "ba" ? v.baPrice : v.retailPrice;
}

// Returns the image for the currently selected variant
function getActiveImage(product) {
  return getActiveVariant(product).image;
}

// Returns the numeric productCode for the currently selected variant (used for SKU display)
function getActiveProductCode(product) {
  return getActiveVariant(product).productCode || "-";
}

function setVariant(productId, variantName) {
  activeVariants.value = { ...activeVariants.value, [productId]: variantName };
}

function formatRs(value) {
  if (!value) return "N/A";
  return `Rs ${new Intl.NumberFormat("en-IN").format(value)}`;
}

function selectCategory(catId) {
  selectedCategory.value = catId;
  mobileMenuOpen.value = false;
  clearFilters();
}

function togglePriceRange(val) {
  const idx = selectedPriceRanges.value.indexOf(val);
  if (idx >= 0) selectedPriceRanges.value.splice(idx, 1);
  else selectedPriceRanges.value.push(val);
}

function toggleVariant(val) {
  const idx = selectedVariants.value.indexOf(val);
  if (idx >= 0) selectedVariants.value.splice(idx, 1);
  else selectedVariants.value.push(val);
}

function toggleMaterial(val) {
  const idx = selectedMaterials.value.indexOf(val);
  if (idx >= 0) selectedMaterials.value.splice(idx, 1);
  else selectedMaterials.value.push(val);
}

function toggleType(val) {
  const idx = selectedTypes.value.indexOf(val);
  if (idx >= 0) selectedTypes.value.splice(idx, 1);
  else selectedTypes.value.push(val);
}

function clearFilters() {
  selectedPriceRanges.value = [];
  selectedVariants.value = [];
  selectedMaterials.value = [];
  selectedTypes.value = [];
}

function priceInRange(price, ranges) {
  if (!ranges.length) return true;
  return ranges.some(r => {
    if (r === "under-75k") return price < 75000;
    if (r === "75k-125k") return price >= 75000 && price < 125000;
    if (r === "125k-175k") return price >= 125000 && price < 175000;
    if (r === "above-175k") return price >= 175000;
    return true;
  });
}

const typeOptions = computed(() => {
  const base = allProducts
    .filter(p => selectedCategory.value === "all" || p.category === selectedCategory.value)
    .map(p => p.type);
  return [...new Set(base)];
});

const displayedProducts = computed(() => {
  let list = allProducts.filter(p => {
    if (selectedCategory.value !== "all" && p.category !== selectedCategory.value) return false;
    if (selectedTypes.value.length && !selectedTypes.value.includes(p.type)) return false;
    
    const price = getActivePrice(p, "ba");
    if (!priceInRange(price, selectedPriceRanges.value)) return false;
    
    if (selectedVariants.value.length) {
      const hasVariant = p.variants.some(v => selectedVariants.value.includes(v.name));
      if (!hasVariant) return false;
    }

    // Fixed spec checking to match local array structure vs products.js schema
    if (selectedMaterials.value.length) {
      let productMaterial = "";
      if (p.category === "horology") {
        productMaterial = p.specs?.caseMaterial || "";
      } else if (p.category === "dining") {
        productMaterial = p.specs?.material || "";
      } else if (p.category === "jewellery") {
        productMaterial = p.specs?.metal || "18K Yellow Gold";
      }
      
      const match = selectedMaterials.value.some(mat => 
        productMaterial.toLowerCase().includes(mat.toLowerCase()) || 
        p.name.toLowerCase().includes(mat.toLowerCase())
      );
      if (!match) return false;
    }
    
    return true;
  });

  if (sortBy.value === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy.value === "name-desc") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
  else if (sortBy.value === "price-asc") list = [...list].sort((a, b) => getActivePrice(a, "ba") - getActivePrice(b, "ba"));
  else if (sortBy.value === "price-desc") list = [...list].sort((a, b) => getActivePrice(b, "ba") - getActivePrice(a, "ba"));

  return list;
});

function handleProductClick(product) {
  router.push({ name: "product-detail", params: { productId: product.id } });
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");
@import url("https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css");

* { box-sizing: border-box; margin: 0; padding: 0; }

.shop-page-root {
  --brand-blue: #003da5;
  --brand-yellow: #ffc72c;
  --charcoal-dark: #0a2240;
  --charcoal-body: #2d3748;
  --soft-bg-gray: #f8fafc;
  --border-light: rgba(0, 61, 165, 0.08);
  --muted-gray: #5f6368;
  --pure-white: #ffffff;
  background: var(--soft-bg-gray);
  color: var(--charcoal-body);
  min-height: 100vh;
}

/* HERO */
.hero-full-bleed-row { width: 100%; background: var(--brand-blue); display: block; }
.shop-hero-banner { position: relative; width: 100%; overflow: hidden; display: flex; justify-content: center; padding: 20px 0; }
.hero-glow { position: absolute; border-radius: 50%; filter: blur(100px); }
.hero-glow.one { width: 350px; height: 350px; background: rgba(255,199,44,0.15); top: -100px; right: -50px; }
.hero-glow.two { width: 300px; height: 300px; background: rgba(255,255,255,0.06); bottom: -100px; left: -50px; }
.banner-inner-container { width: 100%; max-width: 1240px; padding: 0 24px; position: relative; z-index: 2; }
.breadcrumb-nav { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 16px; }
.crumb-link { color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.2s; }
.crumb-link:hover { color: var(--pure-white); }
.breadcrumb-nav .separator { color: rgba(255,255,255,0.4); }
.breadcrumb-nav .active-node { color: rgba(255,255,255,0.65); }
.breadcrumb-nav .current-leaf { color: var(--brand-yellow); font-weight: 600; }
.page-title-main { font-size: 44px; font-weight: 800; margin: 0 0 12px; color: var(--brand-yellow); letter-spacing: -0.5px; }
.page-subtitle { margin: 0; font-size: 16px; color: rgba(255,255,255,0.85); }

/* LAYOUT */
.content-full-bleed-row { width: 100%; background: transparent; display: block; }
.shop-content { margin: 0 auto; padding: 50px 24px 80px; max-width: 1240px; }
.shop-layout { display: grid; grid-template-columns: 280px 1fr; gap: 32px; }

/* CARDS */
.section-card { background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 14px; padding: 24px; box-shadow: 0 4px 12px rgba(0,61,165,0.02); }
.section-card-nested { background: var(--pure-white); border: 1px solid var(--brand-blue); border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 18px rgba(0,61,165,0.04); }

/* SECTION HEADING */
.section-heading-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; padding-bottom: 14px; margin-bottom: 18px; }
.section-title { font-size: 14px; font-weight: 700; color: var(--charcoal-dark); text-transform: uppercase; margin: 0; letter-spacing: 0.75px; }
.count-pill { background: rgba(0,61,165,0.06); color: var(--brand-blue); border-radius: 20px; padding: 3px 10px; font-weight: 700; font-size: 12px; }

/* MOBILE TOGGLE */
.mobile-category-bar { display: none; }

/* CATEGORY PANEL */
.category-panel { align-self: start; position: sticky; top: 24px; }
.category-list { display: flex; flex-direction: column; gap: 2px; }

/* CHIPS */
.category-chip { display: flex; align-items: center; justify-content: space-between; border-radius: 8px; padding: 10px 12px; cursor: pointer; transition: background 0.18s ease; text-decoration: none; user-select: none; }
.category-chip:hover { background: rgba(0,61,165,0.04); }
.category-chip.active { background: rgba(0,61,165,0.07); }
.root-chip .category-name { font-size: 14px; font-weight: 600; color: var(--charcoal-dark); }
.root-chip.active .category-name { color: var(--brand-blue); font-weight: 800; }
.chip-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.category-total-count-badge { background: #edf2f7; color: var(--muted-gray); border-radius: 20px; font-size: 11px; padding: 2px 8px; font-weight: 600; }

/* CATALOG HEADER */
.catalog-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; margin-bottom: 28px; }
.active-category { margin: 0; font-size: 15px; color: var(--charcoal-body); }
.active-category strong { color: var(--brand-blue); font-weight: 700; }
.count-summary { font-size: 13px; color: var(--muted-gray); display: block; margin-top: 2px; }
.control-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

/* SORT */
.sort-group { display: flex; align-items: center; }
.sort-select { height: 38px; padding: 0 12px; border: 1px solid rgba(0,61,165,0.2); border-radius: 8px; background: var(--pure-white); color: var(--charcoal-dark); font-size: 13px; font-weight: 600; cursor: pointer; outline: none; font-family: inherit; transition: all 0.2s; }
.sort-select:focus { border-color: var(--brand-blue); }

/* FILTER */
.filter-toggle-btn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(0,61,165,0.2); background: var(--pure-white); color: var(--brand-blue); border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
.filter-toggle-btn.active, .filter-toggle-btn:hover { background: var(--brand-blue); color: var(--pure-white); border-color: var(--brand-blue); }

.layout-toggle-group { display: flex; background: #edf2f7; padding: 4px; border-radius: 8px; gap: 2px; }
.view-btn { border: none; background: transparent; width: 34px; height: 34px; border-radius: 6px; cursor: pointer; color: var(--muted-gray); display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 18px; }
.view-btn.active { background: var(--pure-white); color: var(--brand-blue); box-shadow: 0 2px 6px rgba(0,61,165,0.08); }

/* FILTERS */
.mini-title { margin: 0 0 16px; font-size: 13px; font-weight: 800; color: var(--brand-blue); text-transform: uppercase; letter-spacing: 0.5px; }
.filter-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.filter-group { background: #f8fafc; border: 1px solid var(--border-light); border-radius: 10px; padding: 18px; }
.filter-group-title { margin: 0 0 12px; font-size: 13px; font-weight: 700; color: var(--charcoal-dark); }
.filter-options { display: flex; flex-direction: column; gap: 8px; }
.filter-option { display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; color: var(--charcoal-body); }
.custom-checkbox { appearance: none; width: 16px; height: 16px; border: 1px solid rgba(0,61,165,0.3); border-radius: 4px; outline: none; background: var(--pure-white); cursor: pointer; display: grid; place-content: center; transition: all 0.15s ease; }
.custom-checkbox:checked { background: var(--brand-blue); border-color: var(--brand-blue); }
.custom-checkbox:checked::before { content: ""; width: 8px; height: 8px; background: var(--pure-white); border-radius: 1px; }
.checkbox-label-text { font-weight: 500; }
.filter-actions-footer { grid-column: 1 / -1; display: flex; gap: 12px; margin-top: 8px; padding-top: 14px; border-top: 1px solid #edf2f7; }
.apply-filter-btn { background: var(--brand-blue); color: var(--pure-white); border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.clear-filter-btn { background: transparent; border: 1px solid rgba(0,0,0,0.15); color: var(--muted-gray); padding: 8px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; }

/* PRODUCT GRID */
.product-cards-container.view-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

.premium-product-card { background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.015); }
.premium-product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,61,165,0.06); }

/* PRODUCT IMAGE */
.product-image-wrap { width: 100%; height: 220px; overflow: hidden; border-bottom: 1px solid var(--border-light); }
.product-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
.premium-product-card:hover .product-img { transform: scale(1.04); }

/* CARD BODY */
.product-card-body { padding: 20px; display: flex; flex-direction: column; flex-grow: 1; }
.content-text-group { display: flex; flex-direction: column; gap: 0; }
.product-type-label { font-size: 11px; font-weight: 700; color: var(--muted-gray); text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 4px; }
.product-name { font-size: 16px; font-weight: 700; color: var(--charcoal-dark); margin: 0 0 6px; line-height: 1.4; }
.product-sku { font-size: 11px; color: var(--muted-gray); margin: 0 0 12px; font-family: monospace; letter-spacing: 0.3px; }

/* VARIANT SWITCHER */
.variant-switcher { margin-bottom: 12px; }
.variant-label { font-size: 11px; font-weight: 700; color: var(--muted-gray); text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 6px; }
.variant-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.variant-chip { border: 1px solid #d1dbe8; background: #f8fafc; color: var(--charcoal-dark); border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.variant-chip:hover { border-color: var(--brand-blue); color: var(--brand-blue); }
.variant-chip.active { background: var(--brand-blue); border-color: var(--brand-blue); color: var(--pure-white); }

.product-prices { display: flex; align-items: baseline; gap: 10px; margin-top: 4px; }
.price-chip.net { font-size: 18px; font-weight: 800; color: var(--brand-blue); }
.price-chip.mrp { font-size: 12px; color: var(--muted-gray); text-decoration: line-through; }

/* STATUS */
.status-text { color: var(--muted-gray); margin: 6px 0; font-size: 14px; }
.status-text.catalog-empty { padding: 50px; text-align: center; }

/* LIST VIEW */
.product-cards-container.view-list { display: flex; flex-direction: column; gap: 20px; }
.view-list .premium-product-card { flex-direction: row; min-height: 180px; align-items: stretch; }
.view-list .product-image-wrap { width: 200px; height: auto; border-bottom: none; border-right: 1px solid var(--border-light); flex-shrink: 0; }
.view-list .product-img { height: 100%; }
.view-list .product-card-body { padding: 20px 24px; flex-direction: row; align-items: center; width: 100%; gap: 20px; }
.view-list .product-name { font-size: 18px; }

/* RESPONSIVE */
@media (max-width: 1120px) { .product-cards-container.view-grid { grid-template-columns: repeat(2, 1fr); } }

@media (max-width: 850px) {
  .shop-layout { grid-template-columns: 1fr; gap: 16px; }
  .mobile-category-bar { display: flex; align-items: center; justify-content: space-between; background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 12px; padding: 14px 18px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,61,165,0.04); gap: 10px; }
  .mobile-cat-label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--charcoal-dark); white-space: nowrap; }
  .mobile-cat-label i { font-size: 16px; }
  .mobile-cat-selected { flex: 1; text-align: right; font-size: 13px; font-weight: 600; color: var(--brand-blue); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .mobile-chevron { font-size: 20px; color: var(--muted-gray); flex-shrink: 0; transition: transform 0.25s ease; }
  .mobile-chevron.open { transform: rotate(180deg); }
  .category-panel { position: static; display: none; }
  .category-panel.mobile-open { display: block; }
  .catalog-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .control-actions { width: 100%; justify-content: space-between; }
}

@media (max-width: 600px) {
  .product-cards-container.view-grid { grid-template-columns: 1fr; }
  .view-list .premium-product-card { flex-direction: column; }
  .view-list .product-image-wrap { width: 100%; height: 180px; border-right: none; border-bottom: 1px solid var(--border-light); }
  .filter-groups { grid-template-columns: 1fr; }
  .page-title-main { font-size: 32px; }
  .sort-select { font-size: 12px; }
}
</style>