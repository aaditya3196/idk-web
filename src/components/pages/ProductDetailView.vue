<template>
  <div class="product-detail-root">
    <AppNavbar />

    <div class="top-nav">
      <div class="top-nav-inner">
        <nav class="breadcrumb">
          <router-link to="/" class="crumb-link">Home</router-link>
          <span class="sep">/</span>
          <router-link to="/shop" class="crumb-link">Shop</router-link>
          <span class="sep">/</span>
          <span class="leaf">{{ product?.name || "Product Detail" }}</span>
        </nav>
        <router-link to="/shop" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Shop
        </router-link>
      </div>
    </div>

    <main class="page-body">
      <div v-if="product" class="detail-card">
        <div class="image-col">
          <div class="main-image-wrap" :style="{ background: product.imageBg || '#f0f4fa' }">
            <img v-if="activeImage" :src="activeImage" :alt="product.name" />
            <div v-else class="no-image">No Image Available</div>
          </div>
        </div>

        <div class="info-col">
          <div class="product-header">
            <p class="product-type-label">{{ product.type }}</p>
            <h2 class="product-title">{{ product.name }}</h2>
            <div class="price-row">
              <span class="net-price">{{ formatRs(activeVariant.baPrice) }}</span>
              <span class="mrp-price" v-if="activeVariant.retailPrice">{{ formatRs(activeVariant.retailPrice) }}</span>
            </div>
          </div>

          <div v-if="product.variants && product.variants.length > 1" class="variant-switcher">
            <span class="variant-label">Variant:</span>
            <div class="variant-chips">
              <button
                v-for="variant in product.variants"
                :key="variant.name"
                type="button"
                class="variant-chip"
                :class="{ active: activeVariantName === variant.name }"
                @click="setVariant(variant.name)"
              >
                {{ variant.name }}
              </button>
            </div>
          </div>

          <div class="cart-action-block">
            <div class="action-buttons-row">
              <div v-if="cartQuantity === 0" class="add-state">
                <button class="add-to-cart-btn" :class="{ adding: isAddingToCart }" :disabled="isAddingToCart" @click="handleAddToCart">
                  <svg v-if="!isAddingToCart" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  {{ isAddingToCart ? "Adding..." : "Add to Cart" }}
                </button>
              </div>
              <div v-else class="qty-state">
                <div class="qty-controls">
                  <button class="qty-btn" @click="decreaseQty"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                  <span class="qty-count">{{ formatNumericValue(cartQuantity) }}</span>
                  <button class="qty-btn" @click="increaseQty"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                </div>
                <span class="qty-label">in cart</span>
              </div>
              <button type="button" class="buy-now-btn" :disabled="isBuyingNow" @click="handleBuyNow">
                {{ isBuyingNow ? "Please wait..." : "Buy Now" }}
              </button>
            </div>
            <transition name="toast-fade"><div v-if="showToast" class="toast">✓ Added to cart successfully</div></transition>
          </div>

          <div class="description-block">
            <p class="product-description" :class="{ 'expanded': isExpanded }">
              {{ activeVariant.description || product.description || "Description unavailable" }}
            </p>
            <button class="read-more-btn" @click="isExpanded = !isExpanded">
              {{ isExpanded ? "Read Less" : "Read More" }}
            </button>
          </div>

          <template v-if="productSpecifications.length">
            <div class="divider"></div>
            <div class="specs-block">
              <h4 class="specs-title">Specifications</h4>
              <div class="spec-list">
                <div v-for="([key, value], specIndex) in productSpecifications" :key="`${key}-${specIndex}`" class="spec-item">
                  <span class="spec-key">{{ formatSpecKey(key) }}</span>
                  <span class="spec-value">{{ formatSpecValue(value) }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <p v-else class="status-text centered">Product not found.</p>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "../../stores/useCartStore.js";
import AppNavbar from "../AppNavbar.vue";
import Footer from "../FooterView.vue";
import { allProducts } from "../../data/products.js";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const activeVariantName = ref("");
const isAddingToCart = ref(false);
const isBuyingNow = ref(false);
const showToast = ref(false);
const cartQuantity = ref(0);
const isExpanded = ref(false);

const product = computed(() => allProducts.find((p) => p.id === route.params.productId) || null);

const activeVariant = computed(() => {
  if (!product.value || !product.value.variants?.length) return {};
  const name = activeVariantName.value || product.value.variants[0].name;
  return product.value.variants.find((v) => v.name === name) || product.value.variants[0];
});

const activeImage = computed(() => activeVariant.value?.image || "");
const productSpecifications = computed(() => Object.entries(product.value?.specs || {}));

// KEY: always slug-based, consistent across all views
function getCurrentProductKey() {
  if (!product.value) return "";
  const variantName = activeVariantName.value || product.value.variants?.[0]?.name || "";
  return `${product.value.id}-${variantName}`;
}

function buildCartItem() {
  const variant = activeVariant.value;
  const key = getCurrentProductKey();
  const hasMultipleVariants = (product.value.variants?.length || 0) > 1;
  return {
    key,
    // sku and productId both set to the slug key so store can find it reliably
    sku: key,
    productId: key,
    id: product.value.id,
    name: hasMultipleVariants
      ? `${product.value.name} - ${variant.name}`
      : product.value.name,
    type: product.value.type,
    category: product.value.category,
    image: variant.image,
    net_price: variant.baPrice,
    price: variant.baPrice,
    mrp: variant.retailPrice,
    quantity: 1,
    cv: variant.cv,
    productCode: variant.productCode,
  };
}

function syncCartQuantityFromStore() {
  const key = getCurrentProductKey();
  if (!key) { cartQuantity.value = 0; return; }
  const found = cartStore.items.find((i) => i.key === key);
  cartQuantity.value = Number(found?.quantity || 0);
}

onMounted(() => {
  if (product.value?.variants?.length) {
    activeVariantName.value = product.value.variants[0].name;
  }
  cartStore.initializeCount();
  syncCartQuantityFromStore();
});

watch(() => cartStore.items, syncCartQuantityFromStore, { deep: true });

watch(activeVariantName, () => {
  syncCartQuantityFromStore();
});

watch(
  () => route.params.productId,
  () => {
    if (product.value?.variants?.length) {
      activeVariantName.value = product.value.variants[0].name;
    }
    syncCartQuantityFromStore();
  },
  { immediate: true }
);

function formatSpecKey(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}

function formatSpecValue(value) {
  if (Array.isArray(value)) {
    return value.map(e => (e && typeof e === "object" && "item" in e) ? `${e.item} x ${e.qty}` : e).join(", ");
  }
  return (value && typeof value === "object") ? Object.values(value).join(", ") : value;
}

function setVariant(name) {
  activeVariantName.value = name;
}

function formatNumericValue(value) {
  if (value === undefined || value === null || value === "") return null;
  const normalized = typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  if (normalized === "") return null;
  const parsed = Number(normalized);
  return !Number.isFinite(parsed) ? String(value) : new Intl.NumberFormat("en-US", { maximumFractionDigits: 20 }).format(parsed);
}

function formatRs(value) {
  return `Rs ${formatNumericValue(value) ?? value}`;
}

async function handleAddToCart() {
  isAddingToCart.value = true;
  try {
    const item = buildCartItem();
    // Guest-safe local upsert — bypasses API entirely for demo reliability
    const existingIndex = cartStore.items.findIndex((i) => i.key === item.key);
    if (existingIndex > -1) {
      cartStore.items[existingIndex] = {
        ...cartStore.items[existingIndex],
        quantity: (Number(cartStore.items[existingIndex].quantity) || 1) + 1,
      };
    } else {
      cartStore.items.push({ ...item });
    }
    cartStore.persistCartState();
    syncCartQuantityFromStore();
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 2800);
  } finally {
    isAddingToCart.value = false;
  }
}

