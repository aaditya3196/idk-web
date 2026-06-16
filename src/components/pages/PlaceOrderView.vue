<template>
  <div class="place-order-page">
    <AppNavbar />

    <main class="container place-order-content">
      <!-- PROGRESS BAR -->
      <div class="checkout-progress">
        <div class="progress-step completed">
          <span class="step-dot"><i class="ri-shopping-cart-2-line"></i></span>
          <span class="step-label">Cart</span>
        </div>
        <div class="progress-line active"></div>
        <div class="progress-step active">
          <span class="step-dot"><i class="ri-map-pin-line"></i></span>
          <span class="step-label">Address</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step">
          <span class="step-dot"><i class="ri-bank-card-line"></i></span>
          <span class="step-label">Payment</span>
        </div>
      </div>

      <p v-if="isLoading" class="status-text centered">
        Loading checkout details...
      </p>
      <p v-if="!isLoading && errorMessage" class="status-text error centered">
        {{ errorMessage }}
      </p>

      <section v-if="!isLoading" class="checkout-grid">
        <!-- LEFT: ADDRESS -->
        <section class="left-col">
          <div class="col-header">
            <h2 class="col-title">Delivery Address</h2>
            <button
              type="button"
              class="add-addr-btn"
              @click="toggleAddressForm"
            >
              <i class="ri-add-line"></i> Add New
            </button>
          </div>

          <p v-if="isAddressLoading" class="status-text">
            Loading addresses...
          </p>

          <!-- ADD / EDIT ADDRESS FORM -->
          <AddressFormCard
            :show="showAddressForm"
            :form="addressForm"
            :address-types="addressTypes"
            :error-message="addressError"
            :is-editing="editingAddressId !== null"
            :mode-label="
              editingAddressId !== null ? 'Edit Address' : 'Add New Address'
            "
            @update-field="updateAddressField"
            @cancel="cancelAddressForm"
            @submit="addAddress"
          />

          <!-- ADDRESS LIST -->
          <div class="address-list">
            <article
              v-for="address in addresses"
              :key="address.id"
              class="address-card"
              :class="{ selected: selectedAddressId === address.id }"
              @click="selectedAddressId = address.id"
            >
              <!-- TOP ROW: type + default pill left, edit/delete right -->
              <div class="addr-card-top">
                <div class="addr-left-meta">
                  <div class="addr-type-badge">
                    <i :class="getAddressTypeIcon(address.addressType)"></i>
                    {{ address.label || address.addressType || "Home" }}
                  </div>
                  <span v-if="address.isDefault" class="default-pill">Default</span>
                </div>
                <div class="addr-right-actions">
                  <button
                    type="button"
                    class="icon-action-btn"
                    @click.stop="startEditAddress(address.id)"
                    title="Edit Address"
                  >
                    <i class="ri-edit-line"></i>
                  </button>
                  <button
                    type="button"
                    class="icon-action-btn danger"
                    @click.stop="removeAddress(address.id)"
                    title="Delete Address"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>

              <!-- BODY: radio ring + address text -->
              <div class="addr-body">
                <div class="addr-check-col">
                  <div
                    class="radio-ring"
                    :class="{ active: selectedAddressId === address.id }"
                  >
                    <i
                      v-if="selectedAddressId === address.id"
                      class="ri-check-line check-icon"
                    ></i>
                  </div>
                </div>
                <div class="addr-text-col">
                  <p class="address-name">{{ address.fullName || "Address" }}</p>
                  <p class="address-line">
                    {{ address.addressLine || "Address line" }}
                  </p>
                  <p class="address-meta">
                    {{
                      [address.city, address.state, address.pincode]
                        .filter(Boolean)
                        .join(", ")
                    }}
                  </p>
                  <button
                    v-if="!address.isDefault"
                    type="button"
                    class="set-default-btn"
                    @click.stop="setDefaultAddress(address.id)"
                  >
                    Set as Default
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- RIGHT: ORDER SUMMARY + RESPONSE -->
        <section class="right-col">
          <!-- ORDER SUMMARY -->
          <div class="summary-card">
            <h2 class="col-title">Order Summary</h2>

            <div class="summary-items">
              <div
                v-for="(item, index) in checkoutItems"
                :key="item.key || index"
                class="summary-item"
              >
                <!-- Clean image, no floating badge -->
                <div class="summary-item-img">
                  <img v-if="item.image" :src="item.image" :alt="item.name" />
                  <div v-else class="img-placeholder">
                    <i class="ri-image-line"></i>
                  </div>
                </div>
                <div class="summary-item-info">
                  <p class="summary-item-name">{{ item.name }}</p>
                  <p class="summary-item-sku" v-if="item.sku">
                    SKU: {{ item.sku }}
                  </p>
                  <!-- Qty as inline text, not floating badge -->
                  <p class="summary-item-qty">Qty: {{ item.quantity || 1 }}</p>
                </div>
                <p class="summary-item-price">
                  {{ formatRs(getLineTotal(item)) }}
                </p>
              </div>
            </div>

            <div class="summary-totals">
  <div class="total-row">
    <span>Subtotal</span>
    <span>{{ formatRs(orderSubtotal) }}</span>
  </div>
  <div class="total-row">
    <span>Shipping & Handling</span>
    <span>{{ formatRs(totalShipping) }}</span>
  </div>
  <div class="total-row grand">
    <span>Total</span>
    <strong>{{ formatRs(orderTotal) }}</strong>
  </div>
