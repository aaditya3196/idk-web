<template>
  <AppNavbar />
  <div class="refund-page-root">
    <div class="hero-full-bleed-row">
      <section class="hero-section">
        <div class="hero-glow one"></div>
        <div class="hero-glow two"></div>

        <div class="hero-container reveal">
          <h1>Refund / Cancellation Policy</h1>

          <p class="hero-text">
            Learn about Indi Konnect's refund eligibility, cancellation
            conditions, and processing timelines for purchased products.
          </p>
        </div>
      </section>
    </div>

    <div class="content-full-bleed-row">
      <section class="content-section">
        <div class="content-wrapper reveal">
          <h2>Product Refund Policy</h2>

          <p class="refund-text">
            Distributors are hereby notified that all purchased products are
            subject to the company's 30-day product refund policy (money-back
            guarantee). The company shall be obliged to accept any marketable
            product sold to a Customer/Distributor within thirty (30) days from
            the date of invoice of the product, after withholding Tax Deducted
            at Source (TDS), Sales Incentive utilised, and other taxes if
            applicable, in accordance with its policies. The
            Customer/Distributor should raise a written request to the company
            for the product refund within 30 days from the date of invoice. No
            refund requests will be entertained after 30 days.
          </p>

          <p class="refund-text">
            Upon receipt and examination of the physical products, the final
            decision for a product refund rests with the company.
          </p>

          <p class="refund-text">
            The said policy is only applicable for the cancellation of the full
            purchase order and upon the return of physical products to the
            company. In case of Combo products purchase or one purchase order
            with multiple products, the distributor / customer must apply for
            refund conforming to all products of the said Combo set or purchase
            order. The company will not entertain a partial refund of selective
            products thereof. Subject to such products being in an unused state,
            accordingly the company will process the refund of the payment made
            by the distributor / customer.
          </p>

          <p class="bottom-text">
            If approved, the refund will be credited to the original method of
            payment within 30 days.
          </p>
        </div>
      </section>
    </div>
  </div>
  <FooterView />
</template>

<script setup>
import { onMounted } from "vue";
import AppNavbar from "../AppNavbar.vue";
import FooterView from "../FooterView.vue";

onMounted(() => {
  const body = document.body;
  if (body) {
    body.style.setProperty("margin", "0", "important");
    body.style.setProperty("padding", "0", "important");
    body.style.setProperty("max-width", "100%", "important");
  }

  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.08 },
  );
  revealElements.forEach((el) => observer.observe(el));
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.refund-page-root {
  width: 100vw !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  font-family: "Raleway", sans-serif;
  background: #ffffff;
  color: #2d3748;
  overflow-x: hidden;
}

.hero-full-bleed-row {
  width: 100% !important;
  background: #003da5 !important;
  display: block;
}

.hero-section {
  position: relative;
  width: 100% !important;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 30px 0 20px;
}

.hero-container {
  width: 100%;
  max-width: 1240px;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.hero-glow.one {
  width: 350px;
  height: 350px;
  background: rgba(255, 199, 44, 0.15);
  top: -100px;
  right: -50px;
}

.hero-glow.two {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.06);
  bottom: -100px;
  left: -50px;
}

.hero-container h1 {
  color: #ffc72c;
  font-size: 46px;
  line-height: 1.1;
  margin-bottom: 16px;
  font-weight: 800;
}

.hero-text {
  color: rgba(255, 255, 255, 0.88);
  font-size: 17px;
  line-height: 1.7;
  max-width: 720px;
  margin-bottom: 28px;
}

.content-full-bleed-row {
  width: 100% !important;
  background: #ffffff;
  display: block;
}

.content-section {
  width: 100% !important;
  padding: 55px 0 45px;
}

.content-wrapper {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.content-wrapper h2 {
  font-size: 22px;
  line-height: 1.3;
  color: #003da5;
  margin-bottom: 28px;
  font-weight: 800;
}

.refund-text {
  color: #5f6368;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 500;
  max-width: 980px;
  margin-bottom: 34px;
}

.bottom-text {
  color: #5f6368;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 500;
  margin-top: 6px;
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 120px 0 40px;
  }

  .hero-container {
    padding: 0 20px;
  }

  .hero-container h1 {
    font-size: 34px;
  }

  .hero-text {
    font-size: 16px;
  }

  .content-section {
    padding: 40px 0 20px;
  }

  .content-wrapper {
    padding: 0 20px;
  }

  .content-wrapper h2 {
    font-size: 24px;
  }

  .refund-text,
  .bottom-text {
    font-size: 15px;
    line-height: 1.8;
  }
}

@media (max-width: 480px) {
  .hero-badges {
    flex-direction: column;
    gap: 12px;
  }

  .hero-badge {
    min-width: 100%;
  }
}
</style>
