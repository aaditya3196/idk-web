<template>
  <footer class="footer-wrapper">
    <div class="footer-content">
      <div class="footer-brand">
        <img
          src="../assets/images/IK Final Logo.png"
          alt="IndiKonnect Logo"
          class="footer-logo"
        />
        <p>Connecting India through opportunity and excellence.</p>
      </div>

      <nav class="footer-nav">
        <div class="nav-column">
          <h5>CORE</h5>
          <router-link to="/">Home</router-link>
          <router-link to="/shop">Shop</router-link>
          <router-link to="/support">Support</router-link>
        </div>

        <div class="nav-column">
          <h5>POLICIES</h5>
          <router-link to="/privacy-policy">Privacy Policy</router-link>
          <router-link to="/terms-of-use">Terms of Use</router-link>
          <router-link to="/return-policy">Return Policy</router-link>
          <router-link to="/refund-and-cancellation-policy"
            >Refund & Cancellation</router-link
          >
          <router-link to="/shipping-and-delivery-policy"
            >Shipping & Delivery</router-link
          >
        </div>
      </nav>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 IndiKonnect. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  background-color: #003da5; /* Official Cobalt Brand Color */
  color: #ffffff;
  padding: 40px 0px 20px;
  width: 100%;
}

.footer-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 180px; /* Large gap for desktop separation */
  align-items: flex-start;
}

.footer-brand {
  width: 280px;
  flex-shrink: 0;
}

.footer-logo {
  width: 120px;
  margin-bottom: 20px;
  display: block;
}

.footer-brand p {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.8;
}

.footer-nav {
  display: flex;
  gap: 100px; /* Wide gap between CORE and POLICIES */
  flex-wrap: wrap;
}

.nav-column h5 {
  color: #ffc72c; /* Brand Accent */
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.nav-column a {
  display: block;

  color: #ffffff;

  text-decoration: none;

  font-size: 14px;

  margin-bottom: 12px;

  transition: opacity 0.2s;
}

.nav-column a:hover {
  opacity: 0.7;
}

.footer-bottom {
  max-width: 1100px;

  margin: 60px auto 0;

  padding-top: 20px;

  border-top: 1px solid rgba(255, 255, 255, 0.2);

  text-align: center;

  font-size: 12px;

  opacity: 0.6;
}

/* Responsive Logic */

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    margin: 10px 60px;
    gap: 40px;

    max-width: 100%;
  }

  .footer-nav {
    display: flex;

    flex-direction: row; /* Keeps columns side-by-side on mobile */

    gap: 40px;

    justify-content: flex-start;
  }
}
</style>
