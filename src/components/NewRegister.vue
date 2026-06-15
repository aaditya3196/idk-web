<template>
  <div>
    <AppNavbar />
    <section class="register-section">
      <div class="container">
        <h2 class="title">
          {{ selectedRole === 'distributor' ? 'DISTRIBUTOR REGISTRATION' : 'CREATE ACCOUNT' }}
        </h2>
        <div class="card-box register-box">

          <!-- ─── CUSTOMER FLOW ─── -->
          <template v-if="selectedRole === 'customer'">
            <h3 class="role-form-title">Customer Registration</h3>
            <form @submit.prevent="handleRegister">
              <div class="form-grid">
                <div class="form-group">
                  <label>First Name</label>
                  <input v-model="firstName" type="text" placeholder="First Name" />
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input v-model="lastName" type="text" placeholder="Last Name" />
                </div>
                <div class="form-group">
                  <label>Date of Birth</label>
                  <input v-model="dob" type="date" :max="maxDob" style="cursor:pointer" class="dob-input" />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="email" type="email" placeholder="Email" />
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input v-model="mobileNumber" type="text" placeholder="Phone Number" />
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <div class="password-wrapper">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter your password" />
                    <button type="button" class="password-visibility-btn" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button class="register-btn" type="submit" :disabled="isLoading">
                {{ isLoading ? 'CREATING...' : 'CREATE ACCOUNT' }}
              </button>
            </form>
            <div v-if="toastMessage" :class="['toast', toastType]">{{ toastMessage }}</div>
          </template>

          <!-- ─── DISTRIBUTOR WIZARD ─── -->
          <template v-else>

            <!-- WIZARD PROGRESS -->
            <div class="wizard-progress">
              <div v-for="(step, i) in wizardSteps" :key="i" class="wizard-progress-item">
                <div
                  class="wizard-step-dot"
                  :class="{
                    active: distStep === i + 1,
                    completed: stepCompleted[i] && !stepSkipped[i],
                    skipped: stepSkipped[i]
                  }"
                >
                  <i v-if="stepCompleted[i] && !stepSkipped[i]" class="ri-check-line"></i>
                  <i v-else-if="stepSkipped[i]" class="ri-time-line"></i>
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <span
                  class="wizard-step-label"
                  :class="{
                    active: distStep === i + 1,
                    completed: stepCompleted[i] && !stepSkipped[i],
                    skipped: stepSkipped[i]
                  }"
                >{{ step }}</span>
                <div v-if="i < wizardSteps.length - 1" class="wizard-step-line"
                  :class="{
                    active: stepCompleted[i] && !stepSkipped[i],
                    skipped: stepSkipped[i]
                  }"
                ></div>
              </div>
            </div>

            <!-- ── STEP 1: Mobile + Identity ── -->
            <div v-if="distStep === 1" class="wizard-step-content">
              <div class="step-header">
                <h3 class="step-title">Verify Mobile</h3>
                <p class="step-subtitle">Start with your mobile number to verify your identity.</p>
              </div>

              <!-- Mobile OTP -->
              <div class="form-group" style="margin-bottom: 20px;">
                <label>Mobile Number <span class="required">*</span></label>
                <div class="input-verify-row">
                  <input
                    v-model="dist.mobile"
                    type="text"
                    placeholder="Enter 10-digit mobile number"
                    maxlength="10"
                    :disabled="mobileVerified"
                    :class="{ 'input-verified': mobileVerified }"
                  />
                  <button
                    v-if="!mobileVerified && !mobileOtpSent"
                    type="button"
                    class="verify-btn"
                    :disabled="dist.mobile.length < 10 || mobileOtpLoading"
                    @click="sendMobileOtp"
                  >{{ mobileOtpLoading ? 'Sending...' : 'Send OTP' }}</button>
                  <span v-if="mobileVerified" class="verified-badge"><i class="ri-checkbox-circle-fill"></i> Verified</span>
                </div>
                <div v-if="mobileOtpSent && !mobileVerified" class="otp-row" style="margin-top:10px;">
                  <input v-model="mobileOtp" type="text" placeholder="Enter OTP" maxlength="6" class="otp-input" />
                  <button type="button" class="verify-btn" :disabled="mobileOtp.length < 4" @click="verifyMobileOtp">Confirm OTP</button>
                  <button type="button" class="resend-btn" @click="sendMobileOtp">Resend</button>
                </div>
                <p v-if="mobileError" class="field-error">{{ mobileError }}</p>
              </div>

              <!-- Referrer ID — revealed after mobile verified -->
              <transition name="slide-down">
                <div v-if="mobileVerified">
                  <div class="form-group" style="margin-bottom: 24px;">
                    <label>Referrer ID <span class="required">*</span></label>
                    <div class="input-verify-row">
                      <input
                        v-model="dist.referrerId"
                        type="text"
                        placeholder="e.g. DIST-10045"
                        :class="{ 'input-verified': referrerVerified, 'input-error': referrerError }"
                        :disabled="referrerVerified"
                      />
                      <button
                        v-if="!referrerVerified"
                        type="button"
                        class="verify-btn"
                        :disabled="!dist.referrerId.trim() || referrerLoading"
                        @click="verifyReferrer"
                      >{{ referrerLoading ? 'Checking...' : 'Verify' }}</button>
                      <span v-if="referrerVerified" class="verified-badge"><i class="ri-checkbox-circle-fill"></i> Verified</span>
                    </div>
                    <p v-if="referrerError" class="field-error">{{ referrerError }}</p>
                    <p v-if="referrerVerified" class="field-success">Referrer verified. Fill in your details below.</p>
                  </div>

                  <!-- Identity fields — revealed after referrer verified -->
                  <transition name="slide-down">
                    <div v-if="referrerVerified" class="identity-fields">
                      <div class="form-grid">
                        <div class="form-group">
                          <label>Full Name <span class="required">*</span></label>
                          <input v-model="dist.fullName" type="text" placeholder="As on Aadhaar" />
                        </div>
                        <div class="form-group">
                          <label>Date of Birth <span class="required">*</span></label>
                          <input v-model="dist.dob" type="date" :max="maxDob" style="cursor:pointer" />
                        </div>
                        <div class="form-group full-span">
                          <label>Email Address <span class="optional-label">(Optional)</span></label>
                          <input v-model="dist.email" type="email" placeholder="you@example.com" />
                        </div>
                        <div class="form-group">
                          <label>Password <span class="required">*</span></label>
                          <div class="password-wrapper">
                            <input v-model="dist.password" :type="showDistPassword ? 'text' : 'password'" placeholder="Min. 8 characters" />
                            <button type="button" class="password-visibility-btn" @click="showDistPassword = !showDistPassword">
                              <i :class="showDistPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
                            </button>
                          </div>
                          <p class="field-hint">Min. 8 chars, 1 uppercase, 1 number.</p>
                        </div>
                        <div class="form-group">
                          <label>Confirm Password <span class="required">*</span></label>
                          <div class="password-wrapper">
                            <input v-model="dist.confirmPassword" :type="showDistConfirmPassword ? 'text' : 'password'" placeholder="Re-enter password" />
                            <button type="button" class="password-visibility-btn" @click="showDistConfirmPassword = !showDistConfirmPassword">
                              <i :class="showDistConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <p v-if="step1Error" class="step-error">{{ step1Error }}</p>

                      <div class="step-actions">
                        <button type="button" class="next-btn" @click="goToStep2">
                          Continue to KYC Verification <i class="ri-arrow-right-line"></i>
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </transition>
            </div>

            <!-- ── STEP 2: Aadhaar + PAN ── -->
            <div v-if="distStep === 2" class="wizard-step-content">
              <div class="step-header">
                <h3 class="step-title">KYC Verification</h3>
                <p class="step-subtitle">Verify your Aadhaar and PAN for compliance and account activation.</p>
              </div>

              <!-- Aadhaar -->
              <div class="section-divider" style="margin-top:0;">
                <span>Aadhaar Verification</span>
              </div>

              <div class="form-group">
                <label>Aadhaar Number <span class="required">*</span></label>
                <div class="input-verify-row">
                  <input
                    v-model="dist.aadhaar"
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    maxlength="14"
                    :disabled="aadhaarVerified"
                    :class="{ 'input-verified': aadhaarVerified, 'input-error': aadhaarError }"
                    @input="formatAadhaar"
                  />
                  <button
                    v-if="!aadhaarVerified && !aadhaarOtpSent"
                    type="button"
                    class="verify-btn"
                    :disabled="dist.aadhaar.replace(/\s/g,'').length < 12 || aadhaarLoading"
                    @click="sendAadhaarOtp"
                  >{{ aadhaarLoading ? 'Verifying...' : 'Verify Aadhaar' }}</button>
                  <span v-if="aadhaarVerified" class="verified-badge"><i class="ri-checkbox-circle-fill"></i> Verified</span>
                </div>
                <p v-if="aadhaarError" class="field-error">{{ aadhaarError }}</p>
              </div>

              <div v-if="aadhaarOtpSent && !aadhaarVerified" class="otp-row" style="margin-top:10px;">
                <input v-model="aadhaarOtp" type="text" placeholder="Enter OTP sent to Aadhaar-linked mobile" maxlength="6" class="otp-input" />
                <button type="button" class="verify-btn" :disabled="aadhaarOtp.length < 4" @click="verifyAadhaarOtp">Confirm OTP</button>
                <button type="button" class="resend-btn" @click="sendAadhaarOtp">Resend</button>
              </div>

              <!-- Address from Aadhaar -->
              <transition name="slide-down">
                <div v-if="aadhaarVerified && aadhaarAddress" class="aadhaar-address-box">
                  <div class="aadhaar-address-header">
                    <i class="ri-map-pin-2-fill"></i>
                    <span>Address fetched from Aadhaar</span>
                  </div>
                  <p class="aadhaar-address-text">{{ aadhaarAddress }}</p>
                  <div class="address-save-options">
                    <div class="checkbox-row">
                      <label class="check-option">
                        <input type="checkbox" v-model="saveAsBilling" />
                        <span>Save this address shipping and/or billing address</span>
                      </label>
                    </div>
                    <p class="field-hint" style="margin-top: 8px;">
                      <i class="ri-information-line"></i>
                      You can update or add a new address anytime from your profile.
                    </p>
                  </div>
                </div>
              </transition>

              <!-- PAN -->
              <div class="section-divider">
                <span>PAN Verification</span>
              </div>

              <div class="form-group">
                <label>PAN Number <span class="required">*</span></label>
                <div class="input-verify-row">
                  <input
                    v-model="dist.pan"
                    type="text"
                    placeholder="ABCDE1234F"
                    maxlength="10"
                    :disabled="panVerified"
                    :class="{ 'input-verified': panVerified, 'input-error': panError }"
                    @input="dist.pan = dist.pan.toUpperCase()"
                  />
                  <button
                    v-if="!panVerified"
                    type="button"
                    class="verify-btn"
                    :disabled="dist.pan.length < 10 || panLoading"
                    @click="verifyPan"
                  >{{ panLoading ? 'Verifying...' : 'Verify PAN' }}</button>
                  <span v-if="panVerified" class="verified-badge"><i class="ri-checkbox-circle-fill"></i> Verified</span>
                </div>
                <p v-if="panError" class="field-error">{{ panError }}</p>
              </div>

              <transition name="slide-down">
                <div v-if="panVerified" class="verified-info-box">
                  <i class="ri-shield-check-fill"></i>
                  <div>
                    <p class="verified-info-name">{{ panHolderName }}</p>
                    <p class="verified-info-sub">PAN verified successfully</p>
                  </div>
                </div>
              </transition>

              <p v-if="step2Error" class="step-error">{{ step2Error }}</p>

              <div class="step-actions two-col">
                <button type="button" class="back-btn" @click="distStep = 1">
                  <i class="ri-arrow-left-line"></i> Back
                </button>
                <button type="button" class="next-btn" :disabled="!aadhaarVerified || !panVerified" @click="goToStep3">
                  Continue to Bank Details <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>

            <!-- ── STEP 3: Bank Details ── -->
            <div v-if="distStep === 3" class="wizard-step-content">
              <div class="step-header">
                <h3 class="step-title">Bank Account Details</h3>
                <p class="step-subtitle">Required for payouts. You can complete this within 30 days of registration.</p>
              </div>

  

              <div class="form-grid">
                <div class="form-group full-span">
                  <label>Account Holder Name <span class="required">*</span></label>
                  <input v-model="dist.bankAccountHolder" type="text" placeholder="As per bank records" />
                </div>
                <div class="form-group">
                  <label>Account Number <span class="required">*</span></label>
                  <input v-model="dist.bankAccount" type="text" placeholder="Enter account number" />
                </div>
                <div class="form-group">
                  <label>Confirm Account Number <span class="required">*</span></label>
                  <input v-model="dist.bankAccountConfirm" type="text" placeholder="Re-enter account number" />
                </div>
                <div class="form-group">
                  <label>IFSC Code <span class="required">*</span></label>
                  <input
                    v-model="dist.ifsc"
                    type="text"
                    placeholder="e.g. SBIN0001234"
                    maxlength="11"
                    @input="dist.ifsc = dist.ifsc.toUpperCase()"
                  />
                </div>
              </div>

              <p v-if="step3Error" class="step-error">{{ step3Error }}</p>

              <div class="step-actions two-col">
                <button type="button" class="back-btn" @click="distStep = 2">
                  <i class="ri-arrow-left-line"></i> Back
                </button>
                <div class="right-actions">
                  <button type="button" class="do-later-btn" @click="showBankSkipDialog = true">
                    Do it later
                  </button>
                  <button type="button" class="next-btn" @click="goToStep4">
                    Verify Bank Account <i class="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- ── STEP 4: Review & Submit ── -->
            <div v-if="distStep === 4" class="wizard-step-content">
              <div class="step-header">
                <h3 class="step-title">Review & Submit</h3>
                <p class="step-subtitle">Confirm your details and agree to terms to complete registration.</p>
              </div>

              <div class="summary-grid">
                <!-- Identity Card -->
                <div class="summary-card">
                  <div class="summary-card-header">
                    <i class="ri-user-line"></i>
                    <span>Identity</span>
                  </div>
                  <div class="summary-row"><span>Name</span><strong>{{ dist.fullName || '—' }}</strong></div>
                  <div class="summary-row"><span>Mobile</span><strong>{{ dist.mobile || '—' }}</strong></div>
                  <div class="summary-row"><span>Email</span><strong>{{ dist.email || '—' }}</strong></div>
                  <div class="summary-row"><span>Date of Birth</span><strong>{{ dist.dob || '—' }}</strong></div>
                  <div v-if="aadhaarAddress" class="summary-row address-row">
                    <span>Billing Address</span>
                    <strong>{{ saveAsBilling ? aadhaarAddress : 'Not saved' }}</strong>
                  </div>
                </div>

                <!-- Verification Status Card -->
                <div class="summary-card">
                  <div class="summary-card-header">
                    <i class="ri-shield-check-line"></i>
                    <span>Verification Status</span>
                  </div>
                  <div class="summary-row">
                    <span>Mobile</span>
                    <strong :class="mobileVerified ? 'status-ok' : 'status-pending'">
                      <i :class="mobileVerified ? 'ri-checkbox-circle-fill' : 'ri-time-line'"></i>
                      {{ mobileVerified ? 'Verified' : 'Pending' }}
                    </strong>
                  </div>
                  <div class="summary-row">
                    <span>Aadhaar</span>
                    <strong :class="aadhaarVerified ? 'status-ok' : 'status-pending'">
                      <i :class="aadhaarVerified ? 'ri-checkbox-circle-fill' : 'ri-time-line'"></i>
                      {{ aadhaarVerified ? 'Verified' : 'Pending' }}
                    </strong>
                  </div>
                  <div class="summary-row">
                    <span>PAN</span>
                    <strong :class="panVerified ? 'status-ok' : 'status-pending'">
                      <i :class="panVerified ? 'ri-checkbox-circle-fill' : 'ri-time-line'"></i>
                      {{ panVerified ? 'Verified' : 'Pending' }}
                    </strong>
                  </div>
                  <div class="summary-row">
                    <span>Bank Account</span>
                    <strong :class="!bankSkipped ? 'status-ok' : 'status-warn'">
                      <i :class="!bankSkipped ? 'ri-checkbox-circle-fill' : 'ri-time-line'"></i>
                      {{ !bankSkipped ? 'Verified' : 'Pending (30 days)' }}
                    </strong>
                  </div>
                </div>
              </div>

              <!-- T&C -->
              <div class="tnc-box">
                <h4 class="tnc-title">Terms & Conditions</h4>
                <div class="tnc-scroll">
                  <p>By registering as a distributor on this platform, you agree to the following:</p>
                  <ol>
                    <li>You confirm that all information provided during registration is accurate, complete, and truthful. Any misrepresentation may lead to immediate termination of your distributor account.</li>
                    <li>Your Aadhaar and PAN details are collected solely for KYC compliance and statutory requirements as mandated by Indian law. This data will be stored securely and will not be shared with third parties except as required by law.</li>
                    <li>Bank account details provided will be used exclusively for processing payouts related to your distributor earnings. You are responsible for ensuring the accuracy of this information.</li>
                    <li>You agree to abide by the distributor code of conduct, which prohibits misrepresentation of products, unauthorized discounting, and any activity that brings disrepute to the brand.</li>
                    <li>The company reserves the right to modify distributor terms with 30 days' prior notice. Continued participation after notice constitutes acceptance of revised terms.</li>
                    <li>Distributor commissions, payout schedules, and tier structures are governed by the Distributor Compensation Plan, which forms part of this agreement by reference.</li>
                    <li>You acknowledge that your distributor status is non-transferable and may be suspended or terminated for violation of any of these terms.</li>
                  </ol>
                </div>

                <label class="tnc-check">
                  <input type="checkbox" v-model="agreedToTnc" />
                  <span>I have read and agree to the Terms & Conditions above.</span>
                </label>

                <div class="declaration-prompt">
                  <p class="declaration-instruction">
                    To confirm, type the following in the box below:<br />
                    <strong class="declaration-expected">{{ expectedDeclaration }}</strong>
                  </p>
                  <textarea
                    v-model="declaration"
                    rows="3"
                    class="declaration-textarea"
                    placeholder="Type your declaration here..."
                  ></textarea>
                  <p v-if="declarationMismatch" class="field-error">
                    The text you entered does not match. Please type the exact sentence shown above (casing doesn't matter).
                  </p>
                </div>
              </div>

              <p v-if="step4Error" class="step-error">{{ step4Error }}</p>

              <div class="step-actions two-col">
                <button type="button" class="back-btn" @click="distStep = 3">
                  <i class="ri-arrow-left-line"></i> Back
                </button>
                <button
                  type="button"
                  class="submit-btn"
                  :disabled="!agreedToTnc || !declaration.trim() || isSubmitting"
                  @click="handleDistributorSubmit"
                >
                  <i class="ri-send-plane-line"></i>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Registration' }}
                </button>
              </div>
            </div>

            <!-- ── SUCCESS STATE ── -->
            <div v-if="distStep === 5" class="success-state">
              <div class="success-icon"><i class="ri-checkbox-circle-fill"></i></div>
              <h3>Registration Submitted!</h3>
              <p>
                Your distributor application has been received. Our team will review and activate your account within 24–48 hours.
                You'll receive a confirmation on <strong>{{ dist.mobile }}</strong>
                <template v-if="dist.email"> and <strong>{{ dist.email }}</strong></template>.
              </p>

              <div class="success-cards-row">
                <div class="success-summary-card">
                  <div class="success-card-title"><i class="ri-shield-check-line"></i> Verification</div>
                  <div class="success-check-item" :class="{ ok: mobileVerified }">
                    <i :class="mobileVerified ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'"></i> Mobile Verified
                  </div>
                  <div class="success-check-item" :class="{ ok: aadhaarVerified }">
                    <i :class="aadhaarVerified ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'"></i> Aadhaar Verified
                  </div>
                  <div class="success-check-item" :class="{ ok: panVerified }">
                    <i :class="panVerified ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'"></i> PAN Verified
                  </div>
                  <div class="success-check-item ok">
                    <i class="ri-checkbox-circle-fill"></i> Consent Provided
                  </div>
                   <div v-if="!bankSkipped" class="success-check-item ok">
                    <i class="ri-checkbox-circle-fill"></i> Bank Account Verified
                  </div>
                  <div v-if="bankSkipped" class="success-check-item bank-pending-item">
                    <i class="ri-time-line"></i> Bank Account — Complete within 30 days
                  </div>
                </div>

                <div class="success-summary-card">
                  <div class="success-card-title"><i class="ri-user-star-line"></i> BA Account</div>
                  <div class="success-check-item ok">
                    <i class="ri-checkbox-circle-fill"></i>
                    BA ID: <strong style="margin-left:4px;">{{ generatedBAId }}</strong>
                  </div>
                  <p class="ba-note">
                    <i class="ri-information-line"></i>
                    Complete your first purchase to activate BA pricing.
                  </p>
                </div>
              </div>

              <router-link to="/shop" class="shop-now-btn">
                <i class="ri-shopping-bag-line"></i> Shop Now
              </router-link>
            </div>

          </template>
        </div>
      </div>
    </section>

    <!-- BANK SKIP WARNING DIALOG -->
    <div v-if="showBankSkipDialog" class="dialog-overlay" @click.self="showBankSkipDialog = false">
      <div class="dialog-box">
        <div class="dialog-icon"><i class="ri-error-warning-line"></i></div>
        <h4 class="dialog-title">Are you sure?</h4>
        <p class="dialog-body">
          Bank account verification is <strong>mandatory within 30 days</strong> of registration. Unverified accounts will not be eligible to receive payouts. You can complete this anytime from your dashboard.
        </p>
        <div class="dialog-actions">
          <button type="button" class="dialog-cancel-btn" @click="showBankSkipDialog = false">Go Back</button>
          <button type="button" class="dialog-ok-btn" @click="confirmSkipBank">Yes, I'll do it later</button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppNavbar from "./AppNavbar.vue";
import Footer from "./FooterView.vue";
import { register } from "rdep-ecom-sdk";

// ─── SHARED ───
const selectedRole = ref("customer");
const router = useRouter();
const route = useRoute();
const maxDob = new Date().toISOString().split("T")[0];

function normalizeRole(value) {
  return value === "distributor" ? "distributor" : "customer";
}

function syncRoleFromRoute() {
  selectedRole.value = normalizeRole(route.query.role);
}

watch(() => route.query.role, () => { syncRoleFromRoute(); }, { immediate: true });

// ─── CUSTOMER STATE ───
const firstName = ref("");
const lastName = ref("");
const dob = ref("");
const email = ref("");
const mobileNumber = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function togglePasswordVisibility() { showPassword.value = !showPassword.value; }

function showToast(message, type) {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => { toastMessage.value = ""; }, 3000);
}

