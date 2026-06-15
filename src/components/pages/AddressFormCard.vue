<template>
  <div v-if="show" class="address-form-card">
    <p class="mode-label">{{ modeLabel }}</p>

    <p class="form-section-label">Address Type</p>
    <div class="addr-type-group">
      <button
        v-for="type in addressTypes"
        :key="type.value"
        type="button"
        class="addr-type-btn"
        :class="{ active: form.addressType === type.value }"
        @click="$emit('update-field', 'addressType', type.value)"
      >
        <i :class="type.icon"></i>
        {{ type.label }}
      </button>
    </div>

    <p class="form-section-label">Contact Details</p>
    <div class="address-form-grid">
      <div class="field-group">
        <label>Full Name</label>
        <input
          :value="form.fullName"
          type="text"
          placeholder="John Doe"
          @input="$emit('update-field', 'fullName', $event.target.value)"
        />
      </div>
      <div class="field-group">
        <label>Phone Number</label>
        <input
          :value="form.phone"
          type="text"
          placeholder="+91 98765 43210"
          @input="$emit('update-field', 'phone', $event.target.value)"
        />
      </div>
      <!-- <div class="field-group full-span">
        <label>Email</label>
        <input
          :value="form.email"
          type="email"
          placeholder="john@example.com"
          @input="$emit('update-field', 'email', $event.target.value)"
        />
      </div> -->
    </div>

    <p class="form-section-label">Address Details</p>
    <div class="address-form-grid">
      <div class="field-group full-span">
        <label>Address Line</label>
        <textarea
          :value="form.addressLine"
          rows="2"
          placeholder="House no., Street, Area"
          @input="$emit('update-field', 'addressLine', $event.target.value)"
        ></textarea>
      </div>
      <div class="field-group">
        <label>City</label>
        <input
          :value="form.city"
          type="text"
          placeholder="Mumbai"
          @input="$emit('update-field', 'city', $event.target.value)"
        />
      </div>
      <div class="field-group">
        <label>State</label>
        <input
          :value="form.state"
          type="text"
          placeholder="Maharashtra"
          @input="$emit('update-field', 'state', $event.target.value)"
        />
      </div>
      <div class="field-group">
        <label>Pincode</label>
        <input
          :value="form.pincode"
          type="text"
          placeholder="400001"
          @input="$emit('update-field', 'pincode', $event.target.value)"
        />
      </div>
    </div>

    <p v-if="errorMessage" class="small-error">{{ errorMessage }}</p>

    <div class="address-form-actions">
      <button type="button" class="ghost-btn" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="button" class="primary-btn" @click="$emit('submit')">
        {{ isEditing ? "Update Address" : "Save Address" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  show: { type: Boolean, default: false },
  form: { type: Object, required: true },
  addressTypes: { type: Array, default: () => [] },
  errorMessage: { type: String, default: "" },
  isEditing: { type: Boolean, default: false },
  modeLabel: { type: String, default: "Add New Address" },
});

defineEmits(["cancel", "submit", "update-field"]);
</script>

<style scoped>
.address-form-card {
  border: 1px solid rgba(0, 61, 165, 0.2);
  border-radius: 16px;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mode-label {
  margin: 0 0 2px;
  font-size: 13px;
  font-weight: 800;
  color: #0a2240;
}

.form-section-label {
  margin: 10px 0 8px;
  font-size: 11px;
  font-weight: 800;
  color: #003da5;
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.addr-type-group {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.addr-type-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #d1dbe8;
  background: #f8fafc;
  color: #5a6b82;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}

.addr-type-btn.active {
  border-color: #003da5;
  background: rgba(0, 61, 165, 0.06);
  color: #003da5;
}

.address-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 4px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-group.full-span {
  grid-column: 1 / -1;
}

.field-group label {
  font-size: 12px;
  font-weight: 700;
  color: #0a2240;
  letter-spacing: 0.2px;
}

.field-group input,
.field-group textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  color: #1e324c;
  border: 1px solid rgba(10, 34, 64, 0.12);
  border-radius: 10px;
  background: #f9fafc;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;
  font-family: inherit;
  resize: none;
}

.field-group input:focus,
.field-group textarea:focus {
  background: #fff;
  border-color: #003da5;
  box-shadow: 0 0 0 3px rgba(0, 61, 165, 0.09);
}

.address-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.small-error {
  margin: 4px 0 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
}

.ghost-btn {
  border: 1px solid #d1dbe8;
  background: #fff;
  color: #344760;
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.primary-btn {
  border: none;
  background: #003da5;
  color: #fff;
  border-radius: 999px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.primary-btn:hover {
  background: #0033a0;
}

@media (max-width: 600px) {
  .address-form-grid {
    grid-template-columns: 1fr;
  }

  .addr-type-group {
    flex-wrap: wrap;
  }
}
</style>