</div>
          </div>

          <!-- CTA -->
          <div class="cta-group">
            <router-link to="/cart" class="cta-ghost">
              <i class="ri-arrow-left-line"></i> Back to Cart
            </router-link>
            <button
              type="button"
              class="cta-primary"
              @click="goToPaymentOptions"
            >
              <i class="ri-lock-line"></i> Continue to Payment
            </button>
          </div>

          <!-- RESPONSE BOXES (existing integrations preserved) -->
          <div
            v-if="lastOrderPayloadPreview"
            class="response-box raw-response-box"
          >
            <h3>Request JSON</h3>
            <pre>{{ lastOrderPayloadPreview }}</pre>
          </div>
        </section>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getCustomerAddress, getToken, refreshCart } from "rdep-ecom-sdk";
import { useAppStore } from "../../stores/useAppStore.js";
import { useCartStore } from "../../stores/useCartStore.js";
import { allProducts } from "../../data/products.js";
import AddressFormCard from "./AddressFormCard.vue";
import AppNavbar from "../AppNavbar.vue";
import Footer from "../FooterView.vue";
import { getDemoAddressesStorageKey } from "../../stores/useDemoStore.js";

const cartStore = useCartStore();
const appStore = useAppStore();
const router = useRouter();

const isLoading = ref(false);
const isAddressLoading = ref(false);
const errorMessage = ref("");

const showAddressForm = ref(false);
const addressError = ref("");
const addressIdCounter = ref(2);
const editingAddressId = ref(null);
const isSavingAddress = ref(false);

const addressTypes = [
  { value: "Home", label: "Home", icon: "ri-home-4-line" },
  { value: "Office", label: "Office", icon: "ri-building-line" },
  { value: "Other", label: "Other", icon: "ri-map-pin-line" },
];

function getAddressTypeIcon(type) {
  const found = addressTypes.find((t) => t.value === type);
  return found ? found.icon : "ri-map-pin-line";
}

const addresses = ref([]);
const selectedAddressId = ref(null);

const addressForm = ref({
  addressType: "Home",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
});

const checkoutItems = ref([]);
const checkoutCartId = ref("");
const lastOrderPayloadPreview = ref("");

// ---------------------------------------------------------------------------
// PRODUCT HYDRATION — same pattern as CartView
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

const shippingLookup = (() => {
  const map = {};
  for (const product of allProducts) {
    for (const variant of product.variants) {
      const cost = variant.shippingCost || product.shippingCost || 0;
      map[`${product.id}-${variant.name}`] = cost;
      if (variant.productCode) map[variant.productCode] = cost;
    }
  }
  return map;
})();

function getShippingCost(item) {
  return shippingLookup[item.key] || shippingLookup[item.productId] || 0;
}

const totalShipping = computed(() =>
  checkoutItems.value.reduce((sum, item) => sum + getShippingCost(item) * (Number(item.quantity) || 1), 0)
);