async function handleRegister() {
  toastMessage.value = "";
  const domainName = window.location.host || window.location.hostname || "";
  if (!firstName.value || !lastName.value || !dob.value || !email.value || !mobileNumber.value || !password.value || !domainName) return;
  isLoading.value = true;
  try {
    const response = await register({
      firstName: firstName.value,
      lastName: lastName.value,
      dob: dob.value,
      email: email.value,
      mobileNumber: mobileNumber.value,
      password: password.value,
      domainName,
    });
    const statusCode = String(response?.statusCode ?? response?.data?.statusCode ?? "");
    const statusMessage = response?.statusMessage ?? response?.data?.statusMessage;
    if (statusCode === "200") {
      showToast(statusMessage, "success");
      setTimeout(() => { router.push("/login"); }, 1200);
    } else if (statusCode === "400") {
      showToast(statusMessage, "error");
    }
  } catch (error) {
    const errorStatusCode = String(error?.response?.status ?? error?.response?.data?.statusCode ?? "");
    const errorStatusMessage = error?.response?.data?.statusMessage;
    if (errorStatusCode === "400") showToast(errorStatusMessage, "error");
  } finally {
    isLoading.value = false;
  }
}

// ─── DISTRIBUTOR WIZARD STATE ───
const distStep = ref(1);
const isSubmitting = ref(false);
const showDistPassword = ref(false);
const showDistConfirmPassword = ref(false);
const bankSkipped = ref(false);
const agreedToTnc = ref(false);
const declaration = ref("");
const showBankSkipDialog = ref(false);
const generatedBAId = ref("");