async function increaseQty() {
  const key = getCurrentProductKey();
  const existing = cartStore.items.find((i) => i.key === key);
  if (!existing) return;
  const idx = cartStore.items.indexOf(existing);
  cartStore.items[idx] = { ...existing, quantity: (Number(existing.quantity) || 1) + 1 };
  cartStore.persistCartState();
  syncCartQuantityFromStore();
}

async function decreaseQty() {
  const key = getCurrentProductKey();
  const existing = cartStore.items.find((i) => i.key === key);
  if (!existing) return;
  const idx = cartStore.items.indexOf(existing);
  const nextQty = (Number(existing.quantity) || 1) - 1;
  if (nextQty <= 0) {
    cartStore.items.splice(idx, 1);
  } else {
    cartStore.items[idx] = { ...existing, quantity: nextQty };
  }
  cartStore.persistCartState();
  syncCartQuantityFromStore();
}

async function handleBuyNow() {
  isBuyingNow.value = true;
  if (cartQuantity.value === 0) {
    await handleAddToCart();
  }
  router.push({ name: "place-order" });
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.product-detail-root {
  --brand-blue: #003da5;
  --brand-yellow: #ffc72c;
  --charcoal-dark: #0a2240;
  --charcoal-body: #2d3748;
  --soft-bg: #f8fafc;
  --border-light: rgba(0, 61, 165, 0.08);
  --muted-gray: #5f6368;
  --pure-white: #ffffff;

  font-family: "Outfit", sans-serif;
  background: var(--soft-bg);
  color: var(--charcoal-body);
  min-height: 100vh;
}

/* TOP NAV */
.top-nav {
  background: var(--pure-white);
  border-bottom: 1px solid var(--border-light);
  padding: 0 24px;
}
.top-nav-inner {
  max-width: 1240px;
  margin: 0 auto;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.crumb-link {
  color: var(--muted-gray);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}
.crumb-link:hover {
  color: var(--brand-blue);
}
.breadcrumb .sep {
  color: #cbd5e0;
}
.breadcrumb .leaf {
  color: var(--brand-blue);
  font-weight: 700;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-blue);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 14px;
  border: 1px solid rgba(0, 61, 165, 0.2);
  border-radius: 8px;
  background: var(--pure-white);
  transition: all 0.2s;
  font-family: "Outfit", sans-serif;
}
.back-link:hover {
  background: var(--brand-blue);
  color: var(--pure-white);
}

/* PAGE BODY */
.page-body {
  max-width: 1240px;
  margin: 0 auto;
  padding: 36px 24px 80px;
}

/* STATUS */
.status-text {
  color: var(--muted-gray);
  font-size: 14px;
}
.status-text.centered {
  text-align: center;
  padding: 80px 0;
}

/* DETAIL CARD */
.detail-card {
  display: grid;
  grid-template-columns: 460px 1fr;
  gap: 0;
  background: var(--pure-white);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 61, 165, 0.05);
}

