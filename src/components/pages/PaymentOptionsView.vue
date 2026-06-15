<template>
  <div class="payment-page">
    <AppNavbar v-if="currentScreen === 'select'" />

    <main class="container payment-content">

      <!-- PROGRESS -->
      <div class="checkout-progress" v-if="currentScreen === 'select'">
        <div class="progress-step completed">
          <span class="step-dot"><i class="ri-shopping-cart-2-line"></i></span>
          <span class="step-label">Cart</span>
        </div>
        <div class="progress-line completed"></div>
        <div class="progress-step completed">
          <span class="step-dot"><i class="ri-map-pin-line"></i></span>
          <span class="step-label">Address</span>
        </div>
        <div class="progress-line active"></div>
        <div class="progress-step active">
          <span class="step-dot"><i class="ri-bank-card-line"></i></span>
          <span class="step-label">Payment</span>
        </div>
      </div>

      <!-- ── STEP 1: SELECT PAYMENT METHOD ── -->
      <section v-if="currentScreen === 'select'" class="checkout-grid">
        <section class="left-col">

          <!-- SHIPPING ADDRESS -->
          <div class="panel-card">
            <div class="panel-header">
              <h2 class="panel-title">Shipping Address</h2>
              <button type="button" class="ghost-btn" @click="goToAddressPage">
                <i class="ri-edit-line"></i> Change
              </button>
            </div>
            <p v-if="!selectedShippingAddress" class="status-text">No shipping address selected.</p>
            <div v-else class="selected-address-card">
              <div class="addr-card-top">
                <div class="addr-left-meta">
                  <div class="addr-type-badge">
                    <i :class="getAddressTypeIcon(selectedShippingAddress.addressType)"></i>
                    {{ selectedShippingAddress.label || selectedShippingAddress.addressType || "Home" }}
                  </div>
                  <span class="selected-pill">Delivering here</span>
                </div>
              </div>
              <div class="addr-body">
                <div class="addr-check-col">
                  <div class="radio-ring active"><i class="ri-check-line check-icon"></i></div>
                </div>
                <div class="addr-text-col">
                  <p class="address-name">{{ selectedShippingAddress.fullName || "Address" }}</p>
                  <p class="address-line">{{ selectedShippingAddress.addressLine || "Address line" }}</p>
                  <p class="address-meta">
                    {{ [selectedShippingAddress.city, selectedShippingAddress.state, selectedShippingAddress.pincode].filter(Boolean).join(", ") }}
                  </p>
                  <p v-if="selectedShippingAddress.phone" class="address-meta phone-meta">
                    <i class="ri-phone-line"></i> {{ selectedShippingAddress.phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- PAYMENT METHOD SELECTION -->
          <div class="panel-card">
            <div class="panel-header">
              <h2 class="panel-title">Select Payment Method</h2>
              <div class="secure-badge"><i class="ri-shield-check-line"></i> SSL Secured</div>
            </div>

            <div class="method-radio-list">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="method-radio-card"
                :class="{ selected: selectedMethod === method.value }"
              >
                <input type="radio" name="payment-method" :value="method.value" v-model="selectedMethod" />
                <div class="method-radio-inner">
                  <div class="method-radio-dot" :class="{ active: selectedMethod === method.value }">
                    <span v-if="selectedMethod === method.value"></span>
                  </div>
                  <div class="method-icon-wrap">
                    <i :class="method.icon"></i>
                  </div>
                  <div class="method-text">
                    <p class="method-label">{{ method.label }}</p>
                    <p class="method-sub">{{ method.description }}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- BILLING ADDRESS -->
          <div class="panel-card">
            <h2 class="panel-title" style="margin-bottom: 16px;">Billing Address</h2>
            <div class="billing-mode-group">
              <label class="billing-mode-card" :class="{ selected: billingMode === 'same' }">
                <input v-model="billingMode" type="radio" name="billing-mode" value="same" />
                <div class="radio-ring" :class="{ active: billingMode === 'same' }">
                  <i v-if="billingMode === 'same'" class="ri-check-line check-icon"></i>
                </div>
                <div class="mode-text">
                  <p class="option-title">Same as shipping address</p>
                  <p class="option-sub" v-if="selectedShippingAddress">{{ selectedShippingAddress.addressLine }}</p>
                </div>
              </label>
              <label class="billing-mode-card" :class="{ selected: billingMode === 'different' }">
                <input v-model="billingMode" type="radio" name="billing-mode" value="different" />
                <div class="radio-ring" :class="{ active: billingMode === 'different' }">
                  <i v-if="billingMode === 'different'" class="ri-check-line check-icon"></i>
                </div>
                <div class="mode-text">
                  <p class="option-title">Use a different billing address</p>
                  <p class="option-sub">Select or save a billing address</p>
                </div>
              </label>
            </div>

            <div v-if="billingMode === 'different'" class="billing-panel">
              <div class="billing-panel-header">
                <h3 class="sub-title">Billing Address</h3>
                <button type="button" class="add-addr-btn" @click="toggleBillingForm">
                  <i class="ri-add-line"></i> Add New
                </button>
              </div>
              <AddressFormCard
                :show="showBillingForm"
                :form="billingForm"
                :address-types="addressTypes"
                :error-message="addressError"
                :is-editing="editingBillingAddressId !== null"
                :mode-label="editingBillingAddressId !== null ? 'Edit Billing Address' : 'Add Billing Address'"
                @update-field="updateBillingField"
                @cancel="cancelBillingForm"
                @submit="saveBillingAddress"
              />
              <p v-if="isAddressLoading" class="status-text">Loading addresses...</p>
              <p v-else-if="!billingCandidateAddresses.length && !showBillingForm" class="status-text">
                No additional addresses found. Use Add New to save a billing address.
              </p>
              <div class="address-list" v-if="billingCandidateAddresses.length">
                <article
                  v-for="address in billingCandidateAddresses"
                  :key="address.id"
                  class="address-card"
                  :class="{ selected: selectedBillingAddressId === address.id }"
                  @click="selectedBillingAddressId = address.id"
                >
                  <div class="addr-card-top">
                    <div class="addr-left-meta">
                      <div class="addr-type-badge">
                        <i :class="getAddressTypeIcon(address.addressType)"></i>
                        {{ address.label || address.addressType || "Home" }}
                      </div>
                    </div>
                    <div class="addr-right-actions">
                      <button type="button" class="icon-action-btn" @click.stop="startEditBillingAddress(address.id)">
                        <i class="ri-edit-line"></i>
                      </button>
                      <button type="button" class="icon-action-btn danger" @click.stop="removeBillingAddress(address.id)">
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <div class="addr-body">
                    <div class="addr-check-col">
                      <div class="radio-ring" :class="{ active: selectedBillingAddressId === address.id }">
                        <i v-if="selectedBillingAddressId === address.id" class="ri-check-line check-icon"></i>
                      </div>
                    </div>
                    <div class="addr-text-col">
                      <p class="address-name">{{ address.fullName || "Address" }}</p>
                      <p class="address-line">{{ address.addressLine || "Address line" }}</p>
                      <p class="address-meta">{{ [address.city, address.state, address.pincode].filter(Boolean).join(", ") }}</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

        </section>

        <!-- RIGHT COL -->
        <section class="right-col">
          <div class="summary-card">
            <h2 class="col-title">Order Summary</h2>
            <div class="summary-items">
              <div v-for="(item, index) in checkoutItems" :key="item.key || index" class="summary-item">
                <div class="summary-item-img">
                  <img v-if="item.image" :src="item.image" :alt="item.name" />
                  <div v-else class="img-placeholder"><i class="ri-image-line"></i></div>
                </div>
                <div class="summary-item-info">
                  <p class="summary-item-name">{{ item.name }}</p>
                  <p class="summary-item-sku" v-if="item.sku">SKU: {{ item.sku }}</p>
                  <p class="summary-item-qty">Qty: {{ item.quantity || 1 }}</p>
                </div>
                <p class="summary-item-price">{{ formatRs(getLineTotal(item)) }}</p>
              </div>
            </div>
            <div class="summary-totals">
              <div class="total-row"><span>Subtotal</span><span>{{ formatRs(orderSubtotal) }}</span></div>
              <div class="total-row"><span>Shipping</span><span class="free-tag">Free</span></div>
              <div class="total-row grand"><span>Total</span><strong>{{ formatRs(orderSubtotal) }}</strong></div>
            </div>
          </div>

          <div class="cta-group">
            <router-link to="/place-order" class="cta-ghost">
              <i class="ri-arrow-left-line"></i> Back to Address
            </router-link>
            <button
              type="button"
              class="cta-primary"
              :disabled="!selectedMethod"
              @click="proceedToGateway"
            >
              <i class="ri-lock-line"></i>
              Proceed to Pay {{ formatRs(orderSubtotal) }}
            </button>
          </div>

          <div class="security-note">
            <i class="ri-shield-keyhole-line"></i>
            <span>Your payment information is encrypted and secure. We never store your card details.</span>
          </div>
        </section>
      </section>

      <!-- ── STEP 2: mSWIPE-STYLE GATEWAY ── -->
      <div v-if="currentScreen === 'gateway'" class="gateway-screen">
        <div class="gateway-wrap">

          <!-- LEFT: Payment Details -->
          <div class="gw-left">
            <div class="gw-amount-box">
              <p class="gw-to-pay">To Pay</p>
              <p class="gw-amount">₹ {{ formatAmount(orderSubtotal) }}</p>
              <div class="gw-expiry-tag">
                <i class="ri-time-line"></i> Link expiry: {{ gatewayExpiry }}
              </div>
            </div>
            <div class="gw-meta-box">
              <div class="gw-meta-row">
                <span>Transaction ID:</span>
                <strong>{{ generatedTxnId }}</strong>
              </div>
              <div class="gw-meta-row">
                <span>Payment request from:</span>
                <strong>www.indikonnect.com</strong>
              </div>
            </div>
          </div>

          <!-- Right: Payment Method UI -->
          <div class="gw-right">
            <p class="gw-right-title">Select Payment Method</p>

            <!-- METHOD TABS -->
            <div class="gw-tabs">
              <button
                v-for="tab in gatewayTabs"
                :key="tab.value"
                type="button"
                class="gw-tab"
                :class="{ active: gatewayTab === tab.value }"
                @click="gatewayTab = tab.value; resetGatewayTabState()"
              >{{ tab.label }}</button>
            </div>

            <!-- CARD TAB -->
            <div v-if="gatewayTab === 'card'" class="gw-tab-content">
              <p class="gw-tab-label">Enter Card Details</p>
              <input v-model="gwCardNumber" type="text" placeholder="Card Number" class="gw-input" maxlength="19" @input="formatGwCardNumber" />
              <input v-model="gwCardName" type="text" placeholder="Card Holder Name" class="gw-input" />
              <div class="gw-row">
                <input v-model="gwCardExpiry" type="text" placeholder="MM/YY" class="gw-input" maxlength="5" @input="formatGwExpiry" />
                <input v-model="gwCardCvv" type="password" placeholder="CVV" class="gw-input" maxlength="4" />
              </div>
              <button type="button" class="gw-proceed-btn" :disabled="!gwCardReady" @click="initiateCardOtp">Proceed</button>
            </div>

            <!-- UPI TAB -->
            <div v-if="gatewayTab === 'upi'" class="gw-tab-content">
              <div class="gw-qr-wrap">
                <div class="gw-qr-box">
                  <div class="gw-qr-grid">
                    <div v-for="i in 64" :key="i" class="gw-qr-cell" :class="{ filled: qrPattern[i % qrPattern.length] }"></div>
                  </div>
                  <div class="gw-qr-logo"><i class="ri-secure-payment-line"></i></div>
                </div>
                <p class="gw-qr-expiry"><i class="ri-time-line"></i> QR code expires in {{ qrCountdown }}</p>
                <p class="gw-qr-hint">SCAN WITH <strong>BHIM · UPI</strong> APPS TO PAY</p>
              </div>
              <div class="gw-upi-divider">or enter UPI ID</div>
              <div class="gw-upi-id-row">
                <input v-model="gwUpiId" type="text" placeholder="yourname@upi" class="gw-input" style="flex:1;" />
                <button type="button" class="gw-verify-btn" @click="verifyGwUpi">{{ gwUpiVerified ? '✓' : 'Verify' }}</button>
              </div>
              <button type="button" class="gw-proceed-btn" :disabled="!gwUpiVerified" @click="initiateUpiPay">Pay Now</button>
            </div>

            <!-- NETBANKING TAB -->
            <div v-if="gatewayTab === 'netbanking'" class="gw-tab-content">
              <p class="gw-tab-label">Select your bank</p>
              <div class="gw-bank-list">
                <label v-for="bank in gatewayBanks" :key="bank.value" class="gw-bank-row" :class="{ selected: gwSelectedBank === bank.value }">
                  <input type="radio" :value="bank.value" v-model="gwSelectedBank" />
                  <div class="gw-bank-dot" :class="{ active: gwSelectedBank === bank.value }"></div>
                  <div class="gw-bank-info">
                    <span class="gw-bank-initials" :style="{ background: bank.color }">{{ bank.initials }}</span>
                    <span class="gw-bank-name">{{ bank.label }}</span>
                  </div>
                </label>
              </div>
              <button type="button" class="gw-proceed-btn" :disabled="!gwSelectedBank" @click="initiateNetbanking">Proceed</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── STEP 3: CARD OTP SCREEN ── -->
      <div v-if="currentScreen === 'cardOtp'" class="otp-screen">
        <div class="otp-card">
          <div class="otp-bank-logo"><i class="ri-bank-fill"></i></div>
          <h3 class="otp-title">3D Secure Authentication</h3>
          <p class="otp-sub">An OTP has been sent to your registered mobile number ending in <strong>••••{{ otpMaskedPhone }}</strong></p>

          <div class="otp-amount-strip">
            <span>Amount</span>
            <strong>₹ {{ formatAmount(orderSubtotal) }}</strong>
          </div>

          <div class="otp-input-row">
            <input
              v-for="(digit, i) in otpDigits"
              :key="i"
              :ref="el => { if (el) otpRefs[i] = el }"
              v-model="otpDigits[i]"
              type="text"
              maxlength="1"
              class="otp-digit"
              @input="onOtpInput(i)"
              @keydown.backspace="onOtpBackspace(i, $event)"
            />
          </div>

          <p class="otp-timer">
            <span v-if="otpSecondsLeft > 0">Resend OTP in <strong>{{ otpSecondsLeft }}s</strong></span>
            <button v-else type="button" class="resend-link" @click="restartOtpTimer">Resend OTP</button>
          </p>

          <p v-if="otpError" class="otp-error">{{ otpError }}</p>

          <button type="button" class="gw-proceed-btn" :disabled="otpDigits.join('').length < 6 || otpVerifying" @click="verifyCardOtp">
            {{ otpVerifying ? 'Verifying...' : 'Verify & Pay' }}
          </button>

          <button type="button" class="otp-back-link" @click="currentScreen = 'gateway'">
            <i class="ri-arrow-left-line"></i> Back
          </button>
        </div>
      </div>

      <!-- ── STEP 4: PROCESSING ── -->
      <div v-if="currentScreen === 'processing'" class="processing-fullscreen">
        <div class="processing-card">
          <div class="processing-spinner"></div>
          <p class="processing-title">Processing Payment</p>
          <p class="processing-sub">Please do not close or refresh this page...</p>
          <div class="processing-amount">₹ {{ formatAmount(orderSubtotal) }}</div>
        </div>
      </div>

      <!-- ── STEP 5: SUCCESS ── -->
      <div v-if="currentScreen === 'success'" class="success-screen">
        <div class="success-animation">
          <div class="success-circle"><i class="ri-checkbox-circle-fill"></i></div>
        </div>
        <h2 class="success-title">Payment Successful!</h2>
        <p class="success-subtitle">Your order has been placed successfully.</p>

        <div class="success-detail-card">
          <div class="success-detail-header">
            <span class="success-detail-label">Order Confirmation</span>
            <span class="success-order-id">{{ generatedOrderId }}</span>
          </div>
          <div class="success-rows">
            <div class="success-row"><span>Payment Method</span><strong>{{ successPaymentLabel }}</strong></div>
            <div class="success-row"><span>Amount Paid</span><strong>{{ formatRs(orderSubtotal) }}</strong></div>
            <div class="success-row"><span>Transaction ID</span><strong>{{ generatedTxnId }}</strong></div>
            <div class="success-row"><span>Date & Time</span><strong>{{ paymentTimestamp }}</strong></div>
            <div class="success-row">
              <span>Status</span>
              <strong class="status-success"><i class="ri-checkbox-circle-fill"></i> Paid</strong>
            </div>
          </div>
          <div class="success-items-section">
            <p class="success-items-title">Items Ordered</p>
            <div v-for="(item, index) in checkoutItems" :key="item.key || index" class="success-item-row">
              <span class="success-item-name">{{ item.name }} <span class="success-item-qty">× {{ item.quantity || 1 }}</span></span>
              <span class="success-item-price">{{ formatRs(getLineTotal(item)) }}</span>
            </div>
            <div class="success-item-row grand-row">
              <span>Total</span>
              <strong>{{ formatRs(orderSubtotal) }}</strong>
            </div>
          </div>
        </div>

        <p class="redirect-note"><i class="ri-loader-4-line spin"></i> Redirecting to shop in {{ redirectCountdown }}s...</p>
      </div>

      <p v-if="isLoading" class="status-text centered">Loading payment details...</p>
      <p v-if="!isLoading && errorMessage && currentScreen === 'select'" class="status-text error centered">{{ errorMessage }}</p>

    </main>

    <!-- Footer only on select screen -->
    <Footer v-if="currentScreen === 'select'" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getCustomerAddress, getToken, refreshCart } from "rdep-ecom-sdk";
import { useAppStore } from "../../stores/useAppStore.js";
import { useCartStore } from "../../stores/useCartStore.js";
import { allProducts } from "../../data/products.js";
import AddressFormCard from "./AddressFormCard.vue";
import AppNavbar from "../AppNavbar.vue";
import Footer from "../FooterView.vue";

const cartStore = useCartStore();
const appStore = useAppStore();
const router = useRouter();

// ── SCREENS: select | gateway | cardOtp | processing | success ──
const currentScreen = ref("select");

const isLoading = ref(false);
const isAddressLoading = ref(false);
const isSavingAddress = ref(false);
const errorMessage = ref("");
const addressError = ref("");

const addresses = ref([]);
const selectedShippingAddressId = ref(null);
const selectedBillingAddressId = ref(null);
const billingMode = ref("same");
const showBillingForm = ref(false);
const editingBillingAddressId = ref(null);
const checkoutItems = ref([]);

const generatedOrderId = ref("");
const generatedTxnId = ref("");
const paymentTimestamp = ref("");
const successPaymentLabel = ref("");

// ── PRODUCT HYDRATION — mirrors CartView / PlaceOrderView ──
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
      };

      map[key] = entry;

      if (variant.productCode) {
        mapByProductId[variant.productCode] = entry;
      }
    }
  }

  return {
    byKey: map,
    byProductCode: mapByProductId,
  };
})();

