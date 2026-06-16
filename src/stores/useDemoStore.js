import { defineStore } from "pinia";

const DEMO_ACCOUNTS_KEY = "demo.accounts"; // { [accountKey]: { user, orders } }
const DEMO_SESSION_KEY = "demo.session";   // currently logged-in accountKey, or null

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function loadAccounts() {
  return load(DEMO_ACCOUNTS_KEY) || {};
}

function saveAccounts(accounts) {
  save(DEMO_ACCOUNTS_KEY, accounts);
}

function parseAadhaarAddress(raw) {
  const parts = String(raw || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return null;
  const last = parts[parts.length - 1] || "";
  const stateMatch = last.match(/^(.*?)-\s*(\d{4,6})$/);
  const state = stateMatch ? stateMatch[1].trim() : last;
  const pincode = stateMatch ? stateMatch[2].trim() : "";
  const city = parts.length >= 2 ? parts[parts.length - 2] : "";
  const addressLine = parts.slice(0, Math.max(parts.length - 2, 1)).join(", ");
  return { addressLine, city, state, pincode };
}

function saveAddressFromAadhaar(accountKey, user, rawAddress) {
  const parsed = parseAadhaarAddress(rawAddress);
  if (!parsed) return;
  const addressesKey = `demo.addresses.${accountKey}`;
  const existing = load(addressesKey) || [];
  const newAddress = {
    id: 1,
    addressType: "Home",
    label: "Home",
    tag: "Home",
    fullName: user.fullName,
    phone: user.mobile,
    addressLine: parsed.addressLine,
    addressLine1: parsed.addressLine,
    addressLine2: "",
    addressLine3: "",
    city: parsed.city,
    district: parsed.city,
    state: parsed.state,
    country: "India",
    pincode: parsed.pincode,
    landmark: "",
    locationUrl: "",
    isDefault: existing.length === 0,
    fromApi: false,
  };
  save(addressesKey, [...existing, newAddress]);
}

// Exported so other views (e.g. PlaceOrderView) read/write the SAME
// per-account address bucket as whoever is currently logged in.
export function getDemoAddressesStorageKey() {
  const sessionKey = load(DEMO_SESSION_KEY);
  return sessionKey ? `demo.addresses.${sessionKey}` : "demo.addresses.guest";
}

export const useDemoStore = defineStore("demo", {
  state: () => {
    const sessionKey = load(DEMO_SESSION_KEY);
    const accounts = loadAccounts();
    const account = sessionKey ? accounts[sessionKey] : null;
    return {
      user: account?.user || null,
      orders: account?.orders || [],
      isLoggedIn: Boolean(sessionKey && account),
    };
  },

  getters: {
    profile: (state) => state.user,
    allOrders: (state) => state.orders,
  },

  actions: {
    registerDistributor(payload) {
      const user = {
        role: "distributor",
        baId: payload.baId,
        fullName: payload.fullName,
        mobile: payload.mobile,
        email: payload.email || "",
        dob: payload.dob || "",
        password: payload.password,
        referrerId: payload.referrerId || "",
        aadhaar: payload.aadhaar || "",
        aadhaarVerified: payload.aadhaarVerified || false,
        pan: payload.pan || "",
        panVerified: payload.panVerified || false,
        address: payload.saveAsBilling ? payload.aadhaarAddress : "",
        bankDetails: payload.bankDetails || null,
        bankPending: payload.bankPending || false,
        registeredAt: new Date().toISOString(),
      };

      const key = normalizeKey(user.mobile || user.email || user.fullName);
      const accounts = loadAccounts();
      accounts[key] = { user, orders: accounts[key]?.orders || [] };
      saveAccounts(accounts);
      save(DEMO_SESSION_KEY, key);

      this.user = user;
      this.orders = accounts[key].orders;
      this.isLoggedIn = true;

      if (payload.saveAsBilling && payload.aadhaarAddress) {
        saveAddressFromAadhaar(key, user, payload.aadhaarAddress);
      }
    },

    registerCustomer(payload) {
      const user = {
        role: "customer",
        fullName: `${payload.firstName} ${payload.lastName}`,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        mobile: payload.mobileNumber,
        dob: payload.dob,
        password: payload.password,
        registeredAt: new Date().toISOString(),
      };

      const key = normalizeKey(user.mobile || user.email || user.fullName);
      const accounts = loadAccounts();
      accounts[key] = { user, orders: accounts[key]?.orders || [] };
      saveAccounts(accounts);
      save(DEMO_SESSION_KEY, key);

      this.user = user;
      this.orders = accounts[key].orders;
      this.isLoggedIn = true;
    },

    login(identifier, password) {
      const accounts = loadAccounts();
      const normalizedIdentifier = normalizeKey(identifier);
      const foundKey = Object.keys(accounts).find((key) => {
        const u = accounts[key]?.user;
        if (!u) return false;
        return (
          normalizeKey(u.mobile) === normalizedIdentifier ||
          normalizeKey(u.email) === normalizedIdentifier ||
          normalizeKey(u.fullName) === normalizedIdentifier ||
          key === normalizedIdentifier
        );
      });

      if (!foundKey) {
        return { success: false, message: "No account found. Please register first." };
      }
      const account = accounts[foundKey];
      if (account.user?.password !== password) {
        return { success: false, message: "Incorrect password." };
      }

      this.user = account.user;
      this.orders = account.orders || [];
      this.isLoggedIn = true;
      save(DEMO_SESSION_KEY, foundKey);

      return { success: true, message: "Login successful!" };
    },

    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.orders = [];
      save(DEMO_SESSION_KEY, null);
    },

    saveOrder(orderPayload) {
      const key = load(DEMO_SESSION_KEY);
      if (!key) return;
      const accounts = loadAccounts();
      const account = accounts[key] || { user: this.user, orders: [] };
      account.orders = [
        { ...orderPayload, placedAt: new Date().toISOString() },
        ...(account.orders || []),
      ];
      accounts[key] = account;
      saveAccounts(accounts);
      this.orders = account.orders;
    },

    updateProfile(updates) {
      if (!this.user) return;
      this.user = { ...this.user, ...updates };
      const key = load(DEMO_SESSION_KEY);
      if (key) {
        const accounts = loadAccounts();
        if (accounts[key]) {
          accounts[key].user = this.user;
          saveAccounts(accounts);
        }
      }
    },

    clearAll() {
      this.user = null;
      this.isLoggedIn = false;
      this.orders = [];
      localStorage.removeItem(DEMO_ACCOUNTS_KEY);
      localStorage.removeItem(DEMO_SESSION_KEY);
    },
  },
});