const expectedDeclaration = "I agree to the above terms and conditions and confirm that all information provided is accurate";

const declarationMismatch = computed(() => {
  if (!declaration.value.trim()) return false;
  return declaration.value.trim().toLowerCase() !== expectedDeclaration.toLowerCase();
});

const wizardSteps = ["Identity", "KYC", "Bank", "Review"];
const stepCompleted = ref([false, false, false, false]);
const stepSkipped = ref([false, false, false, false]);

const dist = ref({
  referrerId: "",
  fullName: "",
  mobile: "",
  dob: "",
  email: "",
  password: "",
  confirmPassword: "",
  aadhaar: "",
  pan: "",
  bankAccountHolder: "",
  bankAccount: "",
  bankAccountConfirm: "",
  ifsc: "",
});

// Mobile OTP
const mobileVerified = ref(false);
const mobileOtpSent = ref(false);
const mobileOtp = ref("");
const mobileError = ref("");
const mobileOtpLoading = ref(false);

// Referrer
const referrerVerified = ref(false);
const referrerLoading = ref(false);
const referrerError = ref("");

// Aadhaar
const aadhaarVerified = ref(false);
const aadhaarLoading = ref(false);
const aadhaarOtpSent = ref(false);
const aadhaarOtp = ref("");
const aadhaarError = ref("");
const aadhaarAddress = ref("");
const saveAsBilling = ref(false);