function hydrateItems(items) {
  return items.map((item) => {
    const local =
      productLookup.byKey[item.key] ||
      productLookup.byProductCode[item.productId] ||
      productLookup.byProductCode[item.key] ||
      {};

    return {
      ...item,
      image: local.image || item.image || "",
      price: item.price ?? local.price ?? 0,
      mrp: item.mrp ?? local.mrp ?? 0,
      name:
        item.name && item.name !== "Product"
          ? item.name
          : (local.name || item.key),
    };
  });
}

// ── PAYMENT METHOD SELECTION ──
const selectedMethod = ref("");

const paymentMethods = [
  { value: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, RuPay — secured with 3D OTP", icon: "ri-bank-card-line" },
  { value: "upi", label: "UPI", description: "Google Pay, PhonePe, BHIM, Paytm & more", icon: "ri-smartphone-line" },
  { value: "netbanking", label: "Net Banking", description: "All major Indian banks supported", icon: "ri-building-line" },
];

// ── GATEWAY SCREEN STATE ──
const gatewayTab = ref("card");
const gatewayExpiry = ref("");

const gatewayTabs = [
  { value: "card", label: "Credit / Debit Card" },
  { value: "upi", label: "UPI" },
  { value: "netbanking", label: "Net Banking" },
];

// Card inside gateway
const gwCardNumber = ref("");
const gwCardName = ref("");
const gwCardExpiry = ref("");
const gwCardCvv = ref("");

const gwCardReady = computed(() =>
  gwCardNumber.value.replace(/\s/g, "").length >= 12 &&
  gwCardName.value.trim().length > 2 &&
  gwCardExpiry.value.length === 5 &&
  gwCardCvv.value.length >= 3
);

function formatGwCardNumber() {
  let val = gwCardNumber.value.replace(/\D/g, "").slice(0, 16);
  val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
  gwCardNumber.value = val;
}

function formatGwExpiry() {
  let val = gwCardExpiry.value.replace(/\D/g, "").slice(0, 4);
  if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
  gwCardExpiry.value = val;
}

// UPI inside gateway
const gwUpiId = ref("");
const gwUpiVerified = ref(false);

// QR countdown
const qrCountdown = ref("05:00");
let qrTimer = null;

function startQrTimer() {
  let total = 300;
  clearInterval(qrTimer);
  qrTimer = setInterval(() => {
    total--;
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    qrCountdown.value = `${m}:${s}`;
    if (total <= 0) clearInterval(qrTimer);
  }, 1000);
}

// Fake QR pattern
const qrPattern = Array.from({ length: 32 }, (_, i) => [0,1,3,5,7,8,10,12,14,15,18,20,22,24,25,27,29,31].includes(i));

async function verifyGwUpi() {
  await new Promise(r => setTimeout(r, 500));
  if (gwUpiId.value.includes("@")) gwUpiVerified.value = true;
}

// Netbanking inside gateway
const gwSelectedBank = ref("");

const gatewayBanks = [
  { value: "sbi", label: "State Bank of India", initials: "SBI", color: "#1a3a6b" },
  { value: "hdfc", label: "HDFC Bank", initials: "HDFC", color: "#004c8f" },
  { value: "icici", label: "ICICI Bank", initials: "ICICI", color: "#f26522" },
  { value: "axis", label: "Axis Bank", initials: "AXIS", color: "#97144d" },
  { value: "kotak", label: "Kotak Mahindra Bank", initials: "KMB", color: "#e62222" },
  { value: "bob", label: "Bank of Baroda", initials: "BOB", color: "#f47920" },
];

function resetGatewayTabState() {
  gwCardNumber.value = "";
  gwCardName.value = "";
  gwCardExpiry.value = "";
  gwCardCvv.value = "";
  gwUpiId.value = "";
  gwUpiVerified.value = false;
  gwSelectedBank.value = "";
  if (gatewayTab.value === "upi") startQrTimer();
}

watch(gatewayTab, (val) => {
  if (val === "upi") startQrTimer();
  else clearInterval(qrTimer);
});

// ── OTP SCREEN ──
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const otpSecondsLeft = ref(30);
const otpError = ref("");
const otpVerifying = ref(false);
const otpMaskedPhone = ref("89");
let otpTimerInterval = null;

function startOtpTimer() {
  otpSecondsLeft.value = 30;
  clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    otpSecondsLeft.value--;
    if (otpSecondsLeft.value <= 0) clearInterval(otpTimerInterval);
  }, 1000);
}

