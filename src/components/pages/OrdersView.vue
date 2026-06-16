<template>
  <div class="orders-root">
    <AppNavbar />
    <main class="orders-body">
      <h2 class="page-title">My Orders</h2>

      <div v-if="!demoStore.isLoggedIn" class="empty-state">
        <p>Please <router-link to="/login">log in</router-link> to view your orders.</p>
      </div>

      <div v-else-if="!orders.length" class="empty-state">
        <i class="ri-shopping-bag-line empty-icon"></i>
        <p class="empty-title">No orders yet</p>
        <p class="empty-sub">Your completed orders will appear here.</p>
        <router-link to="/shop" class="shop-btn">Browse Products</router-link>
      </div>

      <div v-else class="orders-list">
        <article v-for="order in orders" :key="order.orderId" class="order-card">
          <div class="order-header">
            <div class="order-meta">
              <span class="order-id">{{ order.orderId }}</span>
              <span class="order-date">{{ formatDate(order.placedAt) }}</span>
            </div>
            <div class="order-right">
              <span class="order-total">{{ formatRs(order.total) }}</span>
              <span class="order-status confirmed"><i class="ri-checkbox-circle-fill"></i> {{ order.status }}</span>
            </div>
          </div>

          <div class="order-items">
            <div v-for="(item, i) in order.items" :key="i" class="order-item">
              <div class="item-img">
                <img v-if="item.image" :src="item.image" :alt="item.name" />
                <div v-else class="img-placeholder"><i class="ri-image-line"></i></div>
              </div>
              <div class="item-info">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-qty">Qty: {{ item.quantity }}</p>
              </div>
              <p class="item-price">{{ formatRs(item.price * item.quantity) }}</p>
            </div>
          </div>

          <div v-if="order.address" class="order-footer">
            <i class="ri-map-pin-line"></i>
            <span>{{ order.address.addressLine }}, {{ order.address.city }}, {{ order.address.state }} {{ order.address.pincode }}</span>
          </div>

          <div class="payment-row">
            <span><i class="ri-bank-card-line"></i> {{ order.paymentMethod }}</span>
            <span class="txn-id">Txn: {{ order.txnId }}</span>
          </div>
        </article>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDemoStore } from "../../stores/useDemoStore.js";
import AppNavbar from "../AppNavbar.vue";
import Footer from "../FooterView.vue";

const demoStore = useDemoStore();
const orders = computed(() => demoStore.orders);

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatRs(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "Rs 0";
  return `Rs ${new Intl.NumberFormat("en-IN").format(parsed)}`;
}
</script>

<style scoped>
.orders-root { background: #f8fafc; min-height: 100vh; }
.orders-body { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
.page-title { font-size: 26px; font-weight: 800; color: #0a2240; margin: 0 0 28px; }

.empty-state { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 56px; color: rgba(0,61,165,0.15); }
.empty-title { font-size: 20px; font-weight: 700; color: #0a2240; margin: 0; }
.empty-sub { font-size: 14px; color: #5f6368; margin: 0; }
.empty-state a, .shop-btn { color: #003da5; font-weight: 700; text-decoration: none; }
.shop-btn { margin-top: 8px; background: #ffc72c; color: #0a2240; padding: 11px 28px; border-radius: 50px; font-size: 14px; font-weight: 700; }

.orders-list { display: flex; flex-direction: column; gap: 20px; }

.order-card { background: #fff; border: 1px solid rgba(0,61,165,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,61,165,0.02); }

.order-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; background: #fafcff; border-bottom: 1px solid rgba(0,61,165,0.06); }
.order-meta { display: flex; flex-direction: column; gap: 3px; }
.order-id { font-size: 14px; font-weight: 800; color: #003da5; }
.order-date { font-size: 12px; color: #5a6b82; }
.order-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.order-total { font-size: 18px; font-weight: 800; color: #003da5; }
.order-status.confirmed { font-size: 12px; font-weight: 700; color: #16a34a; display: inline-flex; align-items: center; gap: 4px; }

.order-items { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }

.order-item { display: flex; align-items: center; gap: 14px; }
.item-img { width: 56px; height: 56px; border-radius: 10px; overflow: hidden; border: 1px solid #e2eaf6; background: #f8fafc; flex-shrink: 0; }
.item-img img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 20px; }
.item-info { flex: 1; }
.item-name { margin: 0 0 3px; font-size: 14px; font-weight: 600; color: #0a2240; }
.item-qty { margin: 0; font-size: 12px; color: #5a6b82; }
.item-price { font-size: 14px; font-weight: 700; color: #003da5; white-space: nowrap; }

.order-footer { padding: 10px 20px; background: #f8fafc; border-top: 1px solid rgba(0,61,165,0.05); font-size: 12px; color: #5a6b82; display: flex; align-items: center; gap: 6px; }

.payment-row { padding: 10px 20px; border-top: 1px solid rgba(0,61,165,0.05); display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #5a6b82; }
.txn-id { font-family: monospace; color: #94a3b8; }
</style>