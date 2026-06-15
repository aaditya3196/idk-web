<template>
  <div>
    <AppNavbar />
    <div class="shipping-page-root">
      <div class="hero-full-bleed-row">
        <section class="hero-section">
          <div class="hero-glow one"></div>
          <div class="hero-glow two"></div>

          <div class="hero-container reveal">
            <h1>Delivery of Products</h1>

            <p class="hero-text">
              Review the delivery timelines, ownership conditions, verification
              requirements, and exchange procedures for your Indi Konnect
              orders.
            </p>
          </div>
        </section>
      </div>

      <div class="content-full-bleed-row">
        <section class="content-section">
          <div class="content-wrapper reveal">
            <h2>DELIVERY OF PRODUCTS</h2>

            <ol class="main-list">
              <li>
                We will deliver the product/s, if it is, they a/are good/s,
                ordered by you to the address you give us for delivery at the
                time you make your purchase. All product/s will be / are
                dispatched according to the order placed by you. Once the
                product/s is / are dispatched, change of shipping address will
                not be allowed.
              </li>

              <li>
                Delivery will be made as soon as possible after your order is
                accepted and in any event within thirty (30) days of your
                invoice. Delivery will be by way of courier or other similar
                services. Once the product/s is / are dispatched, any change of
                shipping address will not be allowed.
              </li>

              <li>
                You must produce your valid identification proof ("valid ID")
                for verification before acceptance of the product/s. In the
                event you are not able to receive the product/s, you must
                authorise any of your immediate family members and/or any
                authorised person to receive the product/s who is able to verify
                his/her authorisation by producing a valid ID.
              </li>

              <li>
                You will become the owner of the product/s, if it is a/are
                good/s, ordered by you when they have been delivered to you.
                Once the product/s have been delivered to you, they will be held
                at your own risk and we will not be liable for their loss or
                damage.
              </li>
            </ol>

            <div class="disclaimer-block">
              <p class="disclaimer-title">Disclaimer:</p>

              <p class="disclaimer-text">
                In the event of a delay in product delivery beyond the
                stipulated timeline due to non-availability of stock, the
                concerned Distributor/Customer will be notified via email
                regarding the revised dispatch schedule.
              </p>

              <p class="disclaimer-text">
                Please note: Any updates regarding delays in product deliveries
                are published on the official company website for reference.
              </p>
            </div>

            <ol start="5" class="main-list second-list">
              <li>
                In the event the product/s received by you is different from
                what was ordered, you must notify us via email within seven (7)
                days from the date of purchase. In the event of any damage or
                there is shortage of the product/s received, you must notify us
                via email within seven (7) days of receipt of the product/s.
              </li>
            </ol>

            <div class="exchange-block">
              <p class="exchange-title">Product Exchange:</p>

              <p class="exchange-subtitle">Check List:</p>

              <ul class="exchange-list">
                <li>
                  Physical Product exchange requests are applicable only within
                  7 days from the date of purchase the product.
                </li>

                <li>
                  The Distributor should send a mail from his/her registered
                  email ID within 7 days from the date of purchase mentioning
                  all relevant details to
                  <a href="mailto:dummy@indikonnect.com">
                    dummy@indikonnect.com
                  </a>
                </li>

                <li>
                  Online form to be downloaded and filled in by the Distributor
                  while couriering the product back to warehouse for product
                  exchange.
                </li>

                <li>
                  Click on Hyperlink to download form - Mandatory form to be
                  downloaded while couriering the product to warehouse.
                </li>

                <li>
                  If there are multiple products purchased under a single order
                  number and the Distributor wishes to exchange only one
                  product, the request will be processed.
                </li>

                <li>
                  Distributor to choose products of the same BV points which
                  he/she will want to exchange it with.
                </li>

                <li>
                  Virtual products cannot be exchanged against any other
                  products. Combo products cannot be exchanged.
                </li>

                <li>
                  Product exchange requests will not be entertained after 7 days
                  from the date of purchase.
                </li>

                <li>
                  Distributor will have to select the same BV products which
                  he/she wishes to exchange it with.
                </li>
              </ul>
            </div>

            <ol start="6" class="main-list second-list">
              <li>
                If the product/s you order is/are not physical products, the
                email we send you for the confirmation of our acceptance shall
                be conclusive evidence of a binding contract between us for your
                purchase of the product/s.
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
    <FooterView />
  </div>
</template>

<script setup>
import AppNavbar from "../AppNavbar.vue";
import { onMounted } from "vue";
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

.shipping-page-root {
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
  padding: 30px 0px 20px;
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
  text-transform: uppercase;
}

.main-list {
  padding-left: 34px;
}

.main-list li {
  color: #000000;
  font-size: 16px;
  line-height: 1.9;
  margin-bottom: 8px;
  font-weight: 500;
}

.second-list {
  margin-top: 18px;
}

.disclaimer-block {
  margin: 28px 0 14px;
}

.disclaimer-title {
  font-size: 20px;
  color: #003da5;
  font-weight: 800;
  margin-bottom: 8px;
}

.disclaimer-text {
  color: #000000;
  font-size: 16px;
  line-height: 1.9;
  margin-bottom: 0;
  font-weight: 500;
}

.exchange-block {
  margin-top: 18px;
}

.exchange-title {
  font-size: 22px;
  color: #003da5;
  font-weight: 800;
  margin-bottom: 10px;
}

.exchange-subtitle {
  font-size: 20px;
  color: #333f48;
  font-weight: 800;
  margin-bottom: 15px;
}

.exchange-list {
  list-style: none;
  padding-left: 42px;
}

.exchange-list li {
  position: relative;
  color: #000000;
  font-size: 16px;
  line-height: 1.9;
  margin-bottom: 2px;
  font-weight: 500;
}

.exchange-list li::before {
  content: "-";
  position: absolute;
  left: -28px;
  top: 0;
  color: #000000;
  font-size: 20px;
  font-weight: 700;
}

.exchange-list a {
  color: #000000;
  text-decoration: underline;
  font-weight: 500;
}

.exchange-list a:hover {
  color: #003da5;
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

  .main-list {
    padding-left: 24px;
  }

  .main-list li,
  .disclaimer-text,
  .exchange-list li {
    font-size: 15px;
    line-height: 1.8;
  }

  .exchange-list {
    padding-left: 28px;
  }

  .exchange-list li::before {
    left: -20px;
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