function restartOtpTimer() {
  otpDigits.value = ["", "", "", "", "", ""];
  otpError.value = "";
  startOtpTimer();
}

function onOtpInput(index) {
  const val = otpDigits.value[index];
  if (val && index < 5) {
    otpRefs.value[index + 1]?.focus();
  }
}

function onOtpBackspace(index, event) {
  if (!otpDigits.value[index] && index > 0) {
    event.preventDefault();
    otpDigits.value[index - 1] = "";
    otpRefs.value[index - 1]?.focus();
  }
}

// ── SUCCESS / REDIRECT ──
const redirectCountdown = ref(6);
let redirectTimer = null;

// ── NAVIGATION FUNCTIONS ──
function proceedToGateway() {
  if (!selectedMethod.value) return;

  const exp = new Date(Date.now() + 35 * 60 * 1000);
  gatewayExpiry.value = exp.toLocaleString("en-IN", { year: "numeric", month: "short", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit" });

  generatedTxnId.value = "IPG" + Math.floor(Math.random() * 1e12).toString().padStart(12, "0");

  gatewayTab.value = selectedMethod.value === "card" ? "card" : selectedMethod.value === "upi" ? "upi" : "netbanking";

  if (gatewayTab.value === "upi") startQrTimer();

  currentScreen.value = "gateway";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function initiateCardOtp() {
  startOtpTimer();
  otpDigits.value = ["", "", "", "", "", ""];
  otpError.value = "";
  currentScreen.value = "cardOtp";
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => otpRefs.value[0]?.focus(), 100);
}

async function verifyCardOtp() {
  otpVerifying.value = true;
  otpError.value = "";
  await new Promise(r => setTimeout(r, 1200));

  const entered = otpDigits.value.join("");
  if (entered.length === 6) {
    clearInterval(otpTimerInterval);
    successPaymentLabel.value = `Card ending ••${gwCardNumber.value.replace(/\s/g, "").slice(-4)}`;
    await processPayment();
  } else {
    otpError.value = "Invalid OTP. Please try again.";
  }
  otpVerifying.value = false;
}

async function initiateUpiPay() {
  successPaymentLabel.value = gwUpiId.value || "UPI";
  await processPayment();
}

async function initiateNetbanking() {
  const bank = gatewayBanks.find(b => b.value === gwSelectedBank.value);
  successPaymentLabel.value = bank?.label || "Net Banking";
  await processPayment();
}

async function processPayment() {
  currentScreen.value = "processing";
  window.scrollTo({ top: 0, behavior: "smooth" });

  await new Promise(r => setTimeout(r, 2500));

  generatedOrderId.value = "ORD-" + Math.floor(100000000 + Math.random() * 900000000);
  paymentTimestamp.value = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  currentScreen.value = "success";
  window.scrollTo({ top: 0, behavior: "smooth" });

  redirectCountdown.value = 6;
  redirectTimer = setInterval(() => {
    redirectCountdown.value--;
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectTimer);
      // TODO: call cartStore.clearCartAfterPayment() before redirect
      router.push({ name: "shop" });
    }
  }, 1000);
}

