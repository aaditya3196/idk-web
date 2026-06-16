<template>
  <div>
    <AppNavbar />
    <section class="login-section">
      <div class="container">
        <div class="row">
          <div class="col">
            <h2 class="section-title">LOGIN</h2>
            <div class="card-box login-box">
              <form @submit.prevent="handleSubmit">
                <div class="form-group">
                  <label>Email/Mobile No.</label>
                  <input
                    v-model.trim="username"
                    type="text"
                    placeholder="Enter email or mobile number"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <div class="password-wrapper">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      class="password-visibility-btn"
                      :aria-label="
                        showPassword ? 'Hide password' : 'Show password'
                      "
                      @click="togglePasswordVisibility"
                    >
                      <i
                        style="font-size: 20px"
                        :class="
                          showPassword ? 'ri-eye-off-line ' : 'ri-eye-line'
                        "
                      ></i>
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  class="login-btn"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? "SIGNING IN..." : "LOGIN" }}
                </button>
              </form>
              <p v-if="errorMessage" class="error">
                {{ errorMessage }}
              </p>
              <p v-if="successMessage" class="success">
                {{ successMessage }}
              </p>
            </div>
          </div>
          <div class="col">
            <h2 class="section-title">NEW CUSTOMER</h2>
            <div class="card-box register-box">
              <h4>CREATE AN ACCOUNT</h4>
              <p class="register-text">
                Sign up for a free account at our store. Registration is quick
                and easy. It allows you to order from our shop.
              </p>
              <div class="hero-buttons">
                <button @click="openAccountTypeSwitch" class="primary-btn">
                  CREATE AN ACCOUNT
                </button>
              </div>
              <div v-if="showAccountTypeSwitch" class="account-switch-wrap">
                <p class="switch-label">Choose account type</p>
                <div class="switch-buttons">
                  <button
                    type="button"
                    class="switch-btn"
                    @click="redirectToRegister('distributor')"
                  >
                    Distributor
                  </button>
                  <button
                    type="button"
                    class="switch-btn"
                    @click="redirectToRegister('customer')"
                  >
                    Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import AppNavbar from "./AppNavbar.vue";
import Footer from "./FooterView.vue";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useAppStore } from "../stores/useAppStore.js";
import { useDemoStore } from "../stores/useDemoStore.js";

export default {
  name: "LoginForm",
  components: {
    AppNavbar,
    Footer,
  },
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      showAccountTypeSwitch: false,
      isSubmitting: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    appStore() {
      return useAppStore();
    },
  },
  methods: {
    openAccountTypeSwitch() {
      this.showAccountTypeSwitch = true;
    },

    redirectToRegister(role = "customer") {
      this.$router.push({
        name: "register",
        query: {
          role,
        },
      });
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    async handleSubmit() {
  this.errorMessage = "";
  this.successMessage = "";
  this.isSubmitting = true;

  const demoStore = useDemoStore();

  // Try real API first
  try {
    const result = await this.authStore.LogIn({
      username: this.username,
      password: this.password,
    });
    if (result?.statusCode === "200") {
      // Also sync demo store login state
      demoStore.login(this.username, this.password);
      this.successMessage = result?.statusMessage || "Login successful";
      const redirectPath = typeof this.$route?.query?.redirect === "string" ? this.$route.query.redirect : "";
      const isSafe = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
      this.$router.push(isSafe ? redirectPath : { name: "home" });
      return;
    }
  } catch {
    // API failed — try demo login
  }

  // Demo login fallback
  const demoResult = demoStore.login(this.username, this.password);
  if (demoResult.success) {
    this.successMessage = demoResult.message;
    const redirectPath = typeof this.$route?.query?.redirect === "string" ? this.$route.query.redirect : "";
    const isSafe = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    setTimeout(() => {
      this.$router.push(isSafe ? redirectPath : { name: "home" });
    }, 800);
  } else {
    this.errorMessage = demoResult.message;
  }

  this.isSubmitting = false;
},
    async handleLogout() {
      this.errorMessage = "";
      this.successMessage = "";

      const response = await this.authStore.logOut();
      this.successMessage = response?.statusMessage || "Logged out";
    },
  },
};
</script>

