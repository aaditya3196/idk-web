<template>
  <div class="about-page">
    <AppNavbar />
    <div class="home-content">
      <section class="hero-section">
        <div class="hero-bg-image"></div>
        <div class="hero-overlay"></div>
        <div class="hero-glow-1"></div>
        <div class="hero-glow-2"></div>

        <div class="container hero-container">
          <div class="hero-wrapper reveal reveal-fade reveal-active">
            <p class="hero-subtitle">Our Identity: The Spirit of New India</p>

            <h1 class="hero-title">
              One Nation.
              <span class="gold-gradient">One Network.</span>
              <br />
              Endless Possibilities.
            </h1>

            <p class="hero-description">
              IndiKonnect is a modern Indian movement built on the pillars of
              Connection, Opportunity, Growth, and Trust. Inspired by the
              vibrant energy and soaring aspirations of 1.4 billion people, we
              have created a platform where the spirit of India meets the power
              of entrepreneurship.
            </p>

            <div class="hero-buttons">
              <button @click="joinTheMovement" class="primary-btn">
                Join the Movement
              </button>
            </div>
          </div>
        </div>

        <div class="wave-divider bottom-curve">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </section>

      <section class="section light-section">
        <div class="container">
          <div class="section-title reveal reveal-up">
            <h2 class="cobalt-heading">
              The name IndiKonnect represents
              <br />
              our core essence:
            </h2>
          </div>

          <div class="identity-grid">
            <div class="identity-card reveal reveal-left">
              <div class="card-badge primary-bg">IN</div>
              <h3>Indi</h3>
              <p>
                Representing the independent spirit of India—its culture, its
                people, and its ambition.
              </p>
            </div>

            <div class="identity-card reveal reveal-right">
              <div class="card-badge gold-bg">✦</div>
              <h3>Konnect</h3>
              <p>
                Our mission to bridge the gap between world-class lifestyle
                products and the aspiring Indian entrepreneur.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section charcoal-section">
        <div class="container brand-wrapper">
          <div class="brand-grid">
            <div class="brand-left reveal reveal-left">
              <h2>
                A Brand That
                <span>Stands Alone</span>
              </h2>
            </div>

            <div class="brand-right reveal reveal-right">
              <p>
                At IndiKonnect, we believe that the brand is the identity. We
                are an institution-driven organization, built not around
                individuals, but around a collective vision of excellence.
              </p>
              <p>
                Our goal is to be India’s most trusted and respected independent
                direct selling brand—a household name that stands for
                transparency, ethics, and long-term stability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section light-section">
        <div class="container">
          <div class="section-title reveal reveal-up">
            <h2 class="cobalt-heading">Vision & Mission</h2>
          </div>

          <div class="vision-grid">
            <div class="vision-card reveal reveal-left">
              <div class="vision-header">
                <div class="mini-badge primary-bg">V</div>
                <h3>Our Vision</h3>
              </div>
              <p class="vision-text">
                To become India’s most trusted, ethical, and empowering direct
                selling company by connecting people through opportunity and a
                culture of shared growth.
              </p>
            </div>

            <div class="vision-card reveal reveal-right">
              <div class="vision-header">
                <div class="mini-badge gold-bg">M</div>
                <h3>Our Mission</h3>
              </div>
              <ul class="custom-list">
                <li>
                  To empower individuals from all walks of life to achieve
                  financial and professional independence.
                </li>
                <li>
                  To offer a curated portfolio of premium lifestyle products at
                  an accessible value.
                </li>
                <li>
                  To foster a transparent, legal, and ethical business ecosystem
                  that inspires leadership nationwide.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section sophisticated-bg">
        <div class="container">
          <div class="section-title reveal reveal-up">
            <h2 class="cobalt-heading">
              The IndiKonnect Lifestyle:
              <br />
              World-Class Excellence
            </h2>
            <p class="sub-intro">
              We don’t just offer products; we offer a lifestyle. IndiKonnect is
              proud to bring a range of premium categories to the Indian market,
              inspired by the world’s most iconic standards of luxury and
              quality.
            </p>
          </div>

          <div class="lifestyle-showcase-grid">
            <div class="lifestyle-item reveal reveal-up">
              <div class="image-zoom-box">
                <img
                  src="../../assets/images/watch.png"
                  alt="Timeless Horology"
                />
                <div class="image-tint"></div>
              </div>
              <div class="lifestyle-card-content">
                <div class="floating-icon">⌚</div>
                <h3>Timeless Horology</h3>
                <p>
                  Our watch collections are inspired by the sophistication of
                  heritage luxury, designed for those who value precision and
                  style.
                </p>
              </div>
            </div>

            <div class="lifestyle-item reveal reveal-up">
              <div class="image-zoom-box">
                <img
                  src="../../assets/images/jewellery.png"
                  alt="Elegant Jewellery"
                />
                <div class="image-tint"></div>
              </div>
              <div class="lifestyle-card-content">
                <div class="floating-icon">💎</div>
                <h3>Elegant Jewellery</h3>
                <p>
                  Modern, elegant collections that reflect individuality and
                  grace, curated for the discerning consumer.
                </p>
              </div>
            </div>

            <div class="lifestyle-item reveal reveal-up">
              <div class="image-zoom-box">
                <img
                  src="../../assets/images/beauty.png"
                  alt="Beauty & Personal Care"
                />
                <div class="image-tint"></div>
              </div>
              <div class="lifestyle-card-content">
                <div class="floating-icon">✨</div>
                <h3>Beauty & Personal Care</h3>
                <p>
                  High-performance skincare and beauty solutions focused on
                  self-care and life enhancement.
                </p>
              </div>
            </div>

            <div class="lifestyle-item reveal reveal-up">
              <div class="image-zoom-box">
                <img
                  src="../../assets/images/dining.png"
                  alt="Lifestyle Dining"
                />
                <div class="image-tint"></div>
              </div>
              <div class="lifestyle-card-content">
                <div class="floating-icon">🍽</div>
                <h3>Lifestyle Dining</h3>
                <p>
                  Sophisticated crockery and dining collections designed to
                  bring elegance to the modern Indian home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section light-section">
        <div class="container">
          <div class="section-title reveal reveal-up">
            <h2 class="cobalt-heading">
              Our Foundations: Values You Can Trust
            </h2>
            <p class="sub-intro">
              The IndiKonnect ecosystem is built on a "People-First" philosophy.
              <br />
              Our house colors—Blue, Yellow, and White—reflect our commitment to
              you:
            </p>
          </div>

          <div class="premium-values-row">
            <div class="value-luxury-card blue-theme reveal reveal-left">
              <h3>Trust & Stability (Blue)</h3>
              <p>
                We operate with professional vision and unwavering confidence.
              </p>
            </div>

            <div class="value-luxury-card yellow-theme reveal reveal-up">
              <h3>Energy & Growth (Yellow)</h3>
              <p>We foster a culture of positivity, ambition, and warmth.</p>
            </div>

            <div class="value-luxury-card white-theme reveal reveal-right">
              <h3>Integrity & Transparency (White)</h3>
              <p>
                Our foundation is built on ethical values and simple, honest
                business practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section future-split-section">
        <div class="container">
          <div class="future-container-grid">
            <div class="future-media reveal reveal-left">
              <div class="img-frame">
                <img
                  src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1400&auto=format&fit=crop"
                  alt="Future-Ready & Compliant"
                />
              </div>
            </div>

            <div class="future-details reveal reveal-right">
              <h2 class="cobalt-heading">Future-Ready & Compliant</h2>
              <p>
                As a proud advocate of ‘Aatmanirbhar Bharat,’ IndiKonnect is
                committed to the highest levels of corporate governance. We are
                actively aligning our operations with the latest industry
                frameworks and regulatory bodies in India to ensure a secure,
                legal, and thriving environment for our distributors and
                consumers alike.
              </p>
              <p>
                With a robust compensation structure and a focus on leadership
                development, we are not just building a business; we are
                building the future of direct selling in India.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section cta-premium-wrap reveal reveal-scale">
        <div class="container">
          <div class="interactive-cta-box">
            <h2>Join the Movement</h2>

            <p class="cta-desc">
              Whether you are looking for premium products to enhance your
              lifestyle or a professional opportunity to change your financial
              future, IndiKonnect is where people and possibilities connect.
            </p>

            <button class="primary-btn dynamic-glow-btn">
              IndiKonnect: Connecting India Through Opportunity.
            </button>
          </div>
        </div>
      </section>

      <!-- <section class="section teaser-section reveal reveal-up">
        <div class="container">
          <div class="teaser-card">
            <div class="floating-icons">
              <span class="float-icon icon-one">🛍️</span>
              <span class="float-icon icon-two">⌚</span>
              <span class="float-icon icon-three">💎</span>
              <span class="float-icon icon-four">✨</span>
              <span class="float-icon icon-five">🍽️</span>
            </div>

            <h2 class="teaser-text">
              There’s more coming,
              <span>check back soon!</span>
            </h2>
          </div>
        </div>
      </section> -->
    </div>

    <FooterView />
  </div>