// PAN
const panVerified = ref(false);
const panLoading = ref(false);
const panError = ref("");
const panHolderName = ref("");

// Step errors
const step1Error = ref("");
const step2Error = ref("");
const step3Error = ref("");
const step4Error = ref("");

// const maskedAccount = computed(() => {
//   const acc = dist.value.bankAccount;
//   if (!acc || acc.length < 4) return acc;
//   return "•".repeat(acc.length - 4) + acc.slice(-4);
// });

function formatAadhaar() {
  let val = dist.value.aadhaar.replace(/\D/g, "").slice(0, 12);
  val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
  dist.value.aadhaar = val;
}

// ─── MOCK VERIFICATIONS ───

async function sendMobileOtp() {
  mobileOtpLoading.value = true;
  mobileError.value = "";
  // TODO: Replace with real API — await sendOtp({ mobile: dist.value.mobile })
  await new Promise(r => setTimeout(r, 800));
  mobileOtpSent.value = true;
  mobileOtpLoading.value = false;
}

async function verifyMobileOtp() {
  mobileError.value = "";
  // TODO: Replace with real API — await verifyOtp({ mobile, otp })
  await new Promise(r => setTimeout(r, 600));
  if (mobileOtp.value.length === 6) {
    mobileVerified.value = true;
    mobileOtpSent.value = false;
  } else {
    mobileError.value = "Incorrect OTP. Please try again.";
  }
}