/* IMAGE COLUMN */
.image-col {
  border-right: 1px solid var(--border-light);
}

.main-image-wrap {
  width: 100%;
  height: 460px;
  overflow: hidden;
  position: relative;
}
.main-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.main-image-wrap:hover img {
  transform: scale(1.03);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-gray);
  font-size: 13px;
  font-weight: 600;
}

/* INFO COLUMN */
.info-col {
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.product-header {
  margin-bottom: 16px;
}
.product-type-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-gray);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 8px;
}
.product-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--charcoal-dark);
  line-height: 1.3;
  margin-bottom: 12px;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
}
.net-price {
  font-size: 28px;
  font-weight: 800;
  color: var(--brand-blue);
}
.mrp-price {
  font-size: 16px;
  color: var(--muted-gray);
  text-decoration: line-through;
}

/* VARIANT SWITCHER */
.variant-switcher {
  margin: 18px 0;
}
.variant-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-gray);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: block;
  margin-bottom: 20px;
}
.variant-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.variant-chip {
  border: 1px solid #d1dbe8;
  background: #f8fafc;
  color: var(--charcoal-dark);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  font-family: "Outfit", sans-serif;
}
.variant-chip:hover {
  border-color: var(--brand-blue);
  color: var(--brand-blue);
}
.variant-chip.active {
  background: var(--brand-blue);
  border-color: var(--brand-blue);
  color: var(--pure-white);
}

