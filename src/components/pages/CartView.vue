<template>
  <div class="cart-page">
    <AppNavbar />

    <main class="container cart-content">
      <div class="cart-head">
        <div class="cart-head-left">
          <h2 class="section-title">Your Cart</h2>
          <span class="count-pill"
            >{{ cartStore.totalCount }}
            {{ cartStore.totalCount === 1 ? "item" : "items" }}</span
          >
        </div>
      </div>

      <section class="cart-card">
        <div v-if="!cartStore.items.length" class="empty-cart">
          <i class="ri-shopping-cart-2-line empty-icon"></i>
          <p class="empty-title">Your cart is empty</p>
          <p class="empty-sub">
            Add some products from the shop to get started.
          </p>
          <button
            type="button"
            class="checkout-btn"
            @click="handleContinueShopping"
          >
            Browse Products
          </button>
        </div>

        <div v-else class="cart-list">
          <!-- DESKTOP HEADER -->
          <div class="cart-grid-header">
            <span>Product</span>
            <span></span>
            <span>Price</span>
            <span>Quantity</span>
            <span class="align-right">Total</span>
          </div>

          <!-- CART ITEMS -->
          <article
            v-for="(item, index) in hydratedItems"
            :key="item.key || index"
            class="cart-item"
            :class="{
              swiping: swipingKey === item.key,
              removing: removingKey === item.key,
            }"
            :style="
              swipingKey === item.key
                ? { transform: `translateX(${swipeOffset}px)` }
                : {}
            "
            @mousedown="startSwipe($event, item.key)"
            @touchstart.passive="startSwipe($event, item.key)"
            @mousemove="onSwipeMove($event)"
            @touchmove.passive="onSwipeMove($event)"
            @mouseup="endSwipe(item.key)"
            @touchend="endSwipe(item.key)"
            @mouseleave="cancelSwipe"
          >
            <!-- DELETE HINT (revealed on swipe) -->
            <div
              class="swipe-delete-hint"
              :class="{ visible: swipingKey === item.key && swipeOffset < -40 }"
            >
              <i class="ri-delete-bin-line"></i>
              <span>Remove</span>
            </div>

            <div class="cart-item-image-wrap">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name || 'Product Image'"
                class="cart-item-image"
                @error="handleImageLoadError(item)"
              />
              <div v-else class="no-image">
                <i class="ri-image-line"></i>
              </div>
            </div>

            <div class="cart-item-info">
              <h3 class="item-title">{{ item.name }}</h3>

              <button
                type="button"
                class="desktop-remove-btn"
                @click="handleRemove(item.key)"
              >
                <i class="ri-delete-bin-line"></i>
                Remove
              </button>

              <p class="item-price-mobile">{{ formatRs(item.price) }}</p>
            </div>

            <div class="item-price">{{ formatRs(item.price) }}</div>

            <div class="item-qty-controls">
              <button
                type="button"
                class="qty-btn"
                @click="handleDecrease(item.key)"
              >
                <i class="ri-subtract-line"></i>
              </button>
              <span class="qty-value">{{ item.quantity || 1 }}</span>
              <button
                type="button"
                class="qty-btn"
                @click="handleIncrease(item.key)"
              >
                <i class="ri-add-line"></i>
              </button>
            </div>

            <div class="item-total align-right">
              {{ formatRs(cartStore.getLineTotal(item)) }}
            </div>
          </article>

          <!-- SUMMARY -->
          <div class="cart-summary-block">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">{{ formatRs(grandTotalAmount) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label muted"
                >Shipping & taxes calculated at checkout</span
              >
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total-row">
              <span class="summary-label total-label">Order Total</span>
              <strong class="summary-total">{{ formatRs(grandTotalAmount) }}</strong>
            </div>
          </div>

          <div class="cart-actions">
            <button
              type="button"
              class="continue-btn"
              @click="handleContinueShopping"
            >
              <i class="ri-arrow-left-line"></i> Continue Shopping
            </button>
            <button type="button" class="checkout-btn" @click="handleCheckout">
              Proceed to Checkout <i class="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../../stores/useCartStore.js";