</template>

<script setup>
import AppNavbar from "../AppNavbar.vue";

import { ref, onMounted, onUnmounted } from "vue";
import FooterView from "../FooterView.vue";

// Reactive pointer managing view visibility thresholds
const isAtTop = ref(true);

// Header state recalculation engine triggered during scroll operations
const handleScroll = () => {
  isAtTop.value = window.scrollY < 10;
};

// in join the movement button redirect to login screen
const joinTheMovement = () => {
  window.location.href = "/login";
};

onMounted(() => {
  // Bind standard browser scroll action to context state engine
  window.addEventListener("scroll", handleScroll);

  // Set target node collections for graphic sequence reveal handlers
  const animatedElements = document.querySelectorAll(".reveal");

  const options = {
    root: null,
    threshold: 0.02,
    rootMargin: "0px 0px -10px 0px",
  };

  // Instantiation observer controlling display class configurations
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Initialize entry cycle monitors
  animatedElements.forEach((el) => {
    scrollObserver.observe(el);
  });
});

onUnmounted(() => {
  // Ensure functional stream drops systematically upon layout detachment
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap");

/* Global Style Context Declarations */
.about-page {
  --cobalt: #003da5;
  --gold: #ffc72c;
  --charcoal: #333f48;
  --dark-blue: #0a2240;
  --pure-white: #ffffff;
  --light-gray-bg: #f9fafc;
  --soft-border: rgba(0, 61, 165, 0.08);
  background-color: var(--pure-white);
  color: var(--charcoal);
  overflow-x: clip;
  line-height: 1.5;
  width: 100%;
}

/* ========================================== */
/* FIXED HEADER STYLES              */
/* ========================================== */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 90px;
  z-index: 1000;
  background: rgba(10, 34, 64, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  transition: background 0.3s ease, backdrop-filter 0.3s ease,
    border-color 0.3s ease;
}

/* Dynamic State Modifier: Removes Blur Canvas when static at Top Edge */
.main-header.at-top {
  background: transparent !important;
  backdrop-filter: blur(0px) !important;
  -webkit-backdrop-filter: blur(0px) !important;
  border-bottom: 1px solid transparent !important;
}

/* Structural Header Content Inner Row */
.header-full-bleed {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
  padding: 0 48px;
  box-sizing: border-box;
}

.logo-link {
  display: flex;
  align-items: center;
}

.nav-logo {
  height: 64px;
  width: auto;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  gap: 40px;
  align-items: center;
  margin-left: auto;
}

.nav-item {
  color: var(--pure-white);
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: color 0.25s ease;
  position: relative;
  padding: 6px 0;
}

.nav-item:hover {
  color: var(--gold);
}

.nav-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--gold);
  transition: width 0.25s ease;
}