async function verifyReferrer() {
  referrerLoading.value = true;
  referrerError.value = "";
  // TODO: Replace with real API — await checkReferrerId(dist.value.referrerId)
  await new Promise(r => setTimeout(r, 1200));
  if (dist.value.referrerId.trim().length > 4) {
    referrerVerified.value = true;
  } else {
    referrerError.value = "Referrer ID not found. Please check and try again.";
  }
  referrerLoading.value = false;
}

async function sendAadhaarOtp() {
  aadhaarLoading.value = true;
  aadhaarError.value = "";
  // TODO: Replace with real Aadhaar OTP API
  await new Promise(r => setTimeout(r, 1000));
  aadhaarOtpSent.value = true;
  aadhaarLoading.value = false;
}

async function verifyAadhaarOtp() {
  aadhaarError.value = "";
  // TODO: Replace with real Aadhaar verify API — response includes address
  await new Promise(r => setTimeout(r, 800));
  if (aadhaarOtp.value.length >= 4) {
    aadhaarVerified.value = true;
    aadhaarOtpSent.value = false;
    // TODO: Replace with actual address from API response
    aadhaarAddress.value = "12, Green Park Extension, New Delhi, Delhi - 110016";
  } else {
    aadhaarError.value = "Invalid OTP. Please try again.";
  }
}

async function verifyPan() {
  panLoading.value = true;
  panError.value = "";
  // TODO: Replace with real PAN verify API
  await new Promise(r => setTimeout(r, 1200));
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (panRegex.test(dist.value.pan)) {
    panVerified.value = true;
    panHolderName.value = dist.value.fullName || "Verified Account Holder";
  } else {
    panError.value = "Invalid PAN format. Please check and try again.";
  }
  panLoading.value = false;
}

// ─── STEP NAVIGATION ───

function validateStep1() {
  step1Error.value = "";
  if (!mobileVerified.value) { step1Error.value = "Please verify your mobile number first."; return false; }
  if (!referrerVerified.value) { step1Error.value = "Please verify your Referrer ID."; return false; }
  if (!dist.value.fullName.trim()) { step1Error.value = "Full name is required."; return false; }
  if (!dist.value.dob) { step1Error.value = "Date of birth is required."; return false; }
  if (!dist.value.password || dist.value.password.length < 8) { step1Error.value = "Password must be at least 8 characters."; return false; }
  if (dist.value.password !== dist.value.confirmPassword) { step1Error.value = "Passwords do not match."; return false; }
  return true;
}

