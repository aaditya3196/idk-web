<template>
  <header class="app-navbar-header">
    <div class="main-header">
      <div class="container header-grid-layout">
        <div class="left-section">
          <i
            class="fa fa-bars menu-icon hamburger-only-mobile"
            @click="toggleMobileMenu"
          ></i>

          <a href="/">
            <img
              src="../assets/images/IK Final Logo.png"
              alt="logo"
              class="logo"
            />
          </a>
        </div>

        <div
          class="mobile-menu-overlay"
          :class="{ open: isMobileMenuOpen }"
          @click="closeMobileMenu"
        ></div>

        <nav class="nav-links" :class="{ 'mobile-open': isMobileMenuOpen }">
          <a href="/" class="nav-item" @click="closeMobileMenu">Home</a>

          <div class="mega-menu-container" :class="{ open: isShopMenuOpen }">
            <a href="#" class="nav-item-shop" @click.prevent="toggleShopMenu"
              >Shop <i class="ri-arrow-down-s-line chevron-icon"></i
            ></a>

            <div class="mega-dropdown-panel">
              <div class="mega-top-bar">
                <span class="mega-panel-title">Explore Categories</span>
                <router-link
                  to="/shop"
                  class="shop-all-btn"
                  @click="closeShopAndMobileMenus"
                >
                  <span>Shop All Products</span>
                  <div class="btn-arrow-circle">
                    <i class="ri-arrow-right-line"></i>
                  </div>
                </router-link>
              </div>

              <div class="mega-columns-grid">
                <div v-if="isLoadingCategories" class="mega-link-column">
                  <div class="column-header-wrapper">
                    <i class="fa-solid fa-spinner category-lucid-icon"></i>
                    <span class="column-header-link"
                      >Loading categories...</span
                    >
                  </div>
                </div>

                <div
                  v-else-if="!shopCategories.length"
                  class="mega-link-column"
                >
                  <div class="column-header-wrapper">
                    <i class="fa-solid fa-circle-info category-lucid-icon"></i>
                    <span class="column-header-link">No categories found</span>
                  </div>
                </div>

                <template v-else>
                  <div
                    v-for="(category, index) in shopCategories"
                    :key="category.id || index"
                    class="mega-link-column"
                  >
                    <div class="column-header-wrapper">
                      <i
                        :class="`${getCategoryIconClass(
                          index,
                        )} category-lucid-icon`"
                      ></i>
                      <router-link
                        :to="{
                          path: '/shop',
                          query: { categoryId: category.id },
                        }"
                        class="column-header-link"
                        @click="closeShopAndMobileMenus"
                      >
                        <span>{{ category.name }}</span>
                        <span class="category-count-badge">
                          {{ getCategoryTotalItemCount(category.id) }}
                        </span>
                      </router-link>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <a
            v-if="!isAuthenticated"
            href="/login"
            class="nav-item auth-nav-item"
            @click="closeMobileMenu"
            >Login/Sign Up</a
          >
        </nav>

        <div class="header-icons">
          <router-link
  v-if="!isAuthenticated && !isLoginRoute"
  :to="{ name: 'login' }"
  class="mobile-auth-link"
  @click="closeMobileMenu"
>
  Login/Join Us
</router-link>

          <div v-if="isAuthenticated && !isLoginRoute" class="account-menu">
            <button
              type="button"
              class="account-trigger"
              @click.stop="toggleAccountMenu"
            >
              <i class="ri-user-line"></i>
            </button>

           <div class="account-dropdown" :class="{ open: isAccountMenuOpen }">

  <router-link
    to="/profile"
    class="dropdown-item"
    @click="closeAccountMenu"
  >
    <i class="ri-user-settings-line"></i>
    <span>My Profile</span>
  </router-link>

  <router-link
    to="/orders"
    class="dropdown-item"
    @click="closeAccountMenu"
  >
    <i class="ri-file-list-3-line"></i>
    <span>My Orders</span>
  </router-link>

  <div class="dropdown-divider"></div>

  <button
    type="button"
    class="dropdown-item logout-btn"
    @click="handleLogout"
  >
    <i class="ri-logout-box-r-line"></i>
    <span>Logout</span>
  </button>

</div>
          </div>

          <router-link
            :to="{ name: 'cart' }"
            class="cart"
            @click="handleCartClick"
          >
            <i class="ri-shopping-basket-fill"></i>
            <span>{{ cartCount }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useCartStore } from "../stores/useCartStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { categories, allProducts } from "../data/products.js";
import { useDemoStore } from "../stores/useDemoStore.js";

export default {
  name: "AppNavbar",
  computed: {
    cartCount() {
      return this.cartStore?.totalCount || 0;
    },
    isAuthenticated() {
  return this.authStore?.isAuthenticated || this.demoStore?.isLoggedIn || false;
},
    isLoginRoute() {
      return this.$route?.name === "login" || this.$route?.name === "register";
    },
  },
  data() {
    return {
      cartStore: useCartStore(),
      authStore: useAuthStore(),
      demoStore: null,
      isAccountMenuOpen: false,
      isShopMenuOpen: false,
      isMobileMenuOpen: false,
      isLoadingCategories: false,
      shopCategories: [],
    };
  },
  methods: {
    fetchShopCategories() {
      this.isLoadingCategories = true;
      try {
        // Pull directly from local products data structure
        this.shopCategories = categories || [];
      } catch (error) {
        console.error("Failed to fetch navbar categories", error);
        this.shopCategories = [];
      } finally {
        this.isLoadingCategories = false;
      }
    },
    getCategoryTotalItemCount(catId) {
      if (!allProducts) return 0;
      return allProducts.filter(p => p.category === catId).length;
    },
    getCategoryIconClass(index) {
      const icons = [
        "ri-timer-line",
        "ri-diamond-ring-line",
        "ri-restaurant-line",
      ];
      return icons[index % icons.length] || "fa-solid fa-tag";
    },
    toggleShopMenu() {
      this.isShopMenuOpen = !this.isShopMenuOpen;
    },
    closeShopMenu() {
      this.isShopMenuOpen = false;
    },
    closeShopAndMobileMenus() {
      this.isShopMenuOpen = false;
      this.isMobileMenuOpen = false;
    },
    toggleAccountMenu() {
      this.isAccountMenuOpen = !this.isAccountMenuOpen;
    },
    closeAccountMenu() {
      this.isAccountMenuOpen = false;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    async handleCartClick() {
      try {
        await this.cartStore?.refreshCartData();
      } catch (error) {
        console.warn("Cart refresh failed", error);
      }
    },
    handleOutsideClick(event) {
      const accountMenu = this.$el.querySelector(".account-menu");
      const shopMenu = this.$el.querySelector(".mega-menu-container");

      if (accountMenu && !accountMenu.contains(event.target)) {
        this.closeAccountMenu();
      }

      if (shopMenu && !shopMenu.contains(event.target)) {
        this.closeShopMenu();
      }

      const navLinks = this.$el.querySelector(".nav-links");
      const mobileMenuIcon = this.$el.querySelector(".hamburger-only-mobile");
      const clickedInsideMobileNav = navLinks?.contains(event.target);
      const clickedMenuIcon = mobileMenuIcon?.contains(event.target);

      if (
        this.isMobileMenuOpen &&
        !clickedInsideMobileNav &&
        !clickedMenuIcon
      ) {
        this.closeMobileMenu();
      }
    },
    async handleLogout() {
  await this.authStore.logOut();
  if (this.demoStore) {
    this.demoStore.logout();
  }
  this.closeAccountMenu();
  this.$router.push({ name: 'home' });
},
  },
  mounted() {
    this.cartStore?.initializeCount();
    document.addEventListener("click", this.handleOutsideClick);
    this.fetchShopCategories();
    this.demoStore = useDemoStore();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css");

.app-navbar-header {
  --cobalt: #003da5;
  --gold: #ffc72c;
  --charcoal: #333f48;
  --pure-white: #ffffff;
  --soft-border: rgba(0, 0, 0, 0.06);
  --light-gray-bg: #f8f9fb;

  font-family: "Outfit", sans-serif;
  width: 100%;
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 4px 0;
}

.container {
  width: 90%;
  margin: auto;
  font-family: "Outfit", sans-serif;
}

.main-header {
  padding: 18px 0;
  background: var(--pure-white);
  border-bottom: 1px solid var(--soft-border);
}

.header-grid-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 40px;
}

.menu-icon.hamburger-only-mobile {
  display: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--charcoal);
}

.logo {
  height: 52px;
  display: block;
}

.nav-links {
  display: flex;
  gap: 35px;
  align-items: baseline;
  margin-left: auto;
  padding-right: 45px;
}

.nav-item,
.nav-item-shop {
  position: relative;
  text-decoration: none;
  color: var(--cobalt);
  font-family: "Outfit", sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  padding-bottom: 6px;
  transition: color 0.3s ease;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
}

.nav-item-shop {
  padding-right: 16px;
}

.nav-item::after,
.nav-item-shop::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: var(--cobalt);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.nav-item:hover::after,
.mega-menu-container:hover .nav-item-shop::after {
  transform: scaleX(1);
}

.chevron-icon {
  font-size: 14px;
  position: absolute;
  right: 0;
  top: 2px;
  transition: transform 0.3s ease;
}

.mega-menu-container:hover .chevron-icon {
  transform: rotate(180deg);
}

.mega-menu-container {
  position: static;
}

.mega-dropdown-panel {
  position: absolute;
  top: calc(100% + 18px);
  left: 0;
  right: 0;
  width: 100%;
  background: var(--pure-white);
  border-radius: 12px;
  box-shadow: 0 20px 45px rgba(10, 34, 64, 0.12);
  border: 1px solid var(--soft-border);
  padding: 30px 40px;
  box-sizing: border-box;

  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0.25s;
  z-index: 999;
}

.mega-menu-container:hover .mega-dropdown-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mega-menu-container.open .mega-dropdown-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mega-menu-container.open .chevron-icon {
  transform: rotate(180deg);
}

.mega-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 61, 165, 0.06);
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.mega-panel-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--charcoal);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.5;
}

.shop-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: transparent;
  color: var(--cobalt) !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 8px 18px;
  border: 1px solid rgba(0, 61, 165, 0.15);
  border-radius: 30px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.shop-all-btn span {
  transition: color 0.3s ease;
}

.btn-arrow-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: rgba(0, 61, 165, 0.05);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-arrow-circle i {
  font-size: 11px !important;
  color: var(--cobalt) !important;
  transition: transform 0.3s ease;
}

.shop-all-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: var(--cobalt);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}

.shop-all-btn:hover::before {
  width: 100%;
}

.shop-all-btn:hover {
  border-color: var(--cobalt);
  box-shadow: 0 4px 12px rgba(0, 61, 165, 0.15);
}

.shop-all-btn:hover span {
  color: var(--pure-white);
}

.shop-all-btn:hover .btn-arrow-circle {
  background: rgba(255, 255, 255, 0.2);
}

.shop-all-btn:hover .btn-arrow-circle i {
  color: var(--pure-white) !important;
  transform: translateX(2px);
}

.mega-columns-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.mega-link-column {
  display: flex;
  flex-direction: column;
}

.column-header-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 14px;
  position: relative;
  width: fit-content;
  padding-bottom: 6px;
  height: 24px;
}

.category-lucid-icon {
  font-size: 15px !important;
  color: var(--cobalt);
  opacity: 0.9;
  transition: transform 0.3s ease;
  line-height: 1;
}

.column-header-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--charcoal);
  text-decoration: none;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
  line-height: 1;
}

.category-count-badge {
  background: rgba(0, 61, 165, 0.08);
  border: 1px solid rgba(0, 61, 165, 0.12);
  color: var(--cobalt);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  line-height: 1;
}

.column-header-wrapper::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.mega-link-column:hover .column-header-wrapper::after {
  transform: scaleX(1);
}

.mega-link-column:hover .category-lucid-icon {
  transform: scale(1.1) translateY(-1px);
}

.mega-link-column:hover .column-header-link {
  color: var(--cobalt);
}

.header-icons {
  display: flex;
  gap: 25px;
  align-items: center;
}

.header-icons i {
  font-size: 22px;
  color: var(--charcoal);
}

.cart {
  position: relative;
  cursor: pointer;
}

.mobile-auth-link {
  display: none;
  text-decoration: none;
}

.account-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.account-trigger {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.account-trigger i {
  font-size: 22px;
  color: var(--charcoal);
  transition: all 0.3s ease;
}

.account-trigger:hover i {
  color: var(--cobalt);
}

.account-dropdown {
  position: absolute;
  top: calc(100% + 15px);
  right: -10px;
  width: 220px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.25s ease;
  z-index: 9999;
}

.account-dropdown::before {
  content: "";
  position: absolute;
  top: -7px;
  right: 20px;
  width: 14px;
  height: 14px;
  background: #fff;
  transform: rotate(45deg);
  border-left: 1px solid #eee;
  border-top: 1px solid #eee;
}

.account-dropdown.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: transparent;
  text-decoration: none;
  color: var(--charcoal);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.dropdown-item:hover {
  background: var(--light-gray-bg);
  color: var(--cobalt);
  padding-left: 22px;
}

.dropdown-item i {
  font-size: 18px;
  color: inherit;
}

.cart span {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #f8b60c;
  color: var(--cobalt);
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1024px) {
  .mega-columns-grid {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 34, 64, 0.42);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.25s ease, visibility 0.25s ease;
    z-index: 1100;
  }

  .mobile-menu-overlay.open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .nav-links {
    display: flex !important;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(86vw, 340px);
    z-index: 1200;
    background: var(--pure-white);
    box-shadow: 22px 0 40px rgba(10, 34, 64, 0.18);
    padding: 24px 18px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 16px;
    margin-left: 0;
    overflow-y: auto;
    transform: translateX(-105%);
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .nav-links.mobile-open {
    transform: translateX(0);
  }

  .auth-nav-item {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 61, 165, 0.2);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    letter-spacing: 0.5px;
    background: rgba(0, 61, 165, 0.03);
  }

  .auth-nav-item::after {
    display: none;
  }

  .mega-menu-container {
    width: 100%;
  }

  .mega-dropdown-panel {
    position: static;
    width: 100%;
    margin-top: 10px;
    padding: 14px;
    box-shadow: none;
    border-radius: 10px;
    border: 1px solid var(--soft-border);
  }

  .mega-top-bar {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  .mega-columns-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .shop-all-btn {
    width: 100%;
    justify-content: center;
  }

  .menu-icon.hamburger-only-mobile {
    display: block !important;
  }

  .mobile-auth-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 61, 165, 0.18);
    border-radius: 999px;
    padding: 6px 12px;
    color: var(--cobalt);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    background: #ffffff;
  }
  /* Add this specific rule to hide the duplicate desktop link inside the mobile drawer */
  .nav-links .auth-nav-item {
    display: none !important;
  }
}
</style>