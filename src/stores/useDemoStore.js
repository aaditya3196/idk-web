import { defineStore } from "pinia";

const DEMO_USER_KEY = "demo.user";
const DEMO_ORDERS_KEY = "demo.orders";

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const useDemoStore = defineStore("demo", {
  state: () => ({
    user: load(DEMO_USER_KEY) || null,
    orders: load(DEMO_ORDERS_KEY) || [],
    isLoggedIn: Boolean(load(DEMO_USER_KEY)),
  }),

  getters: {
    profile: (state) => state.user,
    allOrders: (state) => state.orders,
  },

  actions: {
    // Called after distributor wizard completes
    registerDistributor(payload) {
      const user = {
        role: "distributor",
        baId: payload.baId,
        fullName: payload.fullName,
        mobile: payload.mobile,
        email: payload.email || "",
        dob: payload.dob || "",
        password: payload.password, // stored for demo login matching
        referrerId: payload.referrerId || "",
        // KYC
        aadhaar: payload.aadhaar || "",
        aadhaarVerified: payload.aadhaarVerified || false,
        pan: payload.pan || "",
        panVerified: payload.panVerified || false,
        // Address from Aadhaar
        address: payload.saveAsBilling ? payload.aadhaarAddress : "",
        // Bank
        bankDetails: payload.bankDetails || null,
        bankPending: payload.bankPending || false,
        // Meta
        registeredAt: new Date().toISOString(),
      };
      this.user = user;
      this.isLoggedIn = true;
      save(DEMO_USER_KEY, user);
    },

    // Called after customer registration
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
      this.user = user;
      this.isLoggedIn = true;
      save(DEMO_USER_KEY, user);
    },

    // Demo login: match mobile/email + password against stored user
    login(identifier, password) {
      const stored = load(DEMO_USER_KEY);
      if (!stored) return { success: false, message: "No account found. Please register first." };
      const identifierMatch =
        stored.mobile === identifier ||
        stored.email === identifier ||
        stored.fullName === identifier;
      if (!identifierMatch) return { success: false, message: "Account not found." };
      if (stored.password !== password) return { success: false, message: "Incorrect password." };
      this.user = stored;
      this.isLoggedIn = true;
      return { success: true, message: "Login successful!" };
    },

    logout() {
      this.isLoggedIn = false;
      // Don't clear user data — keep profile accessible after re-login
    },

    // Called from PaymentOptionsView after successful payment
    saveOrder(orderPayload) {
      const orders = load(DEMO_ORDERS_KEY) || [];
      orders.unshift({
        ...orderPayload,
        placedAt: new Date().toISOString(),
      });
      this.orders = orders;
      save(DEMO_ORDERS_KEY, orders);
    },

    updateProfile(updates) {
      if (!this.user) return;
      this.user = { ...this.user, ...updates };
      save(DEMO_USER_KEY, this.user);
    },

    clearAll() {
      this.user = null;
      this.isLoggedIn = false;
      this.orders = [];
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(DEMO_ORDERS_KEY);
    },
  },
});