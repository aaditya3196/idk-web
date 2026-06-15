<template>
  <div>
    <AppNavbar />
    <div class="returns-page">
      <section class="hero-outer-bleed">
        <div class="hero-section">
          <div class="hero-glow one"></div>
          <div class="hero-glow two"></div>

          <div class="hero-container reveal">
            <h1>Return & Replacement Policy</h1>
            <p class="hero-text">
              Indi Konnect is committed to providing a smooth and transparent
              replacement experience for all customers and distributors.
            </p>
          </div>
        </div>
      </section>

      <section class="content-outer-bleed">
        <div class="content-section">
          <div class="content-wrapper reveal">
            <h2>Return and Replacement of Your Ordered Products</h2>

            <p class="intro-text">
              In the event the product/s received by you is different from what
              was ordered, you must notify us via email within seven (7) days
              from the date of receipt of the product. In the event of any
              damage or there is shortage of the product/s received; you must
              notify us via email within seven (7) days of receipt of the
              product/s.
            </p>

            <div class="exchange-block">
              <p class="exchange-title">Product Exchange Check List:</p>

              <p class="exchange-subtitle">Check List:</p>

              <ul class="exchange-list">
                <li>
                  Physical Product replacement requests are applicable only
                  within 7 days from the date of receipt of the product.
                </li>
                <li>
                  The Distributor should send a mail from his/her registered
                  email ID only, within 7 days from the date of receipt,
                  mentioning all relevant details to
                  <a href="mailto:dummy@indikonnect.com">
                    dummy@indikonnect.com
                  </a>
                </li>
                <li>
                  <strong>Online form</strong> to be downloaded and filled in by
                  the Distributor while couriering the product back to Indi
                  Konnect warehouse for product replacement
                </li>
                <li>
                  The Distributor should meet all criteria related to the
                  product replacement
                </li>
                <li>
                  Upon receipt of the returned product(s) at the Indi Konnect
                  warehouse, and subject to compliance with all the stipulated
                  criteria for replacement, the company will initiate dispatch
                  of the correct product(s) within seven (7) working days.
                </li>
                <li>
                  In the event of a delay beyond the stipulated timeline due to
                  non-availability of stock, the concerned Distributor/Customer
                  will be notified via email regarding the revised dispatch
                  schedule.
                </li>
              </ul>
            </div>

            <p class="bottom-text">
              If approved, the exchanged or replaced product will be delivered
              within 15 days.
            </p>

            <p class="note-text">
              Please note: Any updates regarding delays in product deliveries
              are published on the official company website for reference
            </p>
          </div>
        </div>
      </section>
    </div>
    <FooterView />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import FooterView from "../FooterView.vue";
import AppNavbar from "../AppNavbar.vue";

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

.returns-page {
  width: 100% !important;
  max-width: 100% !important;
  font-family: "Raleway", sans-serif;
  background: #ffffff;
  color: #2d3748;
}

.hero-outer-bleed {
  width: 100% !important;
  background: #003da5 !important;
  display: block;
}

.hero-section {
  position: relative;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 30px 24px 20px;
  overflow: hidden;
  z-index: 1;
}

.hero-container {
  width: 100%;
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

.content-outer-bleed {
  width: 100% !important;
  background: #ffffff;
  display: block;
}

.content-section {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 55px 24px 45px;
}

.content-wrapper {
  width: 100%;
}

.content-wrapper h2 {
  font-size: 22px;
  line-height: 1.3;
  color: #003da5;
  margin-bottom: 26px;
  font-weight: 800;
}

.intro-text {
  color: #000000;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 500;
  max-width: 980px;
  margin-bottom: 34px;
}

.exchange-block {
  margin-top: 10px;
}

.exchange-title {
  font-size: 20px;
  color: #003da5;
  font-weight: 800;
  margin-bottom: 10px;
}

.exchange-subtitle {
  font-size: 20px;
  color: #333f48;
  font-weight: 700;
  margin-bottom: 15px;
}

.exchange-list {
  padding-left: 24px;
}

.exchange-list li {
  color: #000000;
  font-size: 16px;
  line-height: 1.9;
  margin-bottom: 8px;
  font-weight: 500;
}

.exchange-list a {
  color: #003da5;
  text-decoration: underline;
  font-weight: 600;
}

.exchange-list a:hover {
  color: #ffc72c;
}

.bottom-text {
  color: #000000;
  font-size: 16px;
  line-height: 1.9;
  font-weight: 500;
  margin-top: 20px;
}

.note-text {
  color: #555555;
  font-size: 15px;
  line-height: 1.9;
  font-style: italic;
  margin-top: 10px;
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
    padding: 120px 20px 40px;
  }

  .hero-container h1 {
    font-size: 34px;
  }

  .content-section {
    padding: 40px 20px 30px;
  }

  .intro-text,
  .exchange-list li,
  .bottom-text,
  .note-text {
    font-size: 15px;
    line-height: 1.8;
  }
}
</style>
