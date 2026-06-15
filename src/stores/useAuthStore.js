import { defineStore } from "pinia";
import router from "../router/router.js";
import axios from "axios";
import { getToken, login, logout } from "rdep-ecom-sdk";
import { useAppStore } from "./useAppStore.js";
import { useCartStore } from "./useCartStore.js";

const disconnect = () => {};

const CURRENT_USER = "auth.currentUser";
const initialState = getSavedState(CURRENT_USER);

setDefaultAuthHeaders(initialState);

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: initialState,
    loginResponse: null,
    logoutResponse: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.auth,
  },

  actions: {
    getUser() {
      return getSavedState(CURRENT_USER);
    },

    async LogIn(authDetails) {
      const appStore = useAppStore();
      if (!appStore.baseUrl) {
        appStore.initializeDomainConfig();
      }

      const domainName = appStore.domainName;

      try {
        const response = await login({
          username: authDetails.username,
          password: authDetails.password,
          domainName,
        });

        this.loginResponse = response || null;

        if (response?.statusCode === "200") {
          const token = getToken() || "";
          this.auth = {
            ...response,
            token,
          };

          if (!this.auth.landingPage) {
            this.auth.landingPage = "/";
          }

          if (this.auth.token) {
            localStorage.setItem(this.auth.token, JSON.stringify([]));
          }
          saveState(CURRENT_USER, this.auth);
          setDefaultAuthHeaders(this.auth);

          // If user added items as guest, push them to server cart on login.
          const cartStore = useCartStore();
          await cartStore.syncGuestCartAfterLogin();

          return response;
        }

        if (response?.statusCode === "400" && response?.twoFaEnabled) {
          return response;
        }

        throw new Error(response?.statusMessage || "Login failed");
      } catch (error) {
        throw new Error(
          error?.response?.data?.statusMessage ||
            error.message ||
            "Login failed",
        );
      }
    },

    logoutOntokenExpired() {
      this.logOut();
    },

    async logOut() {
      const token = this.auth?.token;
      disconnect(token);

      try {
        await logout();
        this.logoutResponse = {
          statusCode: "200",
          status: "success",
          statusMessage: "Logout successful",
        };
      } catch (error) {
        this.logoutResponse = {
          statusCode: "500",
          status: "error",
          statusMessage:
            error?.response?.data?.statusMessage ||
            error.message ||
            "Logout failed",
        };
      }

      this.clearAuthState();
      sessionStorage.removeItem("julien");
      localStorage.removeItem("modalActive");
      return this.logoutResponse;
    },

    // resetPassword({ username, tenantSubDomain } = {}) {
    //   return axios
    //     .post("/auth-service/noauth/password/setNewPassword/generateOtp", {
    //       username,
    //       tenantSubDomain,
    //     })
    //     .then((response) => response.data);
    // },

    clearAuthState() {
      setDefaultAuthHeaders(null);
      this.auth = null;
      saveState(CURRENT_USER, null);
      window.history.replaceState({}, "", "/");
      router.replace("/").catch(() => {});
    },
  },
});

function setDefaultAuthHeaders(currentUser) {
  const token = currentUser?.token || "";
  axios.defaults.headers.common.Authorization = token
    ? token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`
    : "";
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key)) || null;
}