.product-description {
  font-size: 14px;
  color: var(--muted-gray);
  line-height: 1.75;
  margin-bottom: 10px;
}

/* CART ACTION */
.cart-action-block {
  margin-bottom: 20px;
}

.action-buttons-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* ADD TO CART — white bg, blue border, no hover effect */
.add-to-cart-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--pure-white);
  border: 2px solid var(--brand-blue);
  color: var(--brand-blue);
  border-radius: 50px;
  padding: 13px 32px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Outfit", sans-serif;
}
.add-to-cart-btn.adding {
  opacity: 0.7;
  cursor: not-allowed;
}
.add-to-cart-btn:disabled {
  cursor: not-allowed;
}

/* BUY NOW — yellow primary style with hover */
.buy-now-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--brand-yellow);
  border: 2px solid var(--brand-yellow);
  color: var(--charcoal-dark);
  border-radius: 50px;
  padding: 13px 32px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: "Outfit", sans-serif;
}
.buy-now-btn:hover:not(:disabled) {
  background: var(--brand-blue);
  border-color: var(--brand-blue);
  color: var(--pure-white);
  box-shadow: 0 4px 16px rgba(0, 61, 165, 0.3);
}
.buy-now-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* QTY CONTROLS */
.qty-state {
  display: flex;
  align-items: center;
  gap: 14px;
}
.qty-controls {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--brand-blue);
  border-radius: 50px;
  overflow: hidden;
  background: var(--pure-white);
}
.qty-btn {
  width: 42px;
  height: 42px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-blue);
  transition: background 0.2s;
}
.qty-btn:hover {
  background: rgba(0, 61, 165, 0.06);
}
.qty-count {
  min-width: 42px;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  color: var(--brand-blue);
  border-left: 1px solid rgba(0, 61, 165, 0.15);
  border-right: 1px solid rgba(0, 61, 165, 0.15);
  padding: 0 4px;
  line-height: 42px;
  font-family: "Outfit", sans-serif;
}
.qty-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted-gray);
}

/* TOAST */
.toast {
  margin-top: 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  border-radius: 8px;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
}
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.divider {
  height: 1px;
  background: #edf2f7;
  margin: 20px 0;
}

/* SPECS */
.specs-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--charcoal-dark);
  text-transform: uppercase;
  letter-spacing: 0.75px;
  margin-bottom: 14px;
}
.spec-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.spec-item {
  background: #f8fafc;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.spec-key {
  font-size: 11px;
  color: var(--muted-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}
.spec-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--charcoal-dark);
}

.description-block {
    margin-bottom: 10px;
}

.product-description {
    font-size: 14px;
    color: var(--muted-gray);
    line-height: 1.75;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: all 0.3s ease;
}

.product-description.expanded {
    -webkit-line-clamp: unset;
}

.read-more-btn {
    background: none;
    border: none;
    color: var(--brand-blue);
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    padding: 0;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .detail-card {
    grid-template-columns: 1fr;
  }
  .image-col {
    border-right: none;
    border-bottom: 1px solid var(--border-light);
  }
  .info-col {
    padding: 28px;
  }
}
@media (max-width: 600px) {
  .spec-list {
    grid-template-columns: 1fr;
  }
  .top-nav-inner {
    height: auto;
    padding: 12px 0;
    flex-wrap: wrap;
    gap: 8px;
  }
  .page-body {
    padding: 24px 16px 60px;
  }
  .action-buttons-row {
    flex-direction: column;
    align-items: stretch;
  }
  .add-to-cart-btn,
  .buy-now-btn {
    width: 100%;
  }
  .qty-state {
    justify-content: space-between;
  }
}
</style>