const orderTotal = computed(() => orderSubtotal.value + totalShipping.value);

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
      name:
        item.name && item.name !== "Product"
          ? item.name
          : (local.name || item.key),
    };
  });
}

// ---------------------------------------------------------------------------

function normalizeAddressesFromResponse(response) {
  const root = response?.data || response || {};
  const nested = root?.data || {};

  const list =
    (Array.isArray(root) ? root : null) ||
    root.addresses ||
    root.addressList ||
    root.customerAddresses ||
    root.items ||
    nested.addresses ||
    nested.addressList ||
    nested.customerAddresses ||
    nested.items ||
    [];

  if (!Array.isArray(list)) return [];

  return list.map((entry, index) => {
    const rawId = entry?.id ?? entry?.addressId ?? entry?.customerAddressId;
    const parsedId = Number(rawId);
    const nextId =
      Number.isFinite(parsedId) && parsedId > 0 ? parsedId : index + 1;

    const typeRaw = String(
      entry?.tag || entry?.addressType || entry?.type || "Home",
    ).trim();
    const addressType =
      typeRaw.toLowerCase() === "office"
        ? "Office"
        : typeRaw.toLowerCase() === "other"
        ? "Other"
        : "Home";

    const addressLabel = String(
      entry?.label || entry?.tag || addressType,
    ).trim();

    const isDefaultRaw =
      entry?.isDefault ??
      entry?.defaultDeliveryAddress ??
      entry?.defaultAddress ??
      entry?.is_default ??
      entry?.default;

    const addressLine =
      entry?.addressLine ||
      entry?.address ||
      [entry?.addressLine1, entry?.addressLine2, entry?.addressLine3]
        .filter(Boolean)
        .join(", ") ||
      entry?.address1 ||
      entry?.line1 ||
      "";

    const isDefault =
      isDefaultRaw === true ||
      isDefaultRaw === 1 ||
      isDefaultRaw === "1" ||
      String(isDefaultRaw || "").toUpperCase() === "Y" ||
      String(isDefaultRaw || "").toLowerCase() === "true";

    return {
      id: nextId,
      label: addressLabel,
      tag: entry?.tag || addressType,
      addressType,
      fullName:
        entry?.fullName ||
        entry?.name ||
        entry?.customerName ||
        entry?.contactPerson ||
        "",
      phone:
        entry?.phone ||
        entry?.mobile ||
        entry?.mobileNumber ||
        entry?.customerMobile ||
        entry?.customerMobileNumber ||
        entry?.contactPhoneNumber ||
        "",
      contactPhoneNumber:
        entry?.contactPhoneNumber ||
        entry?.phone ||
        entry?.mobile ||
        entry?.mobileNumber ||
        "",
      addressLine1:
        entry?.addressLine1 || entry?.address1 || entry?.line1 || "",
      addressLine2:
        entry?.addressLine2 || entry?.address2 || entry?.line2 || "",
      addressLine3:
        entry?.addressLine3 || entry?.address3 || entry?.line3 || "",
      addressLine,
      city: entry?.city || entry?.district || "",
      district: entry?.district || entry?.city || "",
      state: entry?.state || "",
      country: entry?.country || "India",
      landmark: entry?.landmark || "",
      locationUrl: entry?.locationUrl || "",
      pincode:
        entry?.pincode ||
        entry?.pinCode ||
        entry?.postalCode ||
        entry?.zipCode ||
        "",
      isDefault,
      fromApi: true,
    };
  });
}