// ── ADDRESS HELPERS ──
const addressTypes = [
  { value: "Home", label: "Home", icon: "ri-home-4-line" },
  { value: "Office", label: "Office", icon: "ri-building-line" },
  { value: "Other", label: "Other", icon: "ri-map-pin-line" },
];

const billingForm = ref({
  addressType: "Home", fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "",
});

const selectedShippingAddress = computed(
  () => addresses.value.find(e => e.id === selectedShippingAddressId.value) || null,
);

const billingCandidateAddresses = computed(() =>
  addresses.value.filter(e => e.id !== selectedShippingAddressId.value),
);

const orderSubtotal = computed(() =>
  checkoutItems.value.reduce((sum, item) => sum + getLineTotal(item), 0),
);

function getAddressTypeIcon(type) {
  const found = addressTypes.find(t => t.value === type);
  return found ? found.icon : "ri-map-pin-line";
}

function normalizeAddressesFromResponse(response) {
  const root = response?.data || response || {};
  const nested = root?.data || {};
  const list =
    (Array.isArray(root) ? root : null) ||
    root.addresses || root.addressList || root.customerAddresses || root.items ||
    nested.addresses || nested.addressList || nested.customerAddresses || nested.items || [];
  if (!Array.isArray(list)) return [];
  return list.map((entry, index) => {
    const rawId = entry?.id ?? entry?.addressId ?? entry?.customerAddressId;
    const parsedId = Number(rawId);
    const nextId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : index + 1;
    const typeRaw = String(entry?.tag || entry?.addressType || entry?.type || "Home").trim();
    const addressType = typeRaw.toLowerCase() === "office" ? "Office" : typeRaw.toLowerCase() === "other" ? "Other" : "Home";
    const addressLabel = String(entry?.label || entry?.tag || addressType).trim();
    const isDefaultRaw = entry?.isDefault ?? entry?.defaultDeliveryAddress ?? entry?.defaultAddress ?? entry?.is_default ?? entry?.default;
    const addressLine = entry?.addressLine || entry?.address ||
      [entry?.addressLine1, entry?.addressLine2, entry?.addressLine3].filter(Boolean).join(", ") ||
      entry?.address1 || entry?.line1 || "";
    const isDefault = isDefaultRaw === true || isDefaultRaw === 1 || isDefaultRaw === "1" ||
      String(isDefaultRaw || "").toUpperCase() === "Y" || String(isDefaultRaw || "").toLowerCase() === "true";
    return {
      id: nextId, label: addressLabel, tag: entry?.tag || addressType, addressType,
      fullName: entry?.fullName || entry?.name || entry?.customerName || entry?.contactPerson || "",
      phone: entry?.phone || entry?.mobile || entry?.mobileNumber || entry?.customerMobile || entry?.customerMobileNumber || entry?.contactPhoneNumber || "",
      contactPhoneNumber: entry?.contactPhoneNumber || entry?.phone || entry?.mobile || entry?.mobileNumber || "",
      addressLine1: entry?.addressLine1 || entry?.address1 || entry?.line1 || "",
      addressLine2: entry?.addressLine2 || entry?.address2 || entry?.line2 || "",
      addressLine3: entry?.addressLine3 || entry?.address3 || entry?.line3 || "",
      addressLine, city: entry?.city || entry?.district || "",
      district: entry?.district || entry?.city || "", state: entry?.state || "",
      country: entry?.country || "India", landmark: entry?.landmark || "",
      locationUrl: entry?.locationUrl || "",
      pincode: entry?.pincode || entry?.pinCode || entry?.postalCode || entry?.zipCode || "",
      isDefault, fromApi: true,
    };
  });
}