.nav-item:hover::after {
  width: 100%;
}

/* ========================================== */
/* HERO WRAPPER STYLES            */
/* ========================================== */
.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 90px 0 80px;
  background-color: var(--cobalt);
  overflow: hidden;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: url("https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  opacity: 0.08;
  mix-blend-mode: overlay;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 61, 165, 0.85) 0%,
    var(--cobalt) 100%
  );
  z-index: 1;
}

.hero-glow-1 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 2;
  top: -10%;
  right: -5%;
  background: radial-gradient(
    circle,
    rgba(255, 199, 44, 0.15) 0%,
    transparent 70%
  );
}

.hero-glow-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 2;
  bottom: -5%;
  left: -5%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1),
    transparent 70%
  );
}

.hero-container {
  position: relative;
  z-index: 3;
  width: 100%;
}

.hero-wrapper {
  max-width: 840px;
  text-align: center;
  margin: 0 auto;
  width: 100%;
}

.hero-subtitle {
  color: var(--gold);
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.15;
  color: var(--pure-white);
  letter-spacing: -1.5px;
  margin-bottom: 20px;
}

.gold-gradient {
  background: linear-gradient(135deg, #ffe082 0%, var(--gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-description {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto 32px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  background: linear-gradient(135deg, var(--gold) 0%, #f5b000 100%);
  color: var(--dark-blue);
  font-weight: 700;
  font-size: 15px;
  padding: 14px 32px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 199, 44, 0.2);
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 199, 44, 0.3);
}