<style scoped>
.login-section {
  /* IndiKonnect Unified Brand Tokens */
  --cobalt: #003da5;
  --gold: #ffc72c;
  --charcoal: #333f48;
  --dark-blue: #0a2240;
  --pure-white: #ffffff;
  --light-gray-bg: #f9fafc;
  --soft-border: rgba(0, 61, 165, 0.08);
  padding: 20px 0;
  background: linear-gradient(
    180deg,
    var(--pure-white) 0%,
    var(--light-gray-bg) 100%
  );
  color: var(--charcoal);
  width: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;
  align-items: stretch;
}

.section-title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--cobalt); /* Anchored with Signature Cobalt Blue */
  margin-bottom: 28px;
  text-transform: uppercase;
}

.card-box {
  background: var(--pure-white);
  border: 1px solid var(--soft-border);
  border-radius: 20px;
  padding: 48px;
  min-height: 440px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(10, 34, 64, 0.02);
  position: relative;
}

/* Precise Top Identity Accents (No hover transitions to avoid element shifting) */
.card-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: 20px 20px 0 0;
}

.login-box::before {
  background-color: var(--cobalt);
}

.register-box::before {
  background-color: var(--gold);
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--dark-blue);
  letter-spacing: 0.2px;
}

input {
  width: 100%;
  height: 54px;
  padding: 0 20px;
  font-size: 15px;
  color: var(--charcoal);
  border: 1px solid rgba(10, 34, 64, 0.12);
  border-radius: 12px;
  background: var(--light-gray-bg);
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

input:focus {
  background: var(--pure-white);
  border-color: var(--cobalt);
  box-shadow: 0 0 0 4px rgba(0, 61, 165, 0.08);
}

.password-wrapper {
  position: relative;
}

.password-visibility-btn {
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  line-height: 1;
}

.password-wrapper i {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a94a6;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s ease;
}

.password-wrapper i:hover {
  color: var(--cobalt);
}

.login-btn {
  width: 100%;
  height: 54px;
  margin-top: 12px;
  background: linear-gradient(135deg, var(--gold) 0%, #f5b000 100%);
  color: var(--dark-blue);
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 199, 44, 0.2);
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(255, 199, 44, 0.28);
}

.login-btn:disabled {
  opacity: 0.6;
  background: #e2e8f0;
  color: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

.card-box h4 {
  font-size: 22px;
  font-weight: 700;
  color: var(--dark-blue);
  margin-bottom: 16px;
  margin-top: 4px;
}

.register-text {
  margin: 0 0 32px;
  color: var(--charcoal);
  opacity: 0.85;
  font-size: 15px;
  line-height: 1.65;
}

.hero-buttons {
  display: flex;
  justify-content: flex-start;
}

.primary-btn {
  background: linear-gradient(135deg, var(--gold) 0%, #f5b000 100%);
  color: var(--dark-blue);
  border: none;
  border-radius: 50px;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 199, 44, 0.2);
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(255, 199, 44, 0.28);
}

.account-switch-wrap {
  margin-top: 20px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(0, 61, 165, 0.16);
  background: rgba(0, 61, 165, 0.03);
}

.switch-label {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--dark-blue);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.switch-buttons {
  display: flex;
  gap: 12px;
}

.switch-btn {
  flex: 1;
  border: 1px solid rgba(0, 61, 165, 0.2);
  border-radius: 999px;
  height: 42px;
  background: var(--pure-white);
  color: var(--dark-blue);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-btn:hover {
  border-color: var(--cobalt);
  color: var(--cobalt);
  transform: translateY(-1px);
}

.error {
  color: #dc2626;
  background-color: #fef2f2;
  border-left: 3px solid #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
}

.success {
  color: #16a34a;
  background-color: #f0fdf4;
  border-left: 3px solid #16a34a;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* Responsive Rules */
@media (max-width: 991px) {
  .login-section {
    padding: 80px 0;
  }

  .row {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .card-box {
    min-height: auto;
    padding: 36px 24px;
  }
}

@media (max-width: 480px) {
  .login-section {
    padding: 60px 0;
  }
  .container {
    padding: 0 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .card-box {
    padding: 28px 20px;
    border-radius: 16px;
  }
  .primary-btn,
  .login-btn {
    width: 100%;
    text-align: center;
  }

  .switch-buttons {
    flex-direction: column;
  }
}

@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap%27");
</style>