async function loadCustomerAddresses() {
  isAddressLoading.value = true;
  try {
    const response = await getCustomerAddress();
    addresses.value = normalizeAddressesFromResponse(response);
    const selected = addresses.value.find(e => e.isDefault) || addresses.value[0] || null;
    selectedShippingAddressId.value = selected?.id || null;
    if (!addresses.value.some(e => e.id === selectedBillingAddressId.value)) {
      selectedBillingAddressId.value = billingCandidateAddresses.value[0]?.id || null;
    }
  } catch (e) { /* keep fallback */ } finally {
    isAddressLoading.value = false;
  }
}

watch([billingMode, selectedShippingAddressId, addresses], () => {
  if (billingMode.value !== "different") { showBillingForm.value = false; return; }
  const candidates = billingCandidateAddresses.value;
  if (!candidates.length) { selectedBillingAddressId.value = null; showBillingForm.value = true; return; }
  if (!candidates.some(e => e.id === selectedBillingAddressId.value)) selectedBillingAddressId.value = candidates[0].id;
}, { immediate: true });

async function deleteCustomerAddressById(addressId) {
  const endpoint = `/customer-service/cws/address/${encodeURIComponent(String(addressId))}`;
  const baseURL = String(appStore.tenantApiBaseUrl || appStore.baseUrl || "");
  const token = getToken();
  const response = await fetch(`${baseURL}${endpoint}`, {
    method: "DELETE",
    headers: { ...(token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {}) },
  });
  if (!response.ok) {
    let message = "Failed to remove address.";
    try { const p = await response.json(); message = p?.statusMessage || p?.message || message; } catch (e) { /* keep fallback */ }
    throw new Error(message);
  }
}

function buildAddressPayload(formValue, { isDefault = false, existingAddress = null } = {}) {
  const type = String(formValue?.addressType || "Home").trim();
  return {
    contactPerson: formValue?.fullName || "", contactPhoneNumber: formValue?.phone || existingAddress?.contactPhoneNumber || "",
    addressLine1: formValue?.addressLine || "", addressLine2: existingAddress?.addressLine2 || "",
    addressLine3: existingAddress?.addressLine3 || "", city: formValue?.city || "",
    district: existingAddress?.district || formValue?.city || "", state: formValue?.state || "",
    country: existingAddress?.country || "India", pinCode: formValue?.pincode || "",
    defaultDeliveryAddress: Boolean(isDefault), tag: type,
    landmark: existingAddress?.landmark || "", label: String(existingAddress?.label || type).trim() || type,
    locationUrl: existingAddress?.locationUrl || "",
  };
}

async function saveCustomerAddress({ addressId = null, formValue, isDefault, existingAddress = null }) {
  const hasId = addressId !== null && addressId !== undefined;
  const endpoint = hasId ? `/customer-service/cws/address/${encodeURIComponent(String(addressId))}` : "/customer-service/cws/address";
  const baseURL = String(appStore.tenantApiBaseUrl || appStore.baseUrl || "");
  const token = getToken();
  const response = await fetch(`${baseURL}${endpoint}`, {
    method: hasId ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {}) },
    body: JSON.stringify(buildAddressPayload(formValue, { isDefault, existingAddress })),
  });
  if (!response.ok) {
    let message = hasId ? "Failed to update address." : "Failed to add address.";
    try { const ep = await response.json(); message = ep?.statusMessage || ep?.message || message; } catch (e) { /* keep fallback */ }
    throw new Error(message);
  }
}

function toggleBillingForm() {
  if (showBillingForm.value) { cancelBillingForm(); return; }
  editingBillingAddressId.value = null; showBillingForm.value = true; addressError.value = "";
  billingForm.value = { addressType: "Home", fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "" };
}

function cancelBillingForm() {
  showBillingForm.value = false; editingBillingAddressId.value = null; addressError.value = "";
  billingForm.value = { addressType: "Home", fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "" };
}

function updateBillingField(field, value) { billingForm.value = { ...billingForm.value, [field]: value }; }

function startEditBillingAddress(id) {
  const existing = addresses.value.find(e => e.id === id);
  if (!existing) return;
  editingBillingAddressId.value = id; selectedBillingAddressId.value = id;
  showBillingForm.value = true; addressError.value = "";
  billingForm.value = { addressType: existing.addressType || "Home", fullName: existing.fullName || "", phone: existing.phone || "", addressLine: existing.addressLine || "", city: existing.city || "", state: existing.state || "", pincode: existing.pincode || "" };
}

async function saveBillingAddress() {
  addressError.value = "";
  if (isSavingAddress.value) return;
  const f = billingForm.value;
  if (!f.fullName || !f.phone || !f.addressLine || !f.city || !f.state || !f.pincode) { addressError.value = "Please fill all address fields."; return; }
  isSavingAddress.value = true;
  if (editingBillingAddressId.value !== null) {
    const targetId = editingBillingAddressId.value;
    const existingAddress = addresses.value.find(e => e.id === targetId) || null;
    try { await saveCustomerAddress({ addressId: targetId, formValue: f, isDefault: existingAddress?.isDefault || false, existingAddress }); await loadCustomerAddresses(); selectedBillingAddressId.value = targetId; cancelBillingForm(); }
    catch (error) { addressError.value = error?.message || "Failed to update address."; }
    finally { isSavingAddress.value = false; }
    return;
  }
  try { await saveCustomerAddress({ formValue: f, isDefault: false }); await loadCustomerAddresses(); const latest = addresses.value[addresses.value.length - 1] || null; if (latest) selectedBillingAddressId.value = latest.id; cancelBillingForm(); }
  catch (error) { addressError.value = error?.message || "Failed to add address."; }
  finally { isSavingAddress.value = false; }
}

async function removeBillingAddress(id) {
  addressError.value = "";
  const existing = addresses.value.find(e => e.id === id);
  if (!existing?.fromApi) return;
  try { await deleteCustomerAddressById(id); await loadCustomerAddresses(); }
  catch (error) { addressError.value = error?.message || "Failed to remove address."; }
}

function goToAddressPage() { router.push({ name: "place-order" }); }