.wave-divider {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  line-height: 0;
  z-index: 4;
}

.wave-divider svg {
  display: block;
  width: 100%;
  height: 50px;
}

/* ========================================== */
/* GLOBAL GRID WRAPPERS            */
/* ========================================== */
.container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.cobalt-heading {
  color: var(--cobalt) !important;
}

.section {
  padding: 40px 0;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.light-section {
  background-color: var(--pure-white);
}

.section-title {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 36px;
  padding: 0 10px;
}

.section-title h2 {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--dark-blue);
}

/* ========================================== */
/* IDENTITY CARDS SECTION         */
/* ========================================== */
.identity-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  width: 100%;
}

.identity-card {
  background: var(--pure-white);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid var(--soft-border);
  box-shadow: 0 10px 30px rgba(10, 34, 64, 0.02);
  width: 100%;
  box-sizing: border-box;
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.identity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(0, 61, 165, 0.06);
}

.card-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 24px;
}

.primary-bg {
  background-color: var(--cobalt);
  color: var(--pure-white);
}

.gold-bg {
  background-color: var(--gold);
  color: var(--dark-blue);
}

.identity-card h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--dark-blue);
}

.identity-card p {
  color: var(--charcoal);
  font-size: 15px;
  line-height: 1.6;
}

/* ========================================== */
/* BRAND STRATEGY SECTOR        */
/* ========================================== */
.charcoal-section {
  background: linear-gradient(135deg, #232a30 0%, var(--charcoal) 100%);
  padding: 40px 0;
}

.brand-wrapper {
  position: relative;
  z-index: 5;
  width: 100%;
}

.brand-grid {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.brand-left h2 {
  font-size: 38px;
  font-weight: 800;
  color: var(--pure-white);
  line-height: 1.25;
}

.brand-left h2 span {
  display: block;
  color: var(--gold);
}

.brand-right p {
  font-size: 15.5px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 18px;
  line-height: 1.65;
}

.brand-right p:last-child {
  margin-bottom: 0;
}

/* ========================================== */
/* VISION & MISSION LAYOUT         */
/* ========================================== */
.vision-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  width: 100%;
}

.vision-card {
  background: var(--pure-white);
  border: 1px solid var(--soft-border);
  padding: 40px;
  border-radius: 20px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.35s ease;
}

.vision-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 4px;
  background-color: var(--cobalt);
  border-radius: 20px 20px 0 0;
  transition: width 0.35s ease;
}

.vision-card:nth-child(2)::before {
  background-color: var(--gold);
}

.vision-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(10, 34, 64, 0.04);
}

.vision-card:hover::before {
  width: 100%;
}

.vision-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.mini-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  flex-shrink: 0;
}

.vision-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--dark-blue);
}

.vision-text {
  font-size: 15px;
  line-height: 1.65;
  color: var(--charcoal);
}

.custom-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.custom-list li {
  position: relative;
  padding-left: 26px;
  margin-bottom: 14px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--charcoal);
}

.custom-list li:last-child {
  margin-bottom: 0;
}

.custom-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--cobalt);
  font-weight: 800;
}

/* ========================================== */
/* LIFESTYLE SHOWCASE TILES        */
/* ========================================== */
.sophisticated-bg {
  background-color: var(--light-gray-bg);
}

.sub-intro {
  font-size: 15px;
  margin-top: 10px;
  opacity: 0.85;
}

.lifestyle-showcase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
}

.lifestyle-item {
  background: var(--pure-white);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(10, 34, 64, 0.02);
  width: 100%;
  box-sizing: border-box;
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.image-zoom-box {
  position: relative;
  height: 200px;
  overflow: hidden;
  width: 100%;
}

.image-zoom-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(10, 34, 64, 0.2) 0%, transparent 100%);
}

.lifestyle-card-content {
  padding: 28px 24px 24px;
  position: relative;
  box-sizing: border-box;
}

.floating-icon {
  position: absolute;
  top: -22px;
  left: 24px;
  width: 44px;
  height: 44px;
  background: var(--pure-white);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 6px 15px rgba(10, 34, 64, 0.08);
}

