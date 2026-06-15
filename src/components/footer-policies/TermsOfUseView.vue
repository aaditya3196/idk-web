<template>
  <div>
    <AppNavbar />
    <div class="terms-page-root">
      <div class="hero-full-bleed-row">
        <section class="privacy-hero">
          <div class="hero-content reveal">
            <p class="eyebrow">Compliance</p>

            <h1>Terms of Use</h1>

            <p class="hero-description">
              Please read these Terms carefully before using the Indi Konnect
              website and services.
            </p>
          </div>
        </section>
      </div>

      <div class="content-full-bleed-row">
        <section class="policy-section">
          <div class="policy-wrapper">
            <div class="policy-block reveal">
              <h2>Terms of Use</h2>

              <p>
                We provide our services to you through this website based on the
                Terms of Use ('Terms'). Please read the Terms carefully. Your
                use of this website constitutes your acceptance of our Terms.
              </p>
            </div>

            <div class="policy-block reveal">
              <h3>Licence to Use</h3>

              <p>
                We grant you a limited licence to access and make personal use
                of this site. Except with our express written consent, you are
                not allowed to download or modify our website, or any portion of
                it. You are not allowed to reproduce, duplicate, copy or modify
                our website or any portion of it.
              </p>
            </div>

            <div class="policy-block reveal">
              <h3>Downloading</h3>

              <p>
                On this website, we may provide materials which you are
                expressly allowed to download. By downloading any such
                materials, you agree to use the materials only for your
                personal, non-commercial use. You must retain all copyright and
                other proprietary notices contained in the original materials or
                any copy of those materials. You are not allowed to use these
                materials for any commercial purposes, other than for the
                purpose of promoting the networking business of the Company, or
                on any other website unless a prior approval is obtained from
                the Company in accordance with the Indi Konnect Policies &
                Procedures.
              </p>
            </div>

            <div class="policy-block reveal">
              <h3>Electronic Communications</h3>

              <p>
                When you make any transaction via our website or send emails to
                us, you agree to receive communications from us electronically
                and all agreements, notices, or any other communications that we
                provide you electronically satisfy any legal requirement that
                such communications be in writing.
              </p>
            </div>

            <div class="policy-block reveal">
              <h3>Copyright</h3>

              <p>
                The content of this website, including text, graphics, images,
                logos and the compilation of the content of this website are our
                intellectual property.
              </p>
            </div>

            <div class="policy-block reveal">
              <h3>Personal Data</h3>

              <p>
                All personal data you submit to us via this website is governed
                by our Privacy Policy.
              </p>
            </div>

            <div class="policy-block reveal">
              <h3>Links to Third Party Websites</h3>

              <p>
                Links to third party websites may be provided on our website.
                However, we are not responsible for the content of those
                third-party websites. Please refer to our Disclaimer
              </p>
            </div>

            <div class="policy-block reveal">
              <h3>Governing Law and Jurisdiction</h3>

              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of India and the parties hereby submit for all
                purposes relating to these Terms to the non-exclusive
                jurisdiction of the courts of India.
              </p>
            </div>

            <div class="policy-block contact-card reveal">
              <h3>Contact Information</h3>

              <p>
                If you have any questions regarding these Terms of Use, please
                contact Indi Konnect using the details below.
              </p>

              <div class="contact-grid">
                <div class="contact-item">
                  <span>Company</span>
                  <strong>Indi Konnect Private Limited</strong>
                </div>

                <div class="contact-item">
                  <span>Address</span>
                  <strong>
                    Dummy address,<br />
                    Chandigarh – 160022,<br />
                    Punjab, India
                  </strong>
                </div>

                <div class="contact-item">
                  <span>Email</span>
                  <strong>dummy@indikonnect.com</strong>
                </div>

                <div class="contact-item">
                  <span>Phone</span>
                  <strong>+91 12345 67891</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <FooterView />
  </div>
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
}

.terms-page-root {
  width: 100vw !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  font-family: "Raleway", sans-serif;
  background: #f7f9fc;
  color: #333f48;
  overflow-x: hidden;
}

.hero-full-bleed-row {
  width: 100% !important;
  background: #003da5 !important;
  display: block;
}

.privacy-hero {
  width: 100% !important;
  max-width: 1240px;
  margin: 0 auto;
  padding: 30px 24px 20px;
}

.hero-content {
  width: 100%;
  max-width: 820px;
}

.eyebrow {
  color: #ffc72c;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 5px;
}

.privacy-hero h1 {
  color: white;
  font-size: 54px;
  line-height: 1;
  margin-bottom: 18px;
  font-weight: 800;
}

.hero-description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  line-height: 1.7;
  max-width: 650px;
}

.content-full-bleed-row {
  width: 100% !important;
  background: #f7f9fc;
  display: block;
}

.policy-section {
  width: 100% !important;
  padding: 20px 0 60px;
}

.policy-wrapper {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.policy-block {
  margin-bottom: 22px;
}

.policy-block h2 {
  font-size: 34px;
  color: #003da5;
  margin-bottom: 18px;
  font-weight: 800;
}

.policy-block h3 {
  font-size: 24px;
  color: #003da5;
  margin-bottom: 18px;
  font-weight: 800;
}

.policy-block p {
  font-size: 15px;
  line-height: 1.9;
  color: #4c5661;
  margin-bottom: 14px;
}

.contact-card {
  background: #003da5;
  border-radius: 18px;
  padding: 34px 28px;
  margin-bottom: 0;
}

.contact-card h3,
.contact-card p,
.contact-card strong,
.contact-card span {
  color: white;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 28px;
}

.contact-item {
  background: rgba(255, 255, 255, 0.08);
  padding: 22px;
  border-radius: 14px;
}

.contact-item span {
  display: block;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.contact-item strong {
  line-height: 1.8;
  font-size: 15px;
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
  .privacy-hero {
    padding: 120px 20px 46px;
  }

  .privacy-hero h1 {
    font-size: 38px;
  }

  .policy-section {
    padding: 40px 0 40px;
  }

  .policy-wrapper {
    padding: 0 20px;
  }

  .policy-block h2 {
    font-size: 28px;
  }

  .policy-block h3 {
    font-size: 21px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