// ── ITEM NORMALIZATION FROM API RESPONSE ──
function normalizeItemsFromResponse(response) {
  const data = response?.data || response || {};
  const nested = data?.data || {};
  const list = data.cartItems || data.items || data.item_list || data.cart?.item_list ||
    nested.cartItems || nested.items || nested.item_list || nested.cart?.item_list || [];
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => ({
    key: item.productId || item.id || item.sku || index,
    name: item.name || item.product?.name || "Product",
    sku: item.sku || item.product?.sku || "",
    quantity: Number(item.quantity || item.qty || item.itemQty || 1) || 1,
    price: Number(item.netPrice ?? item.net_price ?? item.price ?? item.listPrice ?? item.mrp ?? 0) || 0,
    mrp: Number(item.mrp ?? item.price ?? item.listPrice ?? 0) || 0,
    productId: item.productId || item.id || "",
    storeCode: item.storeCode || item.store_code || item.store?.storeCode || "",
    storeId: Number(item.storeId || item.store_id || item.store?.id || 0) || undefined,
  }));
}

function getLineTotal(item) {
  return (Number(item?.quantity || 1) || 1) * (Number(item?.price || 0) || 0);
}

function formatRs(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "Rs 0";
  return `Rs ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(parsed)}`;
}

function formatAmount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0.00";
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parsed);
}

async function loadCheckoutData() {
  isLoading.value = true;
  errorMessage.value = "";

  // Seed from cartStore immediately so the summary isn't blank while loading
  if (cartStore.items?.length) {
    checkoutItems.value = hydrateItems([...cartStore.items]);
  }

  try {
    await cartStore.syncGuestCartAfterLogin();
    await cartStore.refreshCartData();

    // After refresh, re-hydrate from store (covers guest / not-logged-in case)
    if (cartStore.items?.length) {
      checkoutItems.value = hydrateItems([...cartStore.items]);
    }

    const cartId = Number(cartStore.cartMeta?.cartId || 0);
    if (!cartId) {
      // No API cart — local hydrated items are enough for the demo
      return;
    }

    // Try to get fresher data from the API
    const response = await refreshCart({
      operation: "Refresh cart",
      cartId,
      customerMobileNumber: cartStore.cartMeta?.customerMobileNumber || undefined,
      customerName: "",
      customerEmail: "",
    });

    const apiItems = normalizeItemsFromResponse(response);
    if (apiItems.length) {
      // Prefer API quantity/price but hydrate images/names from local products
      checkoutItems.value = hydrateItems(apiItems);
    }
  } catch (error) {
    // Already seeded from cartStore above — just surface the error message
    errorMessage.value =
      error?.response?.data?.statusMessage ||
      error?.message ||
      "Failed to load checkout details.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadCheckoutData(), loadCustomerAddresses()]);
});

onUnmounted(() => {
  clearInterval(qrTimer);
  clearInterval(otpTimerInterval);
  clearInterval(redirectTimer);
});
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css");

