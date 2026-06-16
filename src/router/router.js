import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "rdep-ecom-sdk";
import LoginForm from "../components/LoginForm.vue";
import NewRegister from "../components/NewRegister.vue";
import IndexView from "../components/pages/IndexView.vue";
import ShopView from "../components/pages/ShopView.vue";
import ProductDetailView from "../components/pages/ProductDetailView.vue";
import CartView from "../components/pages/CartView.vue";
import PlaceOrderView from "../components/pages/PlaceOrderView.vue";
import PaymentOptionsView from "../components/pages/PaymentOptionsView.vue";
import PrivacyPolicyView from "../components/footer-policies/PrivacyPolicyView.vue";
import TermsOfUseView from "../components/footer-policies/TermsOfUseView.vue";
import ReturnPolicyView from "../components/footer-policies/ReturnPolicyView.vue";
import RefundCancellationView from "../components/footer-policies/RefundCancellationView.vue";
import ShippingDeliveryView from "../components/footer-policies/ShippingDeliveryView.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginForm,
  },
  {
    path: "/register",
    name: "register",
    component: NewRegister,
  },
  { path: "/profile", name: "profile", component: () => import("../components/pages/ProfileView.vue") },
  { path: "/orders", name: "orders", component: () => import("../components/pages/OrdersView.vue") },
  {
    path: "/",
    name: "home",
    component: IndexView,
  },
  {
    path: "/shop",
    name: "shop",
    component: ShopView,
  },
  {
    path: "/shop/product/:productId",
    name: "product-detail",
    component: ProductDetailView,
  },
  {
    path: "/cart",
    name: "cart",
    component: CartView,
  },
  {
    path: "/place-order",
    name: "place-order",
    component: PlaceOrderView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/payment-options",
    name: "payment-options",
    component: PaymentOptionsView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: PrivacyPolicyView,
  },
  {
    path: "/terms-of-use",
    name: "terms-of-use",
    component: TermsOfUseView,
  },
  {
    path: "/return-policy",
    name: "return-policy",
    component: ReturnPolicyView,
  },
  {
    path: "/refund-and-cancellation-policy",
    name: "refund-and-cancellation-policy",
    component: RefundCancellationView,
  },
  {
    path: "/shipping-and-delivery-policy",
    name: "shipping-and-delivery-policy",
    component: ShippingDeliveryView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
      behavior: "auto",
    };
  },
});

function hasAuthToken() {
  const sdkToken = String(getToken() || "").trim();
  if (sdkToken) {
    return true;
  }

  const savedAuthRaw = window.localStorage.getItem("auth.currentUser");
  if (savedAuthRaw) {
    try {
      const savedAuth = JSON.parse(savedAuthRaw);
      if (String(savedAuth?.token || "").trim()) return true;
    } catch (error) {
      // ignore
    }
  }

  // Demo login fallback — set by useDemoStore after registration or login
  try {
  const sessionRaw = window.localStorage.getItem("demo.session");
  const sessionKey = sessionRaw ? JSON.parse(sessionRaw) : null;
  if (sessionKey) {
    const accountsRaw = window.localStorage.getItem("demo.accounts");
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
    if (accounts && accounts[sessionKey]) return true;
  }
} catch (error) {
  // ignore
}

  return false;
}

router.beforeEach((to) => {
  if (to.meta?.requiresAuth && !hasAuthToken()) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  return true;
});

export default router;