.lifestyle-item h3 {
  font-size: 19px;
  font-weight: 700;
  color: var(--dark-blue);
  margin-bottom: 10px;
  margin-top: 4px;
}

.lifestyle-item p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--charcoal);
  opacity: 0.9;
}

.lifestyle-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(10, 34, 64, 0.06);
}

.lifestyle-item:hover .image-zoom-box img {
  transform: scale(1.06);
}

/* ========================================== */
/* PREMIUM STRATEGIC VALUES        */
/* ========================================== */
.premium-values-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.value-luxury-card {
  padding: 40px 28px;
  border-radius: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  position: relative;
  box-shadow: 0 10px 30px rgba(10, 34, 64, 0.06);
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.value-luxury-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(10, 34, 64, 0.15);
}

.value-luxury-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.value-luxury-card p {
  font-size: 14.5px;
  line-height: 1.6;
}

.value-luxury-card.blue-theme {
  background: linear-gradient(135deg, var(--cobalt) 0%, #002875 100%);
  color: var(--pure-white);
}

.value-luxury-card.yellow-theme {
  background: linear-gradient(135deg, var(--gold) 0%, #f5b000 100%);
  color: var(--dark-blue);
}

.value-luxury-card.yellow-theme h3 {
  color: var(--dark-blue);
}

.value-luxury-card.white-theme {
  background: var(--pure-white);
  color: var(--charcoal);
  border: 1px solid var(--soft-border);
}

.value-luxury-card.white-theme h3 {
  color: var(--dark-blue);
}

/* ========================================== */
/* COMPLIANCE ENGINE GRID           */
/* ========================================== */
.future-split-section {
  background-color: var(--light-gray-bg);
}

.future-container-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 48px;
  align-items: center;
  width: 100%;
}

.img-frame {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(10, 34, 64, 0.04);
  width: 100%;
}

.img-frame img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.future-details h2 {
  font-size: 32px;
  font-weight: 800;
  color: var(--dark-blue);
  line-height: 1.25;
  margin-bottom: 18px;
}

.future-details p {
  font-size: 15px;
  margin-bottom: 16px;
  line-height: 1.65;
  color: var(--charcoal);
}

.future-details p:last-child {
  margin-bottom: 0;
}

/* ========================================== */
/* CALL TO ACTION                */
/* ========================================== */
.cta-premium-wrap {
  background: var(--pure-white);
  padding: 40px 0 20px;
  width: 100%;
}

.interactive-cta-box {
  background: radial-gradient(
      circle at 90% 10%,
      rgba(255, 199, 44, 0.12) 0%,
      transparent 50%
    ),
    var(--cobalt);
  border-radius: 28px;
  padding: 56px 40px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 61, 165, 0.15);
  width: 100%;
  box-sizing: border-box;
}

.interactive-cta-box h2 {
  color: var(--pure-white);
  font-size: 38px;
  font-weight: 800;
  max-width: 840px;
  margin: 0 auto 18px;
  line-height: 1.25;
}

.cta-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  max-width: 680px;
  margin: 0 auto 36px;
  line-height: 1.65;
}

.dynamic-glow-btn {
  position: relative;
  overflow: hidden;
}

.dynamic-glow-btn::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: rotate(45deg);
  animation: shineLoop 6s linear infinite;
}

@keyframes shineLoop {
  0% {
    left: -100%;
    top: -100%;
  }
  25%,
  100% {
    left: 100%;
    top: 100%;
  }
}

/* ========================================== */
/* TEASER SECTION                 */
/* ========================================== */

.teaser-section {
  padding: 20px 0 50px;
  background: #f9fafc;
}

.teaser-card {
  position: relative;
  overflow: hidden;

  background: linear-gradient(135deg, rgba(0, 61, 165, 1), rgba(0, 40, 120, 1));

  border-radius: 32px;
  padding: 70px 30px;
  text-align: center;

  box-shadow: 0 25px 60px rgba(0, 61, 165, 0.16);
}

.teaser-card::before {
  content: "";
  position: absolute;
  inset: 0;

  background: radial-gradient(
    circle at top right,
    rgba(255, 199, 44, 0.16),
    transparent 30%
  );

  pointer-events: none;
}

.teaser-text {
  position: relative;
  z-index: 2;

  color: white;
  font-size: 58px;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -1.8px;
}

.teaser-text span {
  display: block;
  color: #ffc72c;
}

