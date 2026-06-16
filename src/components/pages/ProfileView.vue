<template>
  <div class="profile-root">
    <AppNavbar />
    <main class="profile-body">
      <div v-if="!demoStore.isLoggedIn" class="not-logged-in">
        <p>Please <router-link to="/login">log in</router-link> to view your profile.</p>
      </div>
      <div v-else class="profile-grid">

        <!-- LEFT: Identity -->
        <section class="profile-card">
          <div class="card-header"><i class="ri-user-line"></i> My Profile</div>

          <div class="avatar-row">
            <div class="avatar">{{ initials }}</div>
            <div>
              <p class="profile-name">{{ user.fullName }}</p>
              <span class="role-badge" :class="user.role">{{ user.role === 'distributor' ? 'Distributor' : 'Customer' }}</span>
            </div>
          </div>

          <div class="info-rows">
            <div class="info-row"><span>Mobile</span><strong>{{ user.mobile || '—' }}</strong></div>
            <div class="info-row"><span>Email</span><strong>{{ user.email || '—' }}</strong></div>
            <div class="info-row"><span>Date of Birth</span><strong>{{ user.dob || '—' }}</strong></div>
            <div v-if="user.baId" class="info-row"><span>BA ID</span><strong class="ba-id">{{ user.baId }}</strong></div>
            <div v-if="user.referrerId" class="info-row"><span>Referrer ID</span><strong>{{ user.referrerId }}</strong></div>
            <div class="info-row"><span>Member Since</span><strong>{{ formatDate(user.registeredAt) }}</strong></div>
          </div>
        </section>

        <!-- RIGHT TOP: KYC -->
        <section v-if="user.role === 'distributor'" class="profile-card">
          <div class="card-header"><i class="ri-shield-check-line"></i> KYC & Verification</div>
          <div class="info-rows">
            <div class="info-row">
              <span>Mobile</span>
              <strong class="status-ok"><i class="ri-checkbox-circle-fill"></i> Verified</strong>
            </div>
            <div class="info-row">
              <span>Aadhaar</span>
              <strong :class="user.aadhaarVerified ? 'status-ok' : 'status-pending'">
                <i :class="user.aadhaarVerified ? 'ri-checkbox-circle-fill' : 'ri-time-line'"></i>
                {{ user.aadhaarVerified ? 'Verified' : 'Pending' }}
              </strong>
            </div>
            <div class="info-row">
              <span>PAN</span>
              <strong :class="user.panVerified ? 'status-ok' : 'status-pending'">
                <i :class="user.panVerified ? 'ri-checkbox-circle-fill' : 'ri-time-line'"></i>
                {{ user.panVerified ? 'Verified' : 'Pending' }}
              </strong>
            </div>
            <div v-if="user.pan" class="info-row"><span>PAN Number</span><strong>{{ maskPan(user.pan) }}</strong></div>
            <div v-if="user.aadhaar" class="info-row"><span>Aadhaar</span><strong>{{ maskAadhaar(user.aadhaar) }}</strong></div>
          </div>
        </section>

        <!-- Address -->
        <section v-if="user.address" class="profile-card">
          <div class="card-header"><i class="ri-map-pin-line"></i> Address</div>
          <p class="address-text">{{ user.address }}</p>
        </section>

        <!-- Bank Details -->
        <section v-if="user.role === 'distributor'" class="profile-card">
          <div class="card-header"><i class="ri-bank-line"></i> Bank Account</div>
          <div v-if="user.bankDetails">
            <div class="info-rows">
              <div class="info-row"><span>Account Holder</span><strong>{{ user.bankDetails.accountHolder }}</strong></div>
              <div class="info-row"><span>Account Number</span><strong>{{ maskAccount(user.bankDetails.accountNumber) }}</strong></div>
              <div class="info-row"><span>IFSC Code</span><strong>{{ user.bankDetails.ifsc }}</strong></div>
              <div class="info-row"><span>Status</span><strong class="status-ok"><i class="ri-checkbox-circle-fill"></i> Verified</strong></div>
            </div>
          </div>
          <div v-else class="pending-bank">
            <i class="ri-time-line"></i>
            <p>Bank account verification pending. Please complete within 30 days.</p>
          </div>
        </section>

      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDemoStore } from "../../stores/useDemoStore.js";
import AppNavbar from "../AppNavbar.vue";
import Footer from "../FooterView.vue";

const demoStore = useDemoStore();
const user = computed(() => demoStore.user || {});

const initials = computed(() => {
  const name = user.value.fullName || "";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
});

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function maskPan(pan) {
  if (!pan || pan.length < 5) return pan;
  return pan.slice(0, 2) + "•••••" + pan.slice(-3);
}

function maskAadhaar(aadhaar) {
  if (!aadhaar) return "";
  const digits = aadhaar.replace(/\D/g, "");
  return "•••• •••• " + digits.slice(-4);
}

function maskAccount(acc) {
  if (!acc || acc.length < 4) return acc;
  return "•".repeat(acc.length - 4) + acc.slice(-4);
}
</script>

<style scoped>
.profile-root { background: #f8fafc; min-height: 100vh; }
.profile-body { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
.not-logged-in { text-align: center; padding: 80px; font-size: 16px; color: #5f6368; }
.not-logged-in a { color: #003da5; font-weight: 700; }

.profile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

.profile-card {
  background: #fff;
  border: 1px solid rgba(0,61,165,0.08);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,61,165,0.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #003da5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2f7;
}

.avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #003da5;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-name { margin: 0 0 6px; font-size: 18px; font-weight: 700; color: #0a2240; }
.role-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; }
.role-badge.distributor { background: rgba(0,61,165,0.08); color: #003da5; }
.role-badge.customer { background: rgba(22,163,74,0.08); color: #16a34a; }
.ba-id { color: #003da5; font-family: monospace; font-size: 14px; }

.info-rows { display: flex; flex-direction: column; gap: 0; }
.info-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f4fa; font-size: 13px; }
.info-row:last-child { border-bottom: none; }
.info-row span { color: #5a6b82; }
.info-row strong { color: #0a2240; font-weight: 700; text-align: right; }

.status-ok { color: #16a34a !important; display: inline-flex; align-items: center; gap: 4px; }
.status-pending { color: #d97706 !important; display: inline-flex; align-items: center; gap: 4px; }

.address-text { font-size: 14px; color: #344760; line-height: 1.6; }

.pending-bank { display: flex; align-items: flex-start; gap: 10px; background: #fffbeb; border: 1px solid rgba(217,119,6,0.2); border-radius: 10px; padding: 14px; color: #92400e; font-size: 13px; }
.pending-bank i { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.pending-bank p { margin: 0; }

@media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }
</style>