import AppNavbar from "../AppNavbar.vue";
import Footer from "../FooterView.vue";
import { allProducts } from "../../data/products.js";

const router = useRouter();
const cartStore = useCartStore();

// ---------------------------------------------------------------------------
// PRODUCT HYDRATION
// Build a flat lookup map: cartItemKey → { image, price, name, ... }
// The key format used throughout the app is:  "<productId>-<variantName>"
// e.g.  "fabius-lumina-rose-gold-Rose Gold"
// ---------------------------------------------------------------------------
const productLookup = (() => {
  const map = {};
  const mapByProductId = {};
  for (const product of allProducts) {
    const hasMultipleVariants = product.variants.length > 1;
    for (const variant of product.variants) {
      const key = `${product.id}-${variant.name}`;
      const entry = {
        name: hasMultipleVariants
          ? `${product.name} - ${variant.name}`
          : product.name,
        image: variant.image,
        price: variant.baPrice,
        mrp: variant.retailPrice,
        cv: variant.cv,
        productCode: variant.productCode,
        type: product.type,
        category: product.category,
      };
      map[key] = entry;
      // Also index by productCode so SDK-returned productId can match
      if (variant.productCode) {
        mapByProductId[variant.productCode] = entry;
      }
    }
  }
  return { byKey: map, byProductCode: mapByProductId };
})();

/**
 * Merge each raw cart item coming from the store (which may be missing
 * image / price when loaded from a remote backend) with the local product
 * data we already have in products.js.
 *
 * Priority: local products.js data wins for image/price so the cart is
 * always visually correct; everything else falls back to what the store
 * returned (name, quantity, key, etc.).
 */
const hydratedItems = computed(() =>
  cartStore.items.map((item) => {
    const local =
      productLookup.byKey[item.key] ||
      productLookup.byProductCode[item.productId] ||
      productLookup.byProductCode[item.key] ||
      {};
    return {
      ...item,
      image: local.image || item.image || "",
      price: item.price ?? local.price ?? 0,
      name: item.name && item.name !== "Product" ? item.name : (local.name || item.key),
    };
  })
);

// --- SWIPE TO REMOVE ---
const swipingKey = ref(null);
const removingKey = ref(null);
const swipeOffset = ref(0);
let swipeStartX = 0;
let isSwiping = false;

function getClientX(event) {
  return event.touches ? event.touches[0].clientX : event.clientX;
}

function startSwipe(event, key) {
  if (window.innerWidth > 900) return;
  swipingKey.value = key;
  swipeStartX = getClientX(event);
  swipeOffset.value = 0;
  isSwiping = true;
}

function onSwipeMove(event) {
  if (!isSwiping || !swipingKey.value) return;
  const delta = getClientX(event) - swipeStartX;
  if (delta < 0) {
    swipeOffset.value = Math.max(delta, -120);
  } else {
    swipeOffset.value = 0;
  }
}

function getLineTotal(item) {
  const price = Number(item.price) || 0;
  const qty = Number(item.quantity) || 1;
  return price * qty;
}

const grandTotalAmount = computed(() =>
  hydratedItems.value.reduce((sum, item) => sum + getLineTotal(item), 0)
);

async function endSwipe(key) {
  if (!isSwiping) return;
  isSwiping = false;

  if (swipeOffset.value < -80) {
    removingKey.value = key;
    swipeOffset.value = -400;
    await new Promise((r) => setTimeout(r, 300));
    await cartStore.removeItem(key);
    removingKey.value = null;
  } else {
    swipeOffset.value = 0;
  }
  swipingKey.value = null;
}

function cancelSwipe() {
  if (!isSwiping) return;
  isSwiping = false;
  swipeOffset.value = 0;
  swipingKey.value = null;
}

function formatRs(value) {
  if (value === undefined || value === null || value === "") return "N/A";
  const normalizedValue =
    typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  if (normalizedValue === "") return "N/A";
  const parsedNumber = Number(normalizedValue);
  if (!Number.isFinite(parsedNumber)) return `Rs ${value}`;
  const formattedValue = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 20,
  }).format(parsedNumber);
  return `Rs ${formattedValue}`;
}