// Replace loadCustomerAddresses with this:
async function loadCustomerAddresses() {
  isAddressLoading.value = true;
  try {
    if (getToken()) {
      const response = await getCustomerAddress();
      const apiAddresses = normalizeAddressesFromResponse(response);

      if (apiAddresses.length) {
        addresses.value = apiAddresses;
        ensureOneDefaultAddress();
        showAddressForm.value = false;
        addressError.value = "";
        const selected = addresses.value.find((e) => e.isDefault) || addresses.value[0];
        selectedAddressId.value = selected.id;
        const maxId = addresses.value.reduce((max, e) => {
          const n = Number(e.id);
          return Number.isFinite(n) ? Math.max(max, n) : max;
        }, 0);
        addressIdCounter.value = maxId + 1;
        return;
      }
    }
  } catch {
    // fall through to demo
  } finally {
    isAddressLoading.value = false;
  }

  // Demo fallback — load from localStorage
  try {
    const raw = localStorage.getItem(getDemoAddressesStorageKey());
    const saved = raw ? JSON.parse(raw) : [];
    if (Array.isArray(saved) && saved.length) {
      addresses.value = saved;
      ensureOneDefaultAddress();
      showAddressForm.value = false;
      const selected = addresses.value.find((e) => e.isDefault) || addresses.value[0];
      selectedAddressId.value = selected.id;
      const maxId = saved.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
      addressIdCounter.value = maxId + 1;
    } else {
      addresses.value = [];
      selectedAddressId.value = null;
      showAddressForm.value = true;
    }
  } catch {
    showAddressForm.value = true;
  }
}

async function deleteCustomerAddressById(addressId) {
  const token = getToken();
  if (token) {
    const encodedAddressId = encodeURIComponent(String(addressId));
    const endpoint = `/customer-service/cws/address/${encodedAddressId}`;
    const baseURL = String(appStore.tenantApiBaseUrl || appStore.baseUrl || "");
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let message = "Failed to remove address.";
      try {
        const payload = await response.json();
        message = payload?.statusMessage || payload?.message || message;
      } catch { /* ignore */ }
      throw new Error(message);
    }
    return;
  }

  // Demo fallback
  const addressesKey = getDemoAddressesStorageKey();
const raw = localStorage.getItem(addressesKey);
const list = (() => { try { return JSON.parse(raw) || []; } catch { return []; } })();
localStorage.setItem(addressesKey, JSON.stringify(list.filter((a) => a.id !== addressId)));
}

function buildAddressPayload(
  formValue,
  { isDefault = false, existingAddress = null } = {},
) {
  const type = String(formValue?.addressType || "Home").trim();
  const addressLine2 = existingAddress?.addressLine2 || "";
  const addressLine3 = existingAddress?.addressLine3 || "";
  const district = existingAddress?.district || formValue?.city || "";
  const country = existingAddress?.country || "India";
  const landmark = existingAddress?.landmark || "";
  const locationUrl = existingAddress?.locationUrl || "";
  const label = String(existingAddress?.label || type).trim() || type;

  return {
    contactPerson: formValue?.fullName || "",
    contactPhoneNumber:
      formValue?.phone || existingAddress?.contactPhoneNumber || "",
    addressLine1: formValue?.addressLine || "",
    addressLine2,
    addressLine3,
    city: formValue?.city || "",
    district,
    state: formValue?.state || "",
    country,
    pinCode: formValue?.pincode || "",
    defaultDeliveryAddress: Boolean(isDefault),
    tag: type,
    landmark,
    label,
    locationUrl,
  };
}

function extractAddressIdFromResponse(response) {
  const root = response?.data || response || {};
  const nested = root?.data || {};
  const rawId =
    root?.id ||
    root?.addressId ||
    root?.customerAddressId ||
    nested?.id ||
    nested?.addressId ||
    nested?.customerAddressId;
  const parsedId = Number(rawId);
  return Number.isFinite(parsedId) ? parsedId : null;
}