.floating-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.float-icon {
  position: absolute;
  font-size: 56px;
  opacity: 0.32;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.18));

  animation: floatMove 4.2s ease-in-out infinite;
}

.icon-one {
  top: 18%;
  left: 12%;
  animation-delay: 0s;
}

.icon-two {
  top: 20%;
  right: 14%;
  animation-delay: 1s;
}

.icon-three {
  bottom: 18%;
  left: 18%;
  animation-delay: 2s;
}

.icon-four {
  bottom: 16%;
  right: 20%;
  animation-delay: 3s;
}

.icon-five {
  top: 50%;
  right: 8%;
  animation-delay: 1.5s;
}

@keyframes floatMove {
  0% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }

  25% {
    transform: translateY(-12px) rotate(5deg) scale(1.06);
  }

  50% {
    transform: translateY(-22px) rotate(-6deg) scale(1.12);
  }

  75% {
    transform: translateY(-10px) rotate(4deg) scale(1.05);
  }

  100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
}

@media (max-width: 768px) {
  .teaser-card {
    padding: 56px 24px;
  }

  .teaser-text {
    font-size: 40px;
  }

  .float-icon {
    font-size: 26px;
  }
}

@media (max-width: 480px) {
  .teaser-card {
    padding: 46px 20px;
    border-radius: 24px;
  }

  .teaser-text {
    font-size: 30px;
    line-height: 1.15;
  }

  .float-icon {
    font-size: 22px;
  }
}

/* ========================================== */
/* ANIMATION INTERACTION          */
/* ========================================== */
.reveal {
  opacity: 0;
  filter: blur(4px);
  will-change: transform, opacity;
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s ease;
}

.reveal-up {
  transform: translateY(24px);
}

.reveal-left {
  transform: translateX(-24px);
}

.reveal-right {
  transform: translateX(24px);
}

.reveal-scale {
  transform: scale(0.97);
}

.reveal-fade {
  transform: translateY(0);
}

.reveal.reveal-active {
  opacity: 1;
  transform: translate(0) scale(1);
  filter: blur(0);
}

/* ========================================== */
/* RESPONSIVE MEDIA STRAT          */
/* ========================================== */
@media (max-width: 1100px) {
  .lifestyle-showcase-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 900px) {
  .hero-title {
    font-size: 42px;
  }
  .brand-grid,
  .future-container-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: left;
  }
  .premium-values-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-header {
    height: 80px;
  }
  .nav-logo {
    height: 50px;
  }
  .nav-menu {
    gap: 24px;
  }
  .header-full-bleed {
    padding: 0 24px;
  }
  .section {
    padding: 36px 0;
  }
  .charcoal-section {
    padding: 48px 0;
  }
  .identity-grid,
  .vision-grid,
  .premium-values-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .hero-section {
    padding: 160px 0 90px;
    width: 100%;
  }
  .hero-title {
    font-size: 34px;
    letter-spacing: -1px;
  }
  .hero-description {
    font-size: 15.5px;
    margin-bottom: 28px;
    padding: 0 4px;
  }
  .section-title h2,
  .brand-left h2,
  .interactive-cta-box h2,
  .future-details h2 {
    font-size: 26px;
  }
  .section-title {
    margin-bottom: 24px;
  }
  .hero-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    gap: 12px;
  }
  .primary-btn {
    width: 100%;
    text-align: center;
    padding: 13px 24px;
    font-size: 15px;
    box-sizing: border-box;
  }
  .identity-card,
  .vision-card,
  .value-luxury-card,
  .interactive-cta-box {
    padding: 28px 20px;
  }
  .wave-divider svg {
    height: 32px;
  }
  .img-frame img {
    max-height: 280px;
  }
}

@media (max-width: 480px) {
  .main-header {
    height: 75px;
  }
  .nav-logo {
    height: 44px;
  }
  .nav-menu {
    gap: 16px;
  }
  .header-full-bleed {
    padding: 0 16px;
  }
  .hero-section {
    padding: 140px 0 76px;
  }
  .hero-title {
    font-size: 28px;
  }
  .lifestyle-showcase-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .identity-card,
  .vision-card,
  .value-luxury-card,
  .interactive-cta-box {
    padding: 24px 16px;
  }
  .section-title h2,
  .brand-left h2,
  .interactive-cta-box h2,
  .future-details h2 {
    font-size: 22px;
  }
}
</style>