onMounted(() => {
  cartStore.initializeCount();
  cartStore.refreshCartData();
});

async function handleIncrease(itemKey) {
  await cartStore.increaseItemQuantity(itemKey);
}
async function handleDecrease(itemKey) {
  await cartStore.decreaseItemQuantity(itemKey);
}
async function handleRemove(itemKey) {
  await cartStore.removeItem(itemKey);
}

async function handleCheckout() {
  await cartStore.refreshCartData();
  await router.push({ name: "place-order" });
}

async function handleContinueShopping() {
  await cartStore.refreshCartData();
  await router.push({ name: "shop" });
}

function handleImageLoadError(item) {
  if (!item || !item.key) return;
  const index = cartStore.items.findIndex((row) => row.key === item.key);
  if (index === -1) return;
  cartStore.items[index] = { ...cartStore.items[index], image: "" };
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css");

.cart-page {
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-content {
  padding: 36px 0 60px;
}

/* HEAD */
.cart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.cart-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-title {
  margin: 0;
  color: #0a2240;
  font-size: 24px;
  font-weight: 800;
}
.count-pill {
  background: rgba(0, 61, 165, 0.08);
  color: #003da5;
  border-radius: 999px;
  padding: 4px 12px;
  font-weight: 700;
  font-size: 13px;
}
.continue-btn-top {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(0, 61, 165, 0.2);
  background: #fff;
  color: #003da5;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.continue-btn-top:hover {
  background: #003da5;
  color: #fff;
}

/* CARD */
.cart-card {
  background: #ffffff;
  border: 1px solid rgba(0, 61, 165, 0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 61, 165, 0.04);
}

/* EMPTY STATE */
.empty-cart {
  padding: 80px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-icon {
  font-size: 56px;
  color: rgba(0, 61, 165, 0.15);
}
.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #0a2240;
  margin: 0;
}
.empty-sub {
  font-size: 14px;
  color: #5f6368;
  margin: 0 0 8px;
}

/* CART LIST */
.cart-list {
  display: flex;
  flex-direction: column;
}

/* DESKTOP HEADER */
.cart-grid-header {
  display: grid;
  grid-template-columns: 100px 1fr 160px 160px 140px;
  gap: 16px;
  padding: 14px 28px;
  background: #f8fafc;
  border-bottom: 1px solid rgba(0, 61, 165, 0.06);
  color: #5f6368;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.align-right {
  text-align: right;
}

/* CART ITEM */
.cart-item {
  position: relative;
  display: grid;
  grid-template-columns: 100px 1fr 160px 160px 140px;
  gap: 16px;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid rgba(0, 61, 165, 0.06);
  transition: transform 0.15s ease, background 0.2s;
  cursor: default;
  user-select: none;
  overflow: hidden;
  background: #fff;
}
.cart-item:last-of-type {
  border-bottom: none;
}
.cart-item:hover {
  background: #fafcff;
}
.cart-item.swiping {
  transition: none;
  cursor: grabbing;
}
.cart-item.removing {
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

/* SWIPE DELETE HINT */
.swipe-delete-hint {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 90px;
  background: #fee2e2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  z-index: 0;
}
.swipe-delete-hint i {
  font-size: 20px;
}
.swipe-delete-hint.visible {
  opacity: 1;
}

@media (max-width: 900px) {
  .swipe-delete-hint {
    width: 90px;
  }
}

/* IMAGE */
.cart-item-image-wrap {
  width: 90px;
  height: 90px;
  border: 1px solid rgba(0, 61, 165, 0.08);
  border-radius: 10px;
  overflow: hidden;
  background: #fafafa;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.cart-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0cce0;
  font-size: 24px;
}

.desktop-remove-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 0;
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.desktop-remove-btn:hover {
  color: #b91c1c;
}

.item-action {
  display: flex;
  justify-content: center;
}

/* ITEM INFO */
.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
}
.item-title {
  margin: 0;
  color: #0a2240;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}
.item-price-mobile {
  display: none;
  font-size: 15px;
  font-weight: 700;
  color: #003da5;
  margin: 0;
}

/* PRICE */
.item-price {
  color: #0a2240;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

/* QTY */
.item-qty-controls {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid rgba(0, 61, 165, 0.2);
  border-radius: 50px;
  overflow: hidden;
  background: #fff;
  width: fit-content;
  position: relative;
  z-index: 1;
}
.qty-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #003da5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.15s;
}
.qty-btn:hover {
  background: rgba(0, 61, 165, 0.06);
}
.qty-value {
  min-width: 36px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #0a2240;
  border-left: 1px solid rgba(0, 61, 165, 0.1);
  border-right: 1px solid rgba(0, 61, 165, 0.1);
  line-height: 34px;
}

/* ITEM TOTAL */
.item-total {
  color: #003da5;
  font-size: 15px;
  font-weight: 800;
  position: relative;
  z-index: 1;
}

/* SWIPE HINT TEXT */
.swipe-hint {
  font-size: 12px;
  color: #9aabb8;
  text-align: center;
  padding: 10px 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.swipe-hint i {
  font-size: 14px;
}

/* SUMMARY */
.cart-summary-block {
  padding: 24px 28px 20px;
  border-top: 1px solid rgba(0, 61, 165, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fafcff;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summary-label {
  font-size: 14px;
  color: #5f6368;
  font-weight: 500;
}
.summary-label.muted {
  font-size: 12px;
  color: #9aabb8;
}
.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: #0a2240;
}
.summary-divider {
  height: 1px;
  background: rgba(0, 61, 165, 0.08);
  margin: 4px 0;
}
.total-row {
  margin-top: 4px;
}
.total-label {
  font-size: 16px;
  font-weight: 700;
  color: #0a2240;
}
.summary-total {
  font-size: 22px;
  font-weight: 800;
  color: #003da5;
}

/* ACTIONS */
.cart-actions {
  padding: 20px 28px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-top: 1px solid rgba(0, 61, 165, 0.06);
}
.continue-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(0, 61, 165, 0.2);
  background: #fff;
  color: #003da5;
  border-radius: 50px;
  padding: 11px 22px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.continue-btn:hover {
  background: rgba(0, 61, 165, 0.05);
}
.checkout-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffc72c;
  border: 2px solid #ffc72c;
  color: #0a2240;
  border-radius: 50px;
  padding: 11px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.checkout-btn:hover {
  background: #003da5;
  border-color: #003da5;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 61, 165, 0.3);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .cart-grid-header {
    display: none;
  }
  .continue-btn-top {
    display: none;
  }

  .cart-item {
    grid-template-columns: 90px 1fr;
    grid-template-rows: auto auto;
    gap: 12px;
    padding: 16px 20px;
  }

  .item-price {
    display: none;
  }
  .item-price-mobile {
    display: block;
  }
  .cart-item {
    cursor: grab;
  }

  .item-total {
    padding-right: 12px;
  }

  .desktop-remove-btn {
    display: none;
  }

  .item-qty-controls {
    grid-column: 1;
    grid-row: 2;
    justify-self: start;
  }

  .item-total {
    grid-column: 2;
    grid-row: 2;
    text-align: right;
    align-self: center;
  }

  .cart-summary-block {
    padding: 20px;
  }
  .cart-actions {
    padding: 16px 20px 20px;
    flex-direction: column;
  }
  .continue-btn,
  .checkout-btn {
    width: 100%;
    justify-content: center;
  }
  .summary-total {
    font-size: 20px;
  }
}

@media (max-width: 600px) {
  .cart-content {
    padding: 24px 0 40px;
  }
  .section-title {
    font-size: 20px;
  }
  .cart-item {
    padding: 14px 16px;
  }
  .cart-summary-block {
    padding: 16px;
  }
  .cart-actions {
    padding: 14px 16px 18px;
  }
}
</style>