// Replace saveCustomerAddress with this:
async function saveCustomerAddress({
  addressId = null,
  formValue,
  isDefault,
  existingAddress = null,
}) {
  // Try real API if token exists
  const token = getToken();
  if (token) {
    const hasAddressId = addressId !== null && addressId !== undefined;
    const encodedAddressId = hasAddressId ? encodeURIComponent(String(addressId)) : "";
    const endpoint = hasAddressId
      ? `/customer-service/cws/address/${encodedAddressId}`
      : "/customer-service/cws/address";
    const method = hasAddressId ? "PATCH" : "POST";
    const baseURL = String(appStore.tenantApiBaseUrl || appStore.baseUrl || "");
    const payload = buildAddressPayload(formValue, { isDefault, existingAddress });

    const response = await fetch(`${baseURL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = hasAddressId ? "Failed to update address." : "Failed to add address.";
      try {
        const err = await response.json();
        message = err?.statusMessage || err?.message || message;
      } catch { /* ignore */ }
      throw new Error(message);
    }

    try { return await response.json(); } catch { return null; }
  }

  // Demo fallback — save to localStorage
  const addressesKey = getDemoAddressesStorageKey();
const raw = localStorage.getItem(addressesKey);
const existing_list = (() => { try { return JSON.parse(raw) || []; } catch { return []; } })();

  if (addressId !== null) {
    // Edit
    const updated = existing_list.map((a) =>
      a.id === addressId
        ? {
            ...a,
            addressType: formValue.addressType || a.addressType,
            label: formValue.addressType || a.label,
            tag: formValue.addressType || a.tag,
            fullName: formValue.fullName || "",
            phone: formValue.phone || "",
            addressLine: formValue.addressLine || "",
            addressLine1: formValue.addressLine || "",
            city: formValue.city || "",
            state: formValue.state || "",
            pincode: formValue.pincode || "",
          }
        : a
    );
    localStorage.setItem(addressesKey, JSON.stringify(updated));
    return null;
  }

  // New address
  const newId = addressIdCounter.value++;
  const newAddr = {
    id: newId,
    addressType: formValue.addressType || "Home",
    label: formValue.addressType || "Home",
    tag: formValue.addressType || "Home",
    fullName: formValue.fullName || "",
    phone: formValue.phone || "",
    addressLine: formValue.addressLine || "",
    addressLine1: formValue.addressLine || "",
    addressLine2: "",
    addressLine3: "",
    city: formValue.city || "",
    district: formValue.city || "",
    state: formValue.state || "",
    country: "India",
    pincode: formValue.pincode || "",
    landmark: "",
    locationUrl: "",
    isDefault: isDefault || existing_list.length === 0,
    fromApi: false,
  };

  const updated_list = [...existing_list, newAddr];
  localStorage.setItem(addressesKey, JSON.stringify(updated_list));
  return { id: newId };
}

function normalizeItemsFromResponse(response) {
  const data = response?.data || response || {};
  const nested = data?.data || {};
  const list =
    data.cartItems ||
    data.items ||
    data.item_list ||
    data.cart?.item_list ||
    nested.cartItems ||
    nested.items ||
    nested.item_list ||
    nested.cart?.item_list ||
    [];
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => ({
    key: item.productId || item.id || item.sku || index,
    name: item.name || item.product?.name || "Product",
    sku: item.sku || item.product?.sku || "",
    quantity: Number(item.quantity || item.qty || item.itemQty || 1) || 1,
    price:
      Number(
        item.netPrice ??
          item.net_price ??
          item.price ??
          item.listPrice ??
          item.mrp ??
          0,
      ) || 0,
    mrp: Number(item.mrp ?? item.price ?? item.listPrice ?? 0) || 0,
    productId: item.productId || item.id || "",
    storeCode: item.storeCode || item.store_code || item.store?.storeCode || "",
    storeId:
      Number(item.storeId || item.store_id || item.store?.id || 0) || undefined,
  }));
}

const orderSubtotal = computed(() =>
  checkoutItems.value.reduce((sum, item) => sum + getLineTotal(item), 0),
);

function ensureOneDefaultAddress() {
  if (!addresses.value.length) return;
  const current = addresses.value.find((e) => e.isDefault);
  if (!current) {
    addresses.value = addresses.value.map((e, i) => ({
      ...e,
      isDefault: i === 0,
    }));
    return;
  }
  let used = false;
  addresses.value = addresses.value.map((e) => {
    if (e.id === current.id && !used) {
      used = true;
      return { ...e, isDefault: true };
    }
    return { ...e, isDefault: false };
  });
}

function toggleAddressForm() {
  if (showAddressForm.value) {
    cancelAddressForm();
    return;
  }
  editingAddressId.value = null;
  showAddressForm.value = true;
  addressError.value = "";
  addressForm.value = {
    addressType: "Home",
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  };
}

function cancelAddressForm() {
  showAddressForm.value = false;
  addressError.value = "";
  editingAddressId.value = null;
  addressForm.value = {
    addressType: "Home",
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  };
}

function updateAddressField(field, value) {
  addressForm.value = {
    ...addressForm.value,
    [field]: value,
  };
}

function startEditAddress(id) {
  const existing = addresses.value.find((entry) => entry.id === id);
  if (!existing) return;

  editingAddressId.value = id;
  selectedAddressId.value = id;
  addressError.value = "";
  showAddressForm.value = true;
  addressForm.value = {
    addressType: existing.addressType || "Home",
    fullName: existing.fullName || "",
    phone: existing.phone || "",
    addressLine: existing.addressLine || "",
    city: existing.city || "",
    state: existing.state || "",
    pincode: existing.pincode || "",
  };
}

async function addAddress() {
  addressError.value = "";
  if (isSavingAddress.value) return;

  const f = addressForm.value;
  if (
    !f.fullName ||
    !f.phone ||
    !f.addressLine ||
    !f.city ||
    !f.state ||
    !f.pincode
  ) {
    addressError.value = "Please fill all address fields.";
    return;
  }

  isSavingAddress.value = true;

  if (editingAddressId.value !== null) {
    const targetId = editingAddressId.value;
    const existingAddress =
      addresses.value.find((entry) => entry.id === targetId) || null;
    const isDefault =
      addresses.value.find((entry) => entry.id === targetId)?.isDefault ||
      false;
    try {
      await saveCustomerAddress({
        addressId: targetId,
        formValue: f,
        isDefault,
        existingAddress,
      });
      await loadCustomerAddresses();
      selectedAddressId.value = targetId;
      cancelAddressForm();
    } catch (error) {
      addressError.value = error?.message || "Failed to update address.";
    } finally {
      isSavingAddress.value = false;
    }
    return;
  }

  const hasDefault = addresses.value.some((e) => e.isDefault);
  try {
    const saveResponse = await saveCustomerAddress({
      formValue: f,
      isDefault: !hasDefault,
    });
    const createdId = extractAddressIdFromResponse(saveResponse);
    await loadCustomerAddresses();
    if (createdId !== null) {
      const created = addresses.value.find((entry) => entry.id === createdId);
      if (created) {
        selectedAddressId.value = created.id;
      }
    }
    cancelAddressForm();
  } catch (error) {
    addressError.value = error?.message || "Failed to add address.";
  } finally {
    isSavingAddress.value = false;
  }
}

function setDefaultAddress(id) {
  addresses.value = addresses.value.map((e) => ({
    ...e,
    isDefault: e.id === id,
  }));
  selectedAddressId.value = id;
}

async function removeAddress(id) {
  addressError.value = "";

  const existing = addresses.value.find((entry) => entry.id === id);
  if (!existing) return;

  if (existing.fromApi) {
    try {
      await deleteCustomerAddressById(id);
      await loadCustomerAddresses();
    } catch (error) {
      addressError.value = error?.message || "Failed to remove address.";
      return;
    }
    return;
  }

  addresses.value = addresses.value.filter((e) => e.id !== id);

  if (!addresses.value.length) {
    selectedAddressId.value = null;
    showAddressForm.value = true;
    return;
  }

  ensureOneDefaultAddress();
  if (!addresses.value.some((e) => e.id === selectedAddressId.value)) {
    const fallback =
      addresses.value.find((e) => e.isDefault) || addresses.value[0];
    selectedAddressId.value = fallback?.id ?? null;
  }
}

function goToPaymentOptions() {
  router.push({ name: "payment-options" });
}

function formatRs(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "Rs 0";
  return `Rs ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(parsed)}`;
}

function getLineTotal(item) {
  return (Number(item?.quantity || 1) || 1) * (Number(item?.price || 0) || 0);
}

async function loadCheckoutData() {
  isLoading.value = true;
  errorMessage.value = "";

  if (!getToken()) {
    // Demo/guest session — no real backend token, local cart data is final.
    checkoutItems.value = hydrateItems([...(cartStore.items || [])]);
    isLoading.value = false;
    return;
  }

  try {
    await cartStore.syncGuestCartAfterLogin();
    await cartStore.refreshCartData();
    const cartId = Number(cartStore.cartMeta?.cartId || 0);
    if (!cartId) {
      checkoutItems.value = hydrateItems([...(cartStore.items || [])]);
      return;
    }
    checkoutCartId.value = cartId;
    const response = await refreshCart({
      operation: "Refresh cart",
      cartId,
      customerMobileNumber: cartStore.cartMeta?.customerMobileNumber || undefined,
      customerName: "",
    });
    const apiItems = normalizeItemsFromResponse(response);
    checkoutItems.value = hydrateItems(
      apiItems.length ? apiItems : [...(cartStore.items || [])],
    );
  } catch (error) {
    checkoutItems.value = hydrateItems([...(cartStore.items || [])]);
    const message = error?.response?.data?.statusMessage || error?.message || "";
    if (!/token/i.test(message)) {
      errorMessage.value = message || "Failed to load checkout details.";
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  ensureOneDefaultAddress();
  await Promise.all([loadCheckoutData(), loadCustomerAddresses()]);
});
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css");

.place-order-page {
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  width: 92%;
  max-width: 1200px;
  margin: 0 auto;
}

.place-order-content {
  padding: 32px 0 64px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── PROGRESS ── */
.checkout-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 8px 0 4px;
}
.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.step-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #d1dbe8;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 16px;
}
.progress-step.completed .step-dot {
  border-color: #003da5;
  background: #003da5;
  color: #fff;
}
.progress-step.active .step-dot {
  border-color: #003da5;
  background: #fff;
  color: #003da5;
  box-shadow: 0 0 0 4px rgba(0, 61, 165, 0.1);
}
.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}
.progress-step.completed .step-label,
.progress-step.active .step-label { color: #003da5; }
.progress-line {
  width: 80px;
  height: 2px;
  background: #d1dbe8;
  margin-bottom: 18px;
}
.progress-line.active { background: #003da5; }

/* ── GRID ── */
.checkout-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: start;
}
.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.col-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0a2240;
  letter-spacing: -0.3px;
}

/* ── ADD NEW BTN ── */
.add-addr-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #003da5;
  background: transparent;
  color: #003da5;
  border-radius: 999px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.add-addr-btn:hover {
  background: #003da5;
  color: #fff;
}

/* ── ADDRESS LIST ── */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-card {
  border: 1.5px solid #e2eaf6;
  border-radius: 14px;
  background: #fff;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.address-card:hover { border-color: #b3c8ee; }
.address-card.selected {
  border-color: #003da5;
  box-shadow: 0 0 0 3px rgba(0, 61, 165, 0.08);
  background: #fafcff;
}

/* TOP ROW */
.addr-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.addr-left-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.addr-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 61, 165, 0.06);
  color: #003da5;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}
.default-pill {
  font-size: 11px;
  font-weight: 700;
  color: #0a2240;
  background: #ffc72c;
  border-radius: 999px;
  padding: 3px 9px;
}
.addr-right-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.icon-action-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #e2eaf6;
  background: #f8fafc;
  color: #5a6b82;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.18s;
  font-size: 15px;
}
.icon-action-btn:hover { border-color: #003da5; color: #003da5; background: rgba(0, 61, 165, 0.05); }
.icon-action-btn.danger:hover { border-color: #dc2626; color: #dc2626; background: #fff4f4; }
.icon-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* BODY */
.addr-body {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.addr-check-col { flex-shrink: 0; padding-top: 2px; }
.radio-ring {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d1dbe8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
  background: #fff;
}
.radio-ring.active {
  border-color: #003da5;
  background: #003da5;
}
.check-icon {
  font-size: 12px;
  color: #fff;
  font-weight: 700;
}
.addr-text-col { flex: 1; min-width: 0; }
.address-name {
  margin: 0 0 3px;
  font-size: 15px;
  font-weight: 700;
  color: #0a2240;
}
.address-line {
  margin: 0 0 3px;
  font-size: 13px;
  color: #344760;
  line-height: 1.5;
}
.address-meta {
  margin: 0;
  font-size: 13px;
  color: #5a6b82;
}
.set-default-btn {
  margin-top: 8px;
  border: none;
  background: none;
  color: #003da5;
  font-size: 12px;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.set-default-btn:hover { color: #0033a0; }

/* ── SUMMARY CARD ── */
.summary-card {
  border: 1px solid #dce7f6;
  border-radius: 16px;
  background: #fff;
  padding: 20px;
}
.summary-items {
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.summary-item {
  display: flex;
  align-items: center;
  gap: 14px;
}
.summary-item-img {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2eaf6;
  background: #f8fafc;
}
.summary-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 20px;
}
.summary-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.summary-item-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #0a2240;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.summary-item-sku {
  margin: 0;
  font-size: 11px;
  color: #94a3b8;
}
.summary-item-qty {
  margin: 0;
  font-size: 12px;
  color: #5a6b82;
  font-weight: 600;
}
.summary-item-price {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #003da5;
  white-space: nowrap;
  flex-shrink: 0;
}
.summary-totals {
  border-top: 1px solid #edf2f7;
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #344760;
}
.total-row.grand {
  padding-top: 10px;
  border-top: 1px solid #edf2f7;
  font-size: 16px;
  font-weight: 800;
  color: #0a2240;
}
.free-tag {
  color: #15803d;
  font-weight: 700;
  font-size: 13px;
}

/* ── CTA ── */
.cta-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.cta-ghost {
  width: 100%;
  height: 44px;
  border: 1.5px solid #d1dbe8;
  border-radius: 50px;
  background: #fff;
  color: #344760;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}
.cta-ghost:hover { border-color: #003da5; color: #003da5; }

.cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffc72c;
  border: 2px solid #ffc72c;
  color: #0a2240;
  border-radius: 50px;
  padding: 13px 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}
.cta-primary:hover {
  background: #003da5;
  border-color: #003da5;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 61, 165, 0.3);
}

/* ── SHARED BUTTONS ── */
.ghost-btn {
  border: 1px solid #d1dbe8;
  background: #fff;
  color: #344760;
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}
.primary-btn {
  border: none;
  background: #003da5;
  color: #fff;
  border-radius: 999px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}
.primary-btn:hover { background: #0033a0; }
.link-btn {
  border: none;
  background: transparent;
  color: #003da5;
  font-size: 13px;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}
.link-btn.danger { color: #dc2626; }
.link-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.small-error {
  margin: 4px 0 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
}

/* ── RESPONSE BOXES ── */
.response-box {
  border: 1px solid #dce7f6;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
}
.response-box h3 {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 800;
  color: #0a2240;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.info-cell {
  border: 1px solid #e4ecf9;
  border-radius: 8px;
  background: #f9fbff;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-cell span { color: #60748f; font-size: 12px; }
.info-cell strong { color: #0a2240; font-size: 13px; }
.items-table-row {
  display: grid;
  grid-template-columns: 2fr 1.3fr 0.8fr 1fr 1fr;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e8eef8;
  font-size: 12px;
  color: #344760;
}
.items-table-head {
  font-weight: 700;
  color: #0a2240;
  border-bottom: 1px solid #dce7f6;
}
.bill-preview {
  margin: 0 0 8px;
  white-space: pre-wrap;
  word-break: break-word;
  background: #f6f9ff;
  border: 1px solid #dce7f6;
  border-radius: 8px;
  padding: 10px;
  max-height: 180px;
  overflow: auto;
  font-size: 11px;
  color: #243952;
}
.raw-response-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: #f5f8ff;
  border: 1px solid #dce7f6;
  border-radius: 8px;
  padding: 10px;
  max-height: 260px;
  overflow: auto;
  color: #223853;
  font-size: 12px;
}
.response-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: #3f526d;
  padding: 4px 0;
}
.response-row strong { color: #0a2240; }
.status-text { margin: 0; color: #5f6f85; font-size: 14px; }
.status-text.centered { text-align: center; padding: 40px 0; }
.status-text.error { color: #dc2626; font-weight: 700; }
.response-hint { margin-top: 4px; }

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .right-col { order: -1; }
}
@media (max-width: 600px) {
  .address-form-grid { grid-template-columns: 1fr; }
  .info-grid { grid-template-columns: 1fr; }
  .items-table-row { grid-template-columns: 1fr; gap: 2px; }
  .progress-line { width: 48px; }
  .col-title { font-size: 18px; }
  .addr-type-group { flex-wrap: wrap; }
  .place-order-content { padding: 24px 0 48px; }
  .summary-item-name { white-space: normal; }
}
</style>