function goToStep2() {
  if (!validateStep1()) return;
  stepCompleted.value[0] = true;
  distStep.value = 2;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToStep3() {
  step2Error.value = "";
  if (!aadhaarVerified.value) { step2Error.value = "Please complete Aadhaar verification."; return; }
  if (!panVerified.value) { step2Error.value = "Please verify your PAN before continuing."; return; }
  stepCompleted.value[1] = true;
  distStep.value = 3;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToStep4() {
  step3Error.value = "";
  if (!dist.value.bankAccountHolder.trim()) { step3Error.value = "Account holder name is required."; return; }
  if (!dist.value.bankAccount.trim()) { step3Error.value = "Account number is required."; return; }
  if (dist.value.bankAccount !== dist.value.bankAccountConfirm) { step3Error.value = "Account numbers do not match."; return; }
  if (!dist.value.ifsc.trim()) { step3Error.value = "IFSC code is required."; return; }
  bankSkipped.value = false;
  stepCompleted.value[2] = true;
  stepSkipped.value[2] = false;
  distStep.value = 4;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function confirmSkipBank() {
  showBankSkipDialog.value = false;
  bankSkipped.value = true;
  stepCompleted.value[2] = true;
  stepSkipped.value[2] = true;
  distStep.value = 4;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleDistributorSubmit() {
  step4Error.value = "";
  if (!agreedToTnc.value) { step4Error.value = "Please agree to the terms and conditions."; return; }
  if (!declaration.value.trim()) { step4Error.value = "Please type your declaration."; return; }
  if (declarationMismatch.value) { step4Error.value = "Your declaration text doesn't match. Please type the exact sentence shown."; return; }

  isSubmitting.value = true;

  // TODO: Replace with real registration API call
  // eslint-disable-next-line no-unused-vars
  const payload = {
    role: "distributor",
    referrerId: dist.value.referrerId,
    fullName: dist.value.fullName,
    mobile: dist.value.mobile,
    email: dist.value.email,
    dob: dist.value.dob,
    password: dist.value.password,
    aadhaar: dist.value.aadhaar.replace(/\s/g, ""),
    aadhaarVerified: aadhaarVerified.value,
    aadhaarAddress: aadhaarAddress.value,
    saveAsBilling: saveAsBilling.value,
    pan: dist.value.pan,
    panVerified: panVerified.value,
    bankDetails: bankSkipped.value ? null : {
      accountHolder: dist.value.bankAccountHolder,
      accountNumber: dist.value.bankAccount,
      ifsc: dist.value.ifsc,
    },
    bankPending: bankSkipped.value,
    declaration: declaration.value,
    agreedToTnc: agreedToTnc.value,
    domainName: window.location.host,
  };

  await new Promise(r => setTimeout(r, 1500)); // TODO: replace with await register(payload)

  // TODO: Replace with actual BA ID from API response
  generatedBAId.value = "BA-" + Math.floor(100000 + Math.random() * 900000);

  // TODO: Auto-login logic — after registration API returns token, call authStore.setToken(token)
  // then redirect to shop. For now we go directly to success screen and show Shop Now.

  isSubmitting.value = false;
  stepCompleted.value[3] = true;
  distStep.value = 5;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<style scoped>
.register-section {
  --cobalt: #003da5;
  --gold: #ffc72c;
  --charcoal: #333f48;
  --dark-blue: #0a2240;
  --pure-white: #ffffff;
  --light-gray-bg: #f9fafc;
  --soft-border: rgba(0, 61, 165, 0.08);
  --green: #16a34a;
  --red: #dc2626;
  --amber: #d97706;

  padding: 50px 0 60px;
  background: linear-gradient(180deg, var(--pure-white) 0%, var(--light-gray-bg) 100%);
  color: var(--charcoal);
  width: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--cobalt);
  margin-bottom: 24px;
  text-transform: uppercase;
}

.card-box {
  background: var(--pure-white);
  border: 1px solid var(--soft-border);
  border-radius: 20px;
  padding: 48px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(10, 34, 64, 0.02);
  position: relative;
}

.card-box::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 4px;
  border-radius: 20px 20px 0 0;
  background-color: var(--gold);
}

/* CUSTOMER FORM */
.role-form-title { margin: 0 0 22px; color: var(--dark-blue); font-size: 20px; font-weight: 700; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 32px;
}

.form-group { margin-bottom: 0; }
.form-group.full-span { grid-column: 1 / -1; }

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--dark-blue);
  letter-spacing: 0.2px;
}

.optional-label {
  font-size: 12px;
  font-weight: 500;
  color: #8a94a6;
  margin-left: 4px;
}

.form-group input,
.form-group textarea {
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
  font-family: inherit;
}

.form-group textarea {
  height: auto;
  padding: 14px 20px;
  resize: none;
}

.form-group input:focus,
.form-group textarea:focus {
  background: var(--pure-white);
  border-color: var(--cobalt);
  box-shadow: 0 0 0 4px rgba(0, 61, 165, 0.08);
}

.input-verified {
  border-color: var(--green) !important;
  background: #f0fdf4 !important;
}

.input-error {
  border-color: var(--red) !important;
  background: #fff5f5 !important;
}

.bank-pending-item {
  color: var(--amber) !important;
}

.password-wrapper { position: relative; }
.password-wrapper input { padding-right: 52px; }

.password-visibility-btn {
  position: absolute;
  right: 16px; top: 50%;
  transform: translateY(-50%);
  border: none; background: transparent;
  cursor: pointer; padding: 0; line-height: 1;
}

.password-visibility-btn i { color: #8a94a6; font-size: 18px; transition: color 0.2s; }
.password-visibility-btn:hover i { color: var(--cobalt); }

/* WIZARD PROGRESS */
.wizard-progress {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  margin-bottom: 36px;
  padding: 20px 0 8px;
}

.wizard-progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.wizard-step-dot {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 2px solid #d1dbe8;
  background: var(--pure-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  transition: all 0.3s;
  z-index: 1;
}

.wizard-step-dot.active {
  border-color: var(--cobalt);
  color: var(--cobalt);
  box-shadow: 0 0 0 4px rgba(0, 61, 165, 0.1);
}

.wizard-step-dot.completed {
  border-color: var(--green);
  background: var(--green);
  color: var(--pure-white);
}

.wizard-step-dot.skipped {
  border-color: var(--amber);
  background: #fffbeb;
  color: var(--amber);
}

.wizard-step-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 8px;
  text-align: center;
  transition: color 0.3s;
}

.wizard-step-label.active { color: var(--cobalt); }
.wizard-step-label.completed { color: var(--green); }
.wizard-step-label.skipped { color: var(--amber); }

.wizard-step-line {
  position: absolute;
  top: 19px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #d1dbe8;
  z-index: 0;
  transition: background 0.3s;
}

.wizard-step-line.active { background: var(--green); }
.wizard-step-line.skipped { background: var(--amber); }

/* STEP CONTENT */
.wizard-step-content { animation: fadeIn 0.3s ease; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

.step-header { margin-bottom: 28px; }
.step-title { margin: 0 0 6px; font-size: 22px; font-weight: 800; color: var(--dark-blue); }
.step-subtitle { margin: 0; font-size: 14px; color: #5f6f85; }

/* INPUT + VERIFY ROW */
.input-verify-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-verify-row input {
  flex: 1;
  height: 54px;
  padding: 0 16px;
  font-size: 15px;
  color: var(--charcoal);
  border: 1px solid rgba(10, 34, 64, 0.12);
  border-radius: 12px;
  background: var(--light-gray-bg);
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.input-verify-row input:focus {
  background: var(--pure-white);
  border-color: var(--cobalt);
  box-shadow: 0 0 0 3px rgba(0, 61, 165, 0.08);
}

.verify-btn {
  white-space: nowrap;
  height: 44px;
  padding: 0 20px;
  background: var(--cobalt);
  color: var(--pure-white);
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.verify-btn:hover:not(:disabled) { background: #0033a0; }
.verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.verify-btn.small { height: 38px; padding: 0 14px; font-size: 12px; }

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--green);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.verified-badge i { font-size: 18px; }

.otp-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.otp-input {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  font-size: 18px;
  letter-spacing: 4px;
  text-align: center;
  border: 1px solid rgba(0, 61, 165, 0.3);
  border-radius: 10px;
  background: #f0f6ff;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.otp-input:focus { border-color: var(--cobalt); box-shadow: 0 0 0 3px rgba(0, 61, 165, 0.08); }

.resend-btn {
  background: transparent;
  border: 1px solid rgba(0, 61, 165, 0.3);
  color: var(--cobalt);
  border-radius: 8px;
  padding: 0 14px;
  height: 38px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

/* SECTION DIVIDER */
.section-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 20px;
}

.section-divider::before,
.section-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(0, 61, 165, 0.1);
}

.section-divider span {
  font-size: 12px;
  font-weight: 800;
  color: var(--cobalt);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
}

/* AADHAAR ADDRESS BOX */
.aadhaar-address-box {
  margin-top: 16px;
  border: 1px solid rgba(22, 163, 74, 0.25);
  border-radius: 12px;
  background: #f0fdf4;
  padding: 16px;
}

.aadhaar-address-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
  color: var(--green);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.aadhaar-address-text {
  margin: 0 0 14px;
  font-size: 14px;
  color: var(--dark-blue);
  font-weight: 500;
}

.save-label {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--dark-blue);
}

.checkbox-row { display: flex; gap: 20px; flex-wrap: wrap; }

.check-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--dark-blue);
  cursor: pointer;
}

.check-option input[type="checkbox"] {
  width: 18px; height: 18px;
  accent-color: var(--cobalt);
  cursor: pointer;
}

/* SLIDE TRANSITION */
.slide-down-enter-active { transition: all 0.35s ease; }
.slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-10px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

/* PAN VERIFIED BOX */
.verified-info-box {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(22, 163, 74, 0.25);
  border-radius: 12px;
  background: #f0fdf4;
  padding: 14px 18px;
  margin-top: 14px;
}

.verified-info-box i { font-size: 28px; color: var(--green); flex-shrink: 0; }
.verified-info-name { margin: 0; font-size: 15px; font-weight: 700; color: var(--dark-blue); }
.verified-info-sub { margin: 4px 0 0; font-size: 13px; color: var(--green); font-weight: 600; }

/* SKIP NOTICE */
.skip-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fffbeb;
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #92400e;
  font-weight: 500;
}

.skip-notice i { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

/* STEP ACTIONS */
.step-actions { margin-top: 32px; }

.step-actions.two-col {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.right-actions { display: flex; gap: 10px; align-items: center; }

.next-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  padding: 0 32px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  background: #ffc72c;
  border: 2px solid #ffc72c;
  color: #0a2240;
  font-size: 15px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.next-btn:hover:not(:disabled) {
  background: #003da5;
  border-color: #003da5;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 61, 165, 0.3);
  transform: translateY(-1px);
}

.next-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background: transparent;
  color: #5a6b82;
  border: 1.5px solid #d1dbe8;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.back-btn:hover { border-color: var(--cobalt); color: var(--cobalt); }

.do-later-btn {
  background: transparent;
  color: #5a6b82;
  border: 1.5px solid #d1dbe8;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  padding: 0 20px;
  height: 44px;
  transition: all 0.2s;
}

.do-later-btn:hover { border-color: var(--amber); color: var(--amber); }

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 36px;
  background: linear-gradient(135deg, var(--gold) 0%, #f5b000 100%);
  color: var(--dark-blue);
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  box-shadow: 0 8px 20px rgba(255, 199, 44, 0.2);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 199, 44, 0.3);
}

.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* SUMMARY GRID */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.summary-card {
  border: 1px solid #dce7f6;
  border-radius: 14px;
  background: #fafcff;
  padding: 16px;
}

.summary-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf2f7;
  font-size: 13px;
  font-weight: 800;
  color: var(--cobalt);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.summary-card-header i { font-size: 16px; }

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px solid #f0f4fa;
}

.summary-row:last-child { border-bottom: none; }
.summary-row span { color: #5a6b82; flex-shrink: 0; }
.summary-row strong { color: var(--dark-blue); text-align: right; word-break: break-word; }

.address-row strong { font-size: 12px; max-width: 60%; }

.status-ok { color: var(--green) !important; display: inline-flex; align-items: center; gap: 4px; }
.status-pending { color: var(--amber) !important; display: inline-flex; align-items: center; gap: 4px; }
.status-warn { color: var(--amber) !important; display: inline-flex; align-items: center; gap: 4px; }

/* T&C */
.tnc-box {
  border: 1px solid #dce7f6;
  border-radius: 14px;
  background: #fafcff;
  padding: 20px;
  margin-bottom: 20px;
}

.tnc-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 800;
  color: var(--dark-blue);
}

.tnc-scroll {
  max-height: 180px;
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #344760;
  line-height: 1.7;
}

.tnc-scroll p { margin: 0 0 10px; }
.tnc-scroll ol { margin: 0; padding-left: 20px; }
.tnc-scroll li { margin-bottom: 8px; }

.tnc-scroll::-webkit-scrollbar { width: 4px; }
.tnc-scroll::-webkit-scrollbar-track { background: #f0f4fa; border-radius: 4px; }
.tnc-scroll::-webkit-scrollbar-thumb { background: #d1dbe8; border-radius: 4px; }

.tnc-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-blue);
  cursor: pointer;
  padding: 12px;
  border-radius: 10px;
  background: rgba(0, 61, 165, 0.04);
  border: 1px solid rgba(0, 61, 165, 0.1);
  margin-bottom: 16px;
}

.tnc-check input[type="checkbox"] {
  width: 18px; height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
  accent-color: var(--cobalt);
  cursor: pointer;
}

.declaration-prompt { margin-top: 4px; }

.declaration-instruction {
  font-size: 13px;
  color: #344760;
  margin: 0 0 10px;
  line-height: 1.6;
}

.declaration-expected {
  display: inline-block;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--cobalt);
  background: rgba(0, 61, 165, 0.05);
  border: 1px dashed rgba(0, 61, 165, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  font-style: italic;
}

.declaration-textarea {
  width: 100%;
  height: 90px;
  padding: 14px 20px;
  font-size: 14px;
  color: var(--charcoal);
  border: 1px solid rgba(10, 34, 64, 0.12);
  border-radius: 12px;
  background: var(--light-gray-bg);
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  font-family: inherit;
  resize: none;
}

.declaration-textarea:focus {
  background: var(--pure-white);
  border-color: var(--cobalt);
  box-shadow: 0 0 0 3px rgba(0, 61, 165, 0.08);
}

/* SUCCESS */
.success-state {
  text-align: center;
  padding: 32px 0;
}

.success-icon { font-size: 64px; color: var(--green); margin-bottom: 16px; line-height: 1; }
.success-state h3 { margin: 0 0 12px; font-size: 26px; font-weight: 800; color: var(--dark-blue); }
.success-state > p { color: #5a6b82; font-size: 15px; line-height: 1.7; max-width: 520px; margin: 0 auto 28px; }

.success-cards-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.success-summary-card {
  border: 1px solid #dce7f6;
  border-radius: 14px;
  background: #fafcff;
  padding: 20px 24px;
  min-width: 240px;
  flex: 1;
  max-width: 320px;
  text-align: left;
}

.success-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  color: var(--cobalt);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf2f7;
}

.success-check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  padding: 5px 0;
}

.success-check-item i { font-size: 18px; flex-shrink: 0; }
.success-check-item.ok { color: var(--green); }

.ba-note {
  margin: 12px 0 0;
  font-size: 12px;
  color: #5a6b82;
  line-height: 1.6;
  padding: 10px 12px;
  background: rgba(0, 61, 165, 0.04);
  border-radius: 8px;
  border-left: 3px solid var(--cobalt);
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.ba-note i { flex-shrink: 0; margin-top: 1px; color: var(--cobalt); }

.shop-now-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 56px;
  padding: 0 48px;
  background: linear-gradient(135deg, var(--gold) 0%, #f5b000 100%);
  color: var(--dark-blue);
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(255, 199, 44, 0.25);
  transition: all 0.3s;
  letter-spacing: 0.2px;
}

.shop-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(255, 199, 44, 0.35);
}

/* BANK SKIP DIALOG */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 34, 64, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.dialog-box {
  background: var(--pure-white);
  border-radius: 18px;
  padding: 32px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 24px 60px rgba(10, 34, 64, 0.15);
  text-align: center;
  animation: dialogIn 0.25s ease;
}

@keyframes dialogIn {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.dialog-icon { font-size: 48px; color: var(--amber); margin-bottom: 12px; line-height: 1; }
.dialog-title { margin: 0 0 10px; font-size: 20px; font-weight: 800; color: var(--dark-blue); }
.dialog-body { margin: 0 0 24px; font-size: 14px; color: #5a6b82; line-height: 1.7; }

.dialog-actions { display: flex; gap: 10px; justify-content: center; }

.dialog-cancel-btn {
  height: 44px;
  padding: 0 24px;
  background: transparent;
  border: 1.5px solid #d1dbe8;
  color: #5a6b82;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.dialog-cancel-btn:hover { border-color: var(--cobalt); color: var(--cobalt); }

.dialog-ok-btn {
  height: 44px;
  padding: 0 24px;
  background: #003da5;
  border: none;
  color: var(--pure-white);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.dialog-ok-btn:hover { background: #003da5; }

/* FIELD HELPERS */
.required { color: var(--red); }
.field-error { margin: 6px 0 0; font-size: 12px; color: var(--red); font-weight: 600; }
.field-success { margin: 6px 0 0; font-size: 12px; color: var(--green); font-weight: 600; }
.field-hint { margin: 6px 0 0; font-size: 12px; color: #8a94a6; }
.step-error { margin: 16px 0 0; font-size: 13px; color: var(--red); font-weight: 700; padding: 10px 14px; background: #fff5f5; border-radius: 8px; border-left: 3px solid var(--red); }

.identity-fields { margin-top: 8px; }

/* REGISTER BUTTON (customer) */
.register-btn {
  margin-top: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  padding: 0 48px;
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
  font-family: inherit;
}

.register-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(255, 199, 44, 0.28); }
.register-btn:disabled { opacity: 0.6; background: #e2e8f0; color: #94a3b8; box-shadow: none; cursor: not-allowed; }

.toast {
  margin-top: 24px;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.toast.success { background: #f0fdf4; color: var(--green); border-left: 3px solid var(--green); }
.toast.error { background: #fef2f2; color: var(--red); border-left: 3px solid var(--red); }

/* RESPONSIVE */
@media (max-width: 768px) {
  .register-section { padding: 40px 0; }
  .container { padding: 0 16px; }
  .title { font-size: 26px; margin-bottom: 20px; }
  .card-box { padding: 24px 18px; }
  .form-grid { grid-template-columns: 1fr; gap: 18px; }
  .summary-grid { grid-template-columns: 1fr; }
  .step-actions.two-col { flex-direction: column; align-items: stretch; }
  .right-actions { flex-direction: column; }
  .next-btn, .back-btn, .submit-btn, .do-later-btn { width: 100%; justify-content: center; }
  .wizard-step-label { font-size: 10px; }
  .otp-row { flex-wrap: wrap; }
  .checkbox-row { flex-direction: column; gap: 10px; }
  .register-btn { width: 100%; margin-top: 28px; }
  .success-cards-row { flex-direction: column; align-items: center; }
  .success-summary-card { max-width: 100%; width: 100%; }
  .shop-now-btn { width: 100%; }
  .dialog-actions { flex-direction: column; }
  .dialog-cancel-btn, .dialog-ok-btn { width: 100%; }
}

@media (max-width: 480px) {
  .title { font-size: 22px; }
  .card-box { border-radius: 16px; padding: 20px 16px; }
  .wizard-progress { gap: 0; }
  .step-title { font-size: 18px; }
  .wizard-step-line { width: 100%; }
}
</style>