.payment-page { min-height: 100vh; background: #f8fafc; }
.container { width: 92%; max-width: 1200px; margin: 0 auto; }
.payment-content { padding: 32px 0 64px; display: flex; flex-direction: column; gap: 28px; }

/* PROGRESS */
.checkout-progress { display: flex; align-items: center; justify-content: center; padding: 8px 0 4px; }
.progress-step { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.step-dot { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #d1dbe8; background: #fff; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.progress-step.completed .step-dot { border-color: #003da5; background: #003da5; color: #fff; }
.progress-step.active .step-dot { border-color: #003da5; color: #003da5; box-shadow: 0 0 0 4px rgba(0,61,165,0.1); }
.step-label { font-size: 12px; font-weight: 600; color: #94a3b8; }
.progress-step.completed .step-label, .progress-step.active .step-label { color: #003da5; }
.progress-line { width: 80px; height: 2px; background: #d1dbe8; margin-bottom: 18px; }
.progress-line.completed, .progress-line.active { background: #003da5; }

/* GRID */
.checkout-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px; align-items: start; }
.left-col, .right-col { display: flex; flex-direction: column; gap: 16px; }

/* PANEL CARDS */
.panel-card, .summary-card { background: #fff; border: 1px solid rgba(0,61,165,0.08); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,61,165,0.02); }
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-title, .col-title { margin: 0; font-size: 20px; font-weight: 800; color: #0a2240; letter-spacing: -0.3px; }
.sub-title { margin: 0; font-size: 15px; font-weight: 700; color: #0a2240; }
.secure-badge { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; color: #16a34a; border: 1px solid rgba(22,163,74,0.2); border-radius: 999px; padding: 5px 12px; font-size: 12px; font-weight: 700; }

/* PAYMENT METHOD RADIO LIST */
.method-radio-list { display: flex; flex-direction: column; gap: 10px; }
.method-radio-card { display: block; border: 1.5px solid #e2eaf6; border-radius: 12px; background: #fff; cursor: pointer; transition: all 0.18s; overflow: hidden; }
.method-radio-card input[type="radio"] { display: none; }
.method-radio-card:hover { border-color: #b3c8ee; }
.method-radio-card.selected { border-color: #003da5; background: #fafcff; box-shadow: 0 0 0 3px rgba(0,61,165,0.08); }
.method-radio-inner { display: flex; align-items: center; gap: 14px; padding: 16px; }
.method-radio-dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #d1dbe8; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
.method-radio-dot.active { border-color: #003da5; background: #003da5; }
.method-radio-dot.active span { width: 8px; height: 8px; border-radius: 50%; background: #fff; display: block; }
.method-icon-wrap { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,61,165,0.06); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #003da5; flex-shrink: 0; }
.method-text { flex: 1; }
.method-label { margin: 0 0 2px; font-size: 15px; font-weight: 700; color: #0a2240; }
.method-sub { margin: 0; font-size: 12px; color: #5a6b82; }

/* ADDRESS */
.selected-address-card { display: flex; flex-direction: column; }
.addr-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.addr-left-meta { display: flex; align-items: center; gap: 8px; }
.addr-type-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(0,61,165,0.06); color: #003da5; border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 700; }
.selected-pill { font-size: 11px; font-weight: 700; color: #0a2240; background: #ffc72c; border-radius: 999px; padding: 3px 9px; }
.addr-right-actions { display: flex; gap: 6px; }
.icon-action-btn { width: 30px; height: 30px; border: 1px solid #e2eaf6; background: #f8fafc; color: #5a6b82; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; transition: all 0.18s; font-size: 15px; }
.icon-action-btn:hover { border-color: #003da5; color: #003da5; background: rgba(0,61,165,0.05); }
.icon-action-btn.danger:hover { border-color: #dc2626; color: #dc2626; background: #fff4f4; }
.addr-body { display: flex; align-items: flex-start; gap: 14px; }
.addr-check-col { flex-shrink: 0; padding-top: 2px; }
.radio-ring { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #d1dbe8; display: flex; align-items: center; justify-content: center; transition: all 0.18s; background: #fff; }
.radio-ring.active { border-color: #003da5; background: #003da5; }
.check-icon { font-size: 12px; color: #fff; font-weight: 700; }
.addr-text-col { flex: 1; min-width: 0; }
.address-name { margin: 0 0 3px; font-size: 15px; font-weight: 700; color: #0a2240; }
.address-line { margin: 0 0 3px; font-size: 13px; color: #344760; line-height: 1.5; }
.address-meta { margin: 0; font-size: 13px; color: #5a6b82; }
.phone-meta { display: flex; align-items: center; gap: 5px; margin-top: 3px; }

/* BILLING */
.billing-mode-group { display: flex; flex-direction: column; gap: 10px; }
.billing-mode-card { display: flex; align-items: flex-start; gap: 14px; border: 1.5px solid #e2eaf6; border-radius: 12px; padding: 14px 16px; background: #fff; cursor: pointer; transition: all 0.18s; }
.billing-mode-card input[type="radio"] { display: none; }
.billing-mode-card:hover { border-color: #b3c8ee; }
.billing-mode-card.selected { border-color: #003da5; background: #fafcff; box-shadow: 0 0 0 3px rgba(0,61,165,0.08); }
.billing-mode-card .radio-ring { flex-shrink: 0; margin-top: 2px; }
.mode-text { flex: 1; }
.option-title { margin: 0 0 2px; font-size: 14px; font-weight: 700; color: #0a2240; }
.option-sub { margin: 0; font-size: 12px; color: #5a6b82; }
.billing-panel { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
.billing-panel-header { display: flex; align-items: center; justify-content: space-between; }
.address-list { display: flex; flex-direction: column; gap: 12px; }
.address-card { border: 1.5px solid #e2eaf6; border-radius: 14px; background: #fff; padding: 16px; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
.address-card:hover { border-color: #b3c8ee; }
.address-card.selected { border-color: #003da5; box-shadow: 0 0 0 3px rgba(0,61,165,0.08); background: #fafcff; }

/* SUMMARY */
.summary-items { margin: 14px 0; display: flex; flex-direction: column; gap: 14px; }
.summary-item { display: flex; align-items: center; gap: 14px; }
.summary-item-img { width: 60px; height: 60px; flex-shrink: 0; border-radius: 10px; overflow: hidden; border: 1px solid #e2eaf6; background: #f8fafc; }
.summary-item-img img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 20px; }
.summary-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.summary-item-name { margin: 0; font-size: 14px; font-weight: 600; color: #0a2240; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.summary-item-sku { margin: 0; font-size: 11px; color: #94a3b8; }
.summary-item-qty { margin: 0; font-size: 12px; color: #5a6b82; font-weight: 600; }
.summary-item-price { margin: 0; font-size: 14px; font-weight: 700; color: #003da5; white-space: nowrap; flex-shrink: 0; }
.summary-totals { border-top: 1px solid #edf2f7; padding-top: 14px; display: flex; flex-direction: column; gap: 8px; }
.total-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #344760; }
.total-row.grand { padding-top: 10px; border-top: 1px solid #edf2f7; font-size: 16px; font-weight: 800; color: #0a2240; }
.free-tag { color: #15803d; font-weight: 700; font-size: 13px; }

/* CTA */
.cta-group { display: flex; flex-direction: column; gap: 10px; }
.cta-ghost { width: 100%; height: 44px; border: 1.5px solid #d1dbe8; border-radius: 50px; background: #fff; color: #344760; font-size: 14px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; transition: all 0.2s; font-family: inherit; box-sizing: border-box; }
.cta-ghost:hover { border-color: #003da5; color: #003da5; }
.cta-primary { width: 100%; height: 52px; border: none; border-radius: 50px; color: #0a2240; background: #ffc72c; font-size: 15px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; transition: all 0.2s; box-sizing: border-box; text-decoration: none; }
.cta-primary:hover:not(:disabled) { background: #0033a0; color: #fff; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,61,165,0.22); }
.cta-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.security-note { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #94a3b8; line-height: 1.5; padding: 0 4px; }
.security-note i { font-size: 16px; flex-shrink: 0; color: #16a34a; margin-top: 1px; }

/* SHARED BUTTONS */
.ghost-btn { display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(0,61,165,0.2); background: #fff; color: #003da5; border-radius: 999px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.ghost-btn:hover { background: #003da5; color: #fff; }
.add-addr-btn { display: inline-flex; align-items: center; gap: 6px; border: 1.5px solid #003da5; background: transparent; color: #003da5; border-radius: 999px; padding: 7px 16px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.add-addr-btn:hover { background: #003da5; color: #fff; }
.status-text { margin: 0; color: #5f6f85; font-size: 14px; }
.status-text.centered { text-align: center; padding: 40px 0; }
.status-text.error { color: #dc2626; font-weight: 700; }

/* ── GATEWAY SCREEN ── */
.gateway-screen { display: flex; justify-content: center; padding: 8px 0; }
.gateway-wrap { display: grid; grid-template-columns: 1fr 1.2fr; gap: 0; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(10,34,64,0.12); max-width: 900px; width: 100%; border: 1px solid rgba(0,61,165,0.08); }

.gw-left { background: #0a0f1e; padding: 40px 36px; display: flex; flex-direction: column; gap: 24px; }
.gw-amount-box { background: #141a2e; border-radius: 16px; padding: 28px 24px; text-align: center; }
.gw-to-pay { margin: 0 0 8px; font-size: 13px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; }
.gw-amount { margin: 0 0 16px; font-size: 40px; font-weight: 800; color: #fff; }
.gw-expiry-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); border-radius: 8px; padding: 6px 12px; font-size: 12px; color: rgba(255,255,255,0.55); }

.gw-meta-box { background: #141a2e; border-radius: 12px; padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.gw-meta-row { display: flex; flex-direction: column; gap: 3px; font-size: 12px; color: rgba(255,255,255,0.45); }
.gw-meta-row strong { font-size: 14px; color: #fff; font-weight: 700; }

.gw-right { padding: 36px 32px; background: #fff; }
.gw-right-title { margin: 0 0 20px; font-size: 18px; font-weight: 800; color: #0a2240; }

.gw-tabs { display: flex; border-bottom: 2px solid #edf2f7; margin-bottom: 24px; gap: 0; }
.gw-tab { flex: 1; padding: 10px 8px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #94a3b8; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; font-family: inherit; }
.gw-tab:hover { color: #003da5; }
.gw-tab.active { color: #003da5; border-bottom-color: #003da5; }

.gw-tab-content { display: flex; flex-direction: column; gap: 14px; }
.gw-tab-label { margin: 0; font-size: 13px; font-weight: 700; color: #0a2240; }

.gw-input { width: 100%; height: 48px; padding: 0 16px; font-size: 14px; color: #333f48; border: 1px solid #dce7f6; border-radius: 8px; background: #f8fafc; outline: none; transition: all 0.2s; box-sizing: border-box; font-family: inherit; }
.gw-input:focus { background: #fff; border-color: #003da5; box-shadow: 0 0 0 3px rgba(0,61,165,0.08); }

.gw-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.gw-proceed-btn { width: 100%; height: 48px; border: none; border-radius: 8px; background: #1a8cff; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.gw-proceed-btn:hover:not(:disabled) { background: #0070e0; }
.gw-proceed-btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* UPI inside gateway */
.gw-qr-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.gw-qr-box { width: 160px; height: 160px; border: 2px solid #e2eaf6; border-radius: 12px; padding: 10px; position: relative; background: #fff; display: grid; place-items: center; }
.gw-qr-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; width: 100%; height: 100%; }
.gw-qr-cell { border-radius: 1px; background: #edf2f7; }
.gw-qr-cell.filled { background: #1a1a2e; }
.gw-qr-logo { position: absolute; width: 32px; height: 32px; background: #1a8cff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #fff; }
.gw-qr-expiry { font-size: 13px; color: #dc2626; font-weight: 600; display: flex; align-items: center; gap: 5px; }
.gw-qr-hint { font-size: 11px; color: #94a3b8; text-align: center; font-weight: 600; letter-spacing: 0.3px; }

.gw-upi-divider { text-align: center; font-size: 12px; color: #94a3b8; position: relative; }
.gw-upi-divider::before, .gw-upi-divider::after { content: ""; position: absolute; top: 50%; width: 42%; height: 1px; background: #edf2f7; }
.gw-upi-divider::before { left: 0; }
.gw-upi-divider::after { right: 0; }

.gw-upi-id-row { display: flex; gap: 8px; }
.gw-verify-btn { height: 48px; padding: 0 16px; background: #003da5; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: inherit; flex-shrink: 0; }

/* Netbanking inside gateway */
.gw-bank-list { display: flex; flex-direction: column; gap: 8px; }
.gw-bank-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1.5px solid #e2eaf6; border-radius: 10px; cursor: pointer; transition: all 0.18s; }
.gw-bank-row input[type="radio"] { display: none; }
.gw-bank-row:hover { border-color: #b3c8ee; }
.gw-bank-row.selected { border-color: #1a8cff; background: #f0f6ff; }
.gw-bank-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #d1dbe8; flex-shrink: 0; transition: all 0.18s; }
.gw-bank-dot.active { border-color: #1a8cff; background: #1a8cff; box-shadow: inset 0 0 0 3px #fff; }
.gw-bank-info { display: flex; align-items: center; gap: 10px; flex: 1; }
.gw-bank-initials { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #fff; flex-shrink: 0; }
.gw-bank-name { font-size: 13px; font-weight: 600; color: #0a2240; }

/* ── OTP SCREEN ── */
.otp-screen { display: flex; justify-content: center; padding: 20px 0; }
.otp-card { background: #fff; border-radius: 20px; padding: 48px 40px; max-width: 420px; width: 100%; box-shadow: 0 16px 48px rgba(10,34,64,0.1); border: 1px solid rgba(0,61,165,0.08); display: flex; flex-direction: column; gap: 20px; align-items: center; text-align: center; }
.otp-bank-logo { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #003da5, #1a68d1); display: flex; align-items: center; justify-content: center; font-size: 28px; color: #fff; }
.otp-title { margin: 0; font-size: 20px; font-weight: 800; color: #0a2240; }
.otp-sub { margin: 0; font-size: 13px; color: #5a6b82; line-height: 1.6; }
.otp-amount-strip { width: 100%; background: rgba(0,61,165,0.04); border: 1px solid rgba(0,61,165,0.1); border-radius: 10px; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #344760; }
.otp-amount-strip strong { font-size: 18px; font-weight: 800; color: #003da5; }
.otp-input-row { display: flex; gap: 10px; justify-content: center; }
.otp-digit { width: 46px; height: 54px; border: 2px solid #dce7f6; border-radius: 10px; text-align: center; font-size: 22px; font-weight: 700; color: #0a2240; background: #f8fafc; outline: none; transition: all 0.2s; font-family: inherit; }
.otp-digit:focus { border-color: #003da5; background: #fff; box-shadow: 0 0 0 3px rgba(0,61,165,0.1); }
.otp-timer { margin: 0; font-size: 13px; color: #5a6b82; }
.resend-link { border: none; background: none; color: #003da5; font-size: 13px; font-weight: 700; cursor: pointer; padding: 0; font-family: inherit; text-decoration: underline; }
.otp-error { margin: 0; font-size: 13px; color: #dc2626; font-weight: 600; background: #fef2f2; padding: 8px 14px; border-radius: 8px; width: 100%; box-sizing: border-box; }
.otp-back-link { border: none; background: none; color: #94a3b8; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-family: inherit; }
.otp-back-link:hover { color: #003da5; }

/* ── PROCESSING ── */
.processing-fullscreen { display: flex; justify-content: center; align-items: center; min-height: 400px; }
.processing-card { background: #fff; border-radius: 20px; padding: 60px 48px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 16px 48px rgba(10,34,64,0.1); min-width: 300px; border: 1px solid rgba(0,61,165,0.08); }
.processing-spinner { width: 60px; height: 60px; border: 4px solid rgba(0,61,165,0.12); border-top-color: #003da5; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.processing-title { margin: 0; font-size: 20px; font-weight: 800; color: #0a2240; }
.processing-sub { margin: 0; font-size: 13px; color: #94a3b8; }
.processing-amount { font-size: 28px; font-weight: 800; color: #003da5; }

/* ── SUCCESS ── */
.success-screen { display: flex; flex-direction: column; align-items: center; padding: 40px 0 60px; animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.success-animation { margin-bottom: 24px; }
.success-circle { width: 80px; height: 80px; border-radius: 50%; background: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 44px; color: #fff; animation: popIn 0.4s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 0 0 12px rgba(22,163,74,0.12); }
@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.success-title { margin: 0 0 8px; font-size: 28px; font-weight: 800; color: #0a2240; }
.success-subtitle { margin: 0 0 32px; font-size: 15px; color: #5a6b82; }
.success-detail-card { width: 100%; max-width: 560px; background: #fff; border: 1px solid rgba(0,61,165,0.1); border-radius: 18px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,61,165,0.06); margin-bottom: 20px; }
.success-detail-header { background: #003da5; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.success-detail-label { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.5px; }
.success-order-id { font-size: 14px; font-weight: 800; color: #ffc72c; }
.success-rows { padding: 0 24px; }
.success-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f4fa; font-size: 13px; color: #5a6b82; }
.success-row:last-child { border-bottom: none; }
.success-row strong { color: #0a2240; font-weight: 700; }
.status-success { color: #16a34a !important; display: inline-flex; align-items: center; gap: 4px; }
.success-items-section { background: #f8fafc; border-top: 1px solid #edf2f7; padding: 16px 24px; }
.success-items-title { margin: 0 0 12px; font-size: 12px; font-weight: 800; color: #003da5; text-transform: uppercase; letter-spacing: 0.5px; }
.success-item-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #344760; padding: 5px 0; border-bottom: 1px solid #edf2f7; }
.success-item-row:last-child { border-bottom: none; }
.success-item-name { font-weight: 500; }
.success-item-qty { color: #94a3b8; font-size: 12px; margin-left: 4px; }
.success-item-price { font-weight: 700; color: #0a2240; }
.grand-row { padding-top: 10px; margin-top: 4px; border-top: 1px solid #d1dbe8 !important; border-bottom: none !important; }
.grand-row span { font-weight: 800; font-size: 14px; color: #0a2240; }
.grand-row strong { font-size: 15px; font-weight: 800; color: #003da5; }

.redirect-note { margin: 0; font-size: 13px; color: #94a3b8; display: flex; align-items: center; gap: 6px; }
.spin { animation: spin 1s linear infinite; }

/* RESPONSIVE */
@media (max-width: 960px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .right-col { order: -1; }
  .gateway-wrap { grid-template-columns: 1fr; }
  .gw-left { padding: 28px 24px; }
  .gw-right { padding: 28px 24px; }
}
@media (max-width: 600px) {
  .progress-line { width: 48px; }
  .payment-content { padding: 24px 0 48px; }
  .panel-card, .summary-card { padding: 18px; }
  .otp-card { padding: 32px 20px; }
  .otp-digit { width: 38px; height: 48px; font-size: 18px; }
  .success-title { font-size: 22px; }
  .gw-row { grid-template-columns: 1fr; }
}
</style>