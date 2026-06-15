<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { checkTenant } from "rdep-ecom-sdk";
import { useAppStore } from "./stores/useAppStore.js";

const appStore = useAppStore();

function getTenantPayload(response) {
  if (!response) return null;
  if (response?.data?.data) return response.data.data;
  if (response?.data?.tenant) return response.data.tenant;
  if (response?.data) return response.data;
  return response;
}

function getTenantSubDomain(domainName) {
  const normalizedDomain =
    typeof domainName === "string" ? domainName.trim().toLowerCase() : "";

  if (!normalizedDomain) return null;

  const parts = normalizedDomain.split(".").filter(Boolean);
  if (parts.length >= 3 && parts[0] !== "www") {
    return parts[0];
  }

  return normalizedDomain;
}

onMounted(async () => {
  try {
    const domainName = appStore.domainName || window.location.host || "";
    const tenantSubDomain =
      getTenantSubDomain(domainName) || appStore.tenantSubDomain;

    if (!tenantSubDomain) {
      return;
    }

    const response = await checkTenant(tenantSubDomain);
    const tenantData = getTenantPayload(response);
    appStore.setTenantDetails(tenantData);
  } catch (error) {
    console.error("Failed to load tenant details", error);
  }
});
</script>

<style>
body {
  margin: 0;
  font-family: "Outfit", sans-serif;
}

* {
  font-family: inherit;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
}
</style>
