import { defineStore } from "pinia";
import axios from "axios";
import { initClient } from "rdep-ecom-sdk";

export const useAppStore = defineStore("app", {
  state: () => ({
    domainName: "",
    baseUrl: "",
    tenantApiBaseUrl: "",
    receiptUrl: "",
    tenantSubDomain: "",
    tenantDetails: null,
  }),

  actions: {
    initializeDomainConfig() {
      this.domainName =
        process.env.VUE_APP_DOMAIN_NAME || window.location.host || "";
      this.baseUrl =
        process.env.VUE_APP_BASE_URL ||
        `${window.location.protocol}//${window.location.host}`;
      this.tenantApiBaseUrl =
        process.env.VUE_APP_TENANT_API_BASE_URL || this.baseUrl;
      this.receiptUrl = process.env.VUE_APP_RECEIPT_URL || this.baseUrl;
      this.tenantSubDomain = this.getTenantSubDomain();

      axios.defaults.baseURL = this.baseUrl;
      initClient(this.tenantApiBaseUrl);
    },

    setTenantDetails(tenantDetails) {
      this.tenantDetails = tenantDetails || null;
    },

    getTenantSubDomain() {
      const host = window.location.host;
      const parts = host.split(".");
      const domainLength = 3;

      return parts.length >= domainLength && parts[0] !== "www"
        ? parts[0]
        : process.env.VUE_APP_SUB_DOMAIN || "";
    },
  },
});
