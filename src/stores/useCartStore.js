import { defineStore } from "pinia";
import { useAppStore } from "./useAppStore.js";
import {
  addItemToCart,
  getToken,
  refreshCart,
  removeItemFromCart,
  updateItemQty,
} from "rdep-ecom-sdk";

const CART_STORAGE_KEY = "ecom.cart.items";
const CART_META_STORAGE_KEY = "ecom.cart.meta";
const CURRENT_USER_STORAGE_KEY = "auth.currentUser";

function getSavedAuthState() {
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function isUserAuthenticated() {
  const tokenFromSdk = String(getToken() || "").trim();
  if (tokenFromSdk) {
    return true;
  }

  const savedAuth = getSavedAuthState();
  const savedToken = String(savedAuth?.token || "").trim();
  return Boolean(savedToken);
}

function loadSavedItems() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to read cart cache", error);
    return [];
  }
}

function saveItems(items) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items || []));
}

function loadSavedMeta() {
  try {
    const raw = window.localStorage.getItem(CART_META_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Failed to read cart meta cache", error);
    return {};
  }
}

function saveMeta(meta) {
  window.localStorage.setItem(
    CART_META_STORAGE_KEY,
    JSON.stringify(meta || {}),
  );
}

function normalizeCountFromResponse(response) {
  const data = response?.data || response || {};
  const nestedData = data?.data || {};
  const directCount =
    data.totalItemCount ??
    data.total_item_count ??
    data.itemCount ??
    nestedData.totalItemCount ??
    nestedData.total_item_count ??
    nestedData.itemCount ??
    null;

  if (directCount !== null && directCount !== undefined && directCount !== "") {
    return Number(directCount) || 0;
  }

  const list =
    data.cartItems ||
    data.items ||
    data.item_list ||
    data.cart?.item_list ||
    nestedData.cartItems ||
    nestedData.items ||
    nestedData.item_list ||
    nestedData.cart?.item_list ||
    null;
  if (Array.isArray(list)) {
    return list.reduce((sum, item) => {
      const qty = Number(
        item?.quantity ?? item?.qty ?? item?.itemQty ?? item?.count ?? 1,
      );
      return sum + (Number.isFinite(qty) ? qty : 1);
    }, 0);
  }

  return null;
}

function getResponseData(response) {
  return response?.data || response || {};
}

function getCartIdFromResponse(response) {
  const data = getResponseData(response);
  const nestedData = data?.data || {};
  return (
    data.cartId ||
    data.cart_id ||
    data.id ||
    data.cart?.cartId ||
    data.cart?.cart_id ||
    data.cart?.id ||
    nestedData.cartId ||
    nestedData.cart_id ||
    nestedData.id ||
    nestedData.cart?.cartId ||
    nestedData.cart?.cart_id ||
    nestedData.cart?.id ||
    ""
  );
}

function toNumericCartId(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getMobileFromResponse(response) {
  const data = getResponseData(response);
  const nestedData = data?.data || {};
  return (
    data.customerMobileNumber ||
    data.customerMobile ||
    data.mobileNumber ||
    data.mobile ||
    data.cart?.customerMobileNumber ||
    data.cart?.customerMobile ||
    nestedData.customerMobileNumber ||
    nestedData.customerMobile ||
    nestedData.mobileNumber ||
    nestedData.mobile ||
    nestedData.cart?.customerMobileNumber ||
    nestedData.cart?.customerMobile ||
    ""
  );
}

function getImageUrlFromSource(source) {
  if (!source) return "";

  if (typeof source === "string") {
    return source;
  }

  if (Array.isArray(source)) {
    const firstValid = source
      .map((entry) => getImageUrlFromSource(entry))
      .find((url) => Boolean(url));
    return firstValid || "";
  }

  return (
    source.path ||
    source.url ||
    source.fileUrl ||
    source.imageUrl ||
    source.image ||
    source.location ||
    source.thumbnail ||
    ""
  );
}

function resolveCartItemImage(item, product) {
  return (
    getImageUrlFromSource(item?.image) ||
    getImageUrlFromSource(item?.imageUrl) ||
    getImageUrlFromSource(item?.filePath) ||
    getImageUrlFromSource(item?.thumbnail) ||
    getImageUrlFromSource(item?.files) ||
    getImageUrlFromSource(item?.productFiles) ||
    getImageUrlFromSource(item?.images) ||
    getImageUrlFromSource(product?.image) ||
    getImageUrlFromSource(product?.imageUrl) ||
    getImageUrlFromSource(product?.filePath) ||
    getImageUrlFromSource(product?.thumbnail) ||
    getImageUrlFromSource(product?.files) ||
    getImageUrlFromSource(product?.productFiles) ||
    getImageUrlFromSource(product?.images) ||
    getImageUrlFromSource(product?.product?.files) ||
    getImageUrlFromSource(product?.product?.productFiles) ||
    getImageUrlFromSource(product?.product?.images) ||
    ""
  );
}

function resolveStoreId(item, product) {
  const raw =
    item?.storeId ??
    item?.store_id ??
    item?.storeID ??
    item?.store?.id ??
    item?.store?.storeId ??
    item?.store?.store_id ??
    product?.storeId ??
    product?.store_id ??
    product?.storeID ??
    product?.store?.id ??
    product?.store?.storeId ??
    product?.store?.store_id;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function resolveStoreCode(item, product) {
  const raw =
    item?.storeCode ||
    item?.store_code ||
    item?.storeCd ||
    item?.store?.storeCode ||
    item?.store?.store_code ||
    item?.store?.code ||
    product?.storeCode ||
    product?.store_code ||
    product?.storeCd ||
    product?.store?.storeCode ||
    product?.store?.store_code ||
    product?.store?.code ||
    "";
  return String(raw).trim();
}

function extractStoreContext(source) {
  if (!source || typeof source !== "object") {
    return { storeId: undefined, storeCode: "" };
  }

  const parsedStoreId = Number(
    source.storeId ||
      source.store_id ||
      source.storeID ||
      source.store?.id ||
      source.store?.storeId ||
      source.tenantStoreId ||
      0,
  );
  const storeCode = String(
    source.storeCode ||
      source.store_code ||
      source.storeCd ||
      source.store?.storeCode ||
      source.store?.code ||
      "",
  ).trim();

  return {
    storeId:
      Number.isFinite(parsedStoreId) && parsedStoreId > 0
        ? parsedStoreId
        : undefined,
    storeCode,
  };
}

function getPayloadData(responsePayload) {
  if (!responsePayload || typeof responsePayload !== "object") {
    return null;
  }

  if (responsePayload?.data?.data) return responsePayload.data.data;
  if (responsePayload?.data) return responsePayload.data;
  return responsePayload;
}

function normalizeItemFromResponse(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const product = item.product || item.productDetails || item;
  const productId = String(
    item.productId || product.productId || product.id || "",
  );
  const sku = String(item.sku || product.sku || "");
  const key = productId || sku;

  if (!key) {
    return null;
  }

  const resolvedQuantity = Number(
    item.quantity ??
      item.qty ??
      item.itemQty ??
      item.item_qty ??
      item.itemQuantity ??
      item.orderQty ??
      item.order_qty ??
      item.count ??
      product.quantity ??
      product.qty ??
      product.itemQty ??
      product.itemQuantity ??
      1,
  );

  return {
    key,
    productId,
    sku,
    storeId: resolveStoreId(item, product),
    storeCode: resolveStoreCode(item, product),
    name: item.name || product.name || "Product",
    price:
      item.price ??
      item.listPrice ??
      product.listPrice ??
      item.mrp ??
      product.mrp ??
      null,
    image: resolveCartItemImage(item, product),
    quantity:
      Number.isFinite(resolvedQuantity) && resolvedQuantity > 0
        ? resolvedQuantity
        : 1,
  };
}

function looksLikeCartItem(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return false;
  }

  return Boolean(
    candidate.sku ||
      candidate.productId ||
      candidate.itemId ||
      candidate.product ||
      candidate.productDetails,
  );
}

function findCartItemsInObject(source, depth = 0, visited = new Set()) {
  if (!source || typeof source !== "object" || depth > 6) {
    return null;
  }

  if (visited.has(source)) {
    return null;
  }
  visited.add(source);

  if (Array.isArray(source)) {
    if (source.length && source.some((entry) => looksLikeCartItem(entry))) {
      return source;
    }

    for (const entry of source) {
      const nested = findCartItemsInObject(entry, depth + 1, visited);
      if (Array.isArray(nested) && nested.length) {
        return nested;
      }
    }
    return null;
  }

  for (const value of Object.values(source)) {
    const nested = findCartItemsInObject(value, depth + 1, visited);
    if (Array.isArray(nested) && nested.length) {
      return nested;
    }
  }

  return null;
}

function normalizeItemsFromResponse(response) {
  const data = getResponseData(response);
  const nestedData = data?.data || {};
  const possibleLists = [
    data.cartItems,
    data.cartItemList,
    data.cart_item_list,
    data.cartItemResponses,
    data.cart_item_responses,
    data.items,
    data.item_list,
    data.cart?.item_list,
    data.cart?.cartItems,
    data.cart?.cartItemList,
    data.cart?.cart_item_list,
    data.cart?.cartItemResponses,
    data.cart?.items,
    nestedData.cartItems,
    nestedData.cartItemList,
    nestedData.cart_item_list,
    nestedData.cartItemResponses,
    nestedData.cart_item_responses,
    nestedData.items,
    nestedData.item_list,
    nestedData.cart?.item_list,
    nestedData.cart?.cartItems,
    nestedData.cart?.cartItemList,
    nestedData.cart?.cart_item_list,
    nestedData.cart?.cartItemResponses,
    nestedData.cart?.items,
  ];

  const source =
    possibleLists.find((list) => Array.isArray(list) && list.length) ||
    findCartItemsInObject(data) ||
    findCartItemsInObject(nestedData);

  if (!source) {
    return null;
  }

  return source
    .map((item) => normalizeItemFromResponse(item))
    .filter((item) => Boolean(item));
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: loadSavedItems(),
    totalCount: 0,
    lastResponse: null,
    cartMeta: {
      cartId: null,
      customerMobileNumber: "",
      guestSyncPending: false,
      ...loadSavedMeta(),
    },
  }),

  getters: {
    hasItems: (state) => state.items.length > 0,
    grandTotalAmount: (state) =>
      state.items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + price * quantity;
      }, 0),
  },

  actions: {
    async resolveStoreContextForCart() {
      const appStore = useAppStore();

      const fromTenantDetails = extractStoreContext(appStore.tenantDetails);
      if (fromTenantDetails.storeId && fromTenantDetails.storeCode) {
        return fromTenantDetails;
      }

      const domainName = String(
        appStore.domainName || window.location.host || "",
      ).trim();
      const baseURL = String(
        appStore.tenantApiBaseUrl || appStore.baseUrl || "",
      ).trim();
      if (!domainName || !baseURL) {
        return fromTenantDetails;
      }

      try {
        const encodedDomain = encodeURIComponent(domainName);
        const response = await fetch(
          `${baseURL}/auth-service/noauth/store/info/${encodedDomain}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          return fromTenantDetails;
        }

        const payload = await response.json();
        const data = getPayloadData(payload);
        if (data) {
          appStore.setTenantDetails(data);
        }

        const fromApi = extractStoreContext(data);
        if (fromApi.storeId && fromApi.storeCode) {
          return fromApi;
        }
      } catch (error) {
        // Keep removal flow resilient; validation later handles missing fields.
      }

      return fromTenantDetails;
    },

    initializeCount() {
      this.totalCount = this.items.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0,
      );
    },

    persistCartState() {
      saveItems(this.items);
      saveMeta(this.cartMeta);
      this.initializeCount();
    },

    syncMetaFromResponse(response) {
      const cartId = toNumericCartId(getCartIdFromResponse(response));
      const mobile = String(getMobileFromResponse(response) || "");

      this.cartMeta = {
        ...this.cartMeta,
        cartId: cartId || toNumericCartId(this.cartMeta.cartId) || null,
        customerMobileNumber:
          mobile || this.cartMeta.customerMobileNumber || "",
      };
    },

    syncItemsFromResponse(response) {
      const normalizedItems = normalizeItemsFromResponse(response);
      const serverCount = normalizeCountFromResponse(response);

      if (Array.isArray(normalizedItems)) {
        this.items = normalizedItems;
      } else if (isUserAuthenticated()) {
        // Clear only when API explicitly says cart is empty.
        if (serverCount === 0) {
          this.items = [];
        }
      }

      if (serverCount !== null) {
        this.totalCount = serverCount;
      } else if (!Array.isArray(normalizedItems) && isUserAuthenticated()) {
        this.totalCount = this.items.reduce(
          (sum, item) => sum + (Number(item?.quantity) || 1),
          0,
        );
      } else {
        this.totalCount = this.items.reduce(
          (sum, item) => sum + (Number(item?.quantity) || 1),
          0,
        );
      }

      this.syncMetaFromResponse(response);
      this.persistCartState();
    },

    applyRefreshResponse(response) {
      const normalizedItems = normalizeItemsFromResponse(response);
      const serverCount = normalizeCountFromResponse(response);

      if (Array.isArray(normalizedItems)) {
        this.items = normalizedItems;
      } else if (serverCount === 0) {
        // Some refresh responses return only count without item list.
        this.items = [];
      } else if (Number.isFinite(serverCount) && serverCount > 0) {
        const localCount = this.items.reduce(
          (sum, item) => sum + (Number(item?.quantity) || 1),
          0,
        );

        if (localCount !== serverCount) {
          // Keep current items when payload shape is unknown, but sync count.
          this.totalCount = serverCount;
        }
      }

      if (serverCount !== null) {
        this.totalCount = serverCount;
      } else {
        this.totalCount = this.items.reduce(
          (sum, item) => sum + (Number(item?.quantity) || 1),
          0,
        );
      }

      this.syncMetaFromResponse(response);
      this.persistCartState();
    },

    async addItemWithCartContext(cartItems = []) {
      const normalizedItems = Array.isArray(cartItems) ? cartItems : [];
      if (!normalizedItems.length) {
        return null;
      }

      const cartId = toNumericCartId(this.cartMeta?.cartId);
      try {
        return await addItemToCart({
          operation: "AddItem",
          ...(cartId ? { cartId } : {}),
          cartItems: normalizedItems,
        });
      } catch (error) {
        if (!cartId) {
          throw error;
        }

        // If server rejects the old cart after checkout, create a new one.
        return await addItemToCart({
          operation: "AddItem",
          cartItems: normalizedItems,
        });
      }
    },

    upsertLocalItem(product, quantity = 1) {
      const productId = String(product?.productId || product?.id || "");
      const sku = String(product?.sku || "");
      const key = productId || sku;

      if (!key) {
        return;
      }

      const existingIndex = this.items.findIndex((item) => item.key === key);
      if (existingIndex > -1) {
        const existing = this.items[existingIndex];
        this.items[existingIndex] = {
          ...existing,
          quantity: (Number(existing.quantity) || 1) + quantity,
        };
      } else {
        this.items.push({
          key,
          productId,
          sku,
          name: product?.name || "Product",
          price: product?.listPrice ?? product?.mrp ?? null,
          image: resolveCartItemImage(product, product),
          quantity,
        });
      }

      this.persistCartState();
    },

    getLineTotal(item) {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 1;
      return price * quantity;
    },

    updateItemQuantity(itemKey, quantity) {
      const key = String(itemKey || "");
      if (!key) {
        return;
      }

      const index = this.items.findIndex((item) => item.key === key);
      if (index === -1) {
        return;
      }

      const nextQty = Math.max(1, Number(quantity) || 1);
      this.items[index] = {
        ...this.items[index],
        quantity: nextQty,
      };

      this.persistCartState();
    },

    async increaseItemQuantity(itemKey) {
      const key = String(itemKey || "");
      const existing = this.items.find((item) => item.key === key);
      if (!existing) {
        return;
      }

      const nextQuantity = (Number(existing.quantity) || 1) + 1;
      await this.updateQuantityByApi(existing, nextQuantity);
    },

    async decreaseItemQuantity(itemKey) {
      const key = String(itemKey || "");
      const existing = this.items.find((item) => item.key === key);
      if (!existing) {
        return;
      }

      const nextQuantity = (Number(existing.quantity) || 1) - 1;
      if (nextQuantity <= 0) {
        await this.removeItem(itemKey);
        return;
      }

      await this.updateQuantityByApi(existing, nextQuantity);
    },

    async removeItem(itemKey) {
      const key = String(itemKey || "");
      let existing = this.items.find((item) => item.key === key);

      if (!existing) {
        return;
      }

      if (!isUserAuthenticated()) {
        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: true,
        };
        this.items = this.items.filter((item) => item.key !== key);
        this.persistCartState();
        return;
      }

      if (this.cartMeta?.guestSyncPending) {
        await this.syncGuestCartAfterLogin();
        existing = this.items.find((item) => item.key === key);
        if (!existing) {
          await this.refreshCartData();
          return;
        }
      }

      let cartId = toNumericCartId(this.cartMeta?.cartId);
      if (!cartId) {
        await this.syncGuestCartAfterLogin();
        cartId = toNumericCartId(this.cartMeta?.cartId);
      }

      if (!cartId) {
        await this.refreshCartData();
        throw new Error("Cart not found for remove item API.");
      }

      try {
        let removeTarget = existing;
        if (!removeTarget.storeId || !removeTarget.storeCode) {
          await this.refreshCartData();
          const refreshed = this.items.find((item) => item.key === key);
          if (refreshed) {
            removeTarget = refreshed;
          }
        }

        if (!removeTarget.storeId || !removeTarget.storeCode) {
          const storeContext = await this.resolveStoreContextForCart();
          removeTarget = {
            ...removeTarget,
            storeId: removeTarget.storeId || storeContext.storeId,
            storeCode: removeTarget.storeCode || storeContext.storeCode,
          };
        }

        const parsedCartId = Number(cartId);
        const payloadCartId =
          Number.isFinite(parsedCartId) && parsedCartId > 0
            ? parsedCartId
            : cartId;
        const parsedStoreId = Number(removeTarget.storeId);
        const payloadStoreCode = String(removeTarget.storeCode || "").trim();
        const payloadSku = String(removeTarget.sku || "").trim();

        if (
          !(Number.isFinite(parsedStoreId) && parsedStoreId > 0) ||
          !payloadStoreCode ||
          !payloadSku
        ) {
          throw new Error("Store details missing for remove item payload.");
        }

        const response = await removeItemFromCart({
          operation: "RemoveItem",
          cartId: payloadCartId,
          cartItems: [
            {
              storeId: parsedStoreId,
              sku: payloadSku,
              storeCode: payloadStoreCode,
            },
          ],
        });

        this.lastResponse = response;
        this.syncItemsFromResponse(response);
        await this.refreshCartData();
      } catch (error) {
        await this.refreshCartData();
        throw error;
      }
    },

    async updateQuantityByApi(item, quantity, isRemove = false) {
      const nextQty = Number(quantity) || 0;
      const authenticated = isUserAuthenticated();
      const previousQty = Number(item?.quantity) || 1;

      if (!authenticated) {
        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: true,
        };

        if (isRemove || nextQty <= 0) {
          this.items = this.items.filter((row) => row.key !== item.key);
        } else {
          this.updateItemQuantity(item.key, nextQty);
        }

        this.persistCartState();
        return;
      }

      if (this.cartMeta?.guestSyncPending) {
        await this.syncGuestCartAfterLogin();
      }

      let cartId = toNumericCartId(this.cartMeta?.cartId);

      if (!cartId) {
        await this.syncGuestCartAfterLogin();
        cartId = toNumericCartId(this.cartMeta?.cartId);

        if (!cartId) {
          this.cartMeta = {
            ...this.cartMeta,
            guestSyncPending: true,
          };
          if (isRemove || nextQty <= 0) {
            this.items = this.items.filter((row) => row.key !== item.key);
          } else {
            this.updateItemQuantity(item.key, nextQty);
          }
          this.persistCartState();
          return;
        }
      }

      try {
        // Optimistically update UI so quantity changes are visible instantly.
        this.updateItemQuantity(item.key, nextQty);

        let updateTarget = item;
        if (!updateTarget?.storeId || !updateTarget?.storeCode) {
          await this.refreshCartData();
          const refreshed = this.items.find((row) => row.key === item.key);
          if (refreshed) {
            updateTarget = refreshed;
          }
        }

        if (!updateTarget?.storeId || !updateTarget?.storeCode) {
          const storeContext = await this.resolveStoreContextForCart();
          updateTarget = {
            ...updateTarget,
            storeId: updateTarget?.storeId || storeContext.storeId,
            storeCode: updateTarget?.storeCode || storeContext.storeCode,
          };
        }

        const parsedStoreId = Number(updateTarget?.storeId);
        const payloadStoreCode = String(updateTarget?.storeCode || "").trim();
        const payloadSku = String(updateTarget?.sku || item?.sku || "").trim();

        if (
          !(Number.isFinite(parsedStoreId) && parsedStoreId > 0) ||
          !payloadStoreCode ||
          !payloadSku
        ) {
          throw new Error("Store details missing for update quantity payload.");
        }

        const response = await updateItemQty({
          operation: "UpdateItemQuantity",
          cartId,
          cartItems: [
            {
              storeId: parsedStoreId,
              newQuantity: nextQty,
              storeCode: payloadStoreCode,
              sku: payloadSku,
            },
          ],
        });

        this.lastResponse = response;

        const normalizedFromUpdate = normalizeItemsFromResponse(response);
        if (
          Array.isArray(normalizedFromUpdate) &&
          normalizedFromUpdate.length
        ) {
          this.syncItemsFromResponse(response);
        } else {
          this.syncMetaFromResponse(response);
          this.persistCartState();
        }

        // Final state must always come from refresh API for logged-in users.
        await this.refreshCartData();
      } catch (error) {
        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: true,
        };
        if (isRemove || nextQty <= 0) {
          this.items = this.items.filter((row) => row.key !== item.key);
        } else {
          this.updateItemQuantity(item.key, previousQty);
        }
        throw error;
      }
    },

    async refreshCartData() {
      if (!isUserAuthenticated()) {
        this.persistCartState();
        return null;
      }

      const cartId = toNumericCartId(this.cartMeta?.cartId);
      if (!cartId) {
        this.persistCartState();
        return null;
      }

      try {
        const response = await refreshCart({
          operation: "Refresh cart",
          cartId,
          customerMobileNumber:
            this.cartMeta?.customerMobileNumber || undefined,
          customerName: "",
          customerEmail: "",
        });

        this.lastResponse = response;
        this.applyRefreshResponse(response);
        return response;
      } catch (error) {
        this.persistCartState();
        return null;
      }
    },

    async clearCartAfterPayment() {
      const authenticated = isUserAuthenticated();
      const itemKeys = Array.isArray(this.items)
        ? this.items.map((item) => item?.key).filter((key) => Boolean(key))
        : [];

      if (authenticated && itemKeys.length) {
        for (const key of itemKeys) {
          try {
            await this.removeItem(key);
          } catch (error) {
            // Continue clearing remaining items even if one request fails.
          }
        }
      }

      this.items = [];
      this.totalCount = 0;
      this.cartMeta = {
        ...this.cartMeta,
        guestSyncPending: false,
      };
      this.persistCartState();

      if (authenticated && toNumericCartId(this.cartMeta?.cartId)) {
        await this.refreshCartData();
      }
    },

    async addProductToCart(product) {
      const productId = String(product?.productId || product?.id || "");
      const sku = String(product?.sku || "");

      const cartItem = {
        productId,
        sku,
        quantity: 1,
      };

      if (!isUserAuthenticated()) {
        this.upsertLocalItem(product, 1);
        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: true,
        };
        this.persistCartState();
        return null;
      }

      try {
        await this.syncGuestCartAfterLogin();

        const response = await this.addItemWithCartContext([cartItem]);

        this.lastResponse = response;
        this.syncItemsFromResponse(response);
        await this.refreshCartData();

        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: false,
        };
        this.persistCartState();

        return response;
      } catch (error) {
        // Do not mix local fallback into authenticated cart display.
        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: true,
        };
        this.persistCartState();
        throw error;
      }
    },

    async syncGuestCartAfterLogin() {
      if (!isUserAuthenticated()) {
        return null;
      }

      const localSnapshot = Array.isArray(this.items)
        ? this.items
            .map((item) => ({
              key: item.key,
              productId: String(item.productId || ""),
              sku: String(item.sku || ""),
              quantity: Number(item.quantity) || 1,
              name: item.name,
              price: item.price,
              image: item.image,
              storeId: item.storeId,
              storeCode: item.storeCode,
            }))
            .filter((item) => item.productId || item.sku)
        : [];

      if (!localSnapshot.length) {
        await this.refreshCartData();
        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: false,
        };
        this.persistCartState();
        return null;
      }

      try {
        // Load server cart first and then merge only missing quantity deltas.
        await this.refreshCartData();

        const serverQtyByKey = new Map();
        for (const item of this.items) {
          const key = String(item?.key || item?.productId || item?.sku || "");
          if (!key) continue;
          serverQtyByKey.set(key, Number(item?.quantity) || 0);
        }

        let lastAddResponse = null;
        for (const item of localSnapshot) {
          const key = String(item?.key || item?.productId || item?.sku || "");
          const localQty = Number(item.quantity) || 0;
          const serverQty = Number(serverQtyByKey.get(key) || 0);
          const quantityDelta = localQty - serverQty;
          if (quantityDelta <= 0) {
            continue;
          }

          const response = await this.addItemWithCartContext([
            {
              productId: item.productId || undefined,
              sku: item.sku || undefined,
              quantity: quantityDelta,
            },
          ]);

          lastAddResponse = response;
          this.lastResponse = response;
          this.syncMetaFromResponse(response);
        }

        await this.refreshCartData();

        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: false,
        };
        this.persistCartState();

        return lastAddResponse;
      } catch (error) {
        // Keep guest cart items visible for retry if merge fails.
        this.items = localSnapshot.map((item) => ({
          key: item.key,
          productId: item.productId,
          sku: item.sku,
          quantity: Number(item.quantity) || 1,
          name: item.name,
          price: item.price,
          image: item.image,
          storeId: item.storeId,
          storeCode: item.storeCode,
        }));
        this.cartMeta = {
          ...this.cartMeta,
          guestSyncPending: true,
        };
        this.persistCartState();
        return null;
      }
    },
  },
});
