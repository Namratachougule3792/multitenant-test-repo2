<template>
  <div class="card">
    <h2>Send Test Log</h2>

    <input
      v-model="tenantId"
      type="text"
      placeholder="Enter Tenant ID"
      class="input"
    />

    <button @click="submitLog" class="button">
      Send Log
    </button>

    <p v-if="successMessage" class="success">
      {{ successMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tenantId = ref('')
const successMessage = ref('')

function submitLog() {
  if (!tenantId.value) {
    successMessage.value = 'Please enter tenantId'
    return
  }

  // TEMP frontend-only success
  successMessage.value = `Log submitted successfully for tenant: ${tenantId.value}`

  // clear input
  tenantId.value = ''
}
</script>

<style scoped>
.card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.input {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  margin-bottom: 12px;
}

.button {
  width: 100%;
  padding: 10px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success {
  margin-top: 12px;
  color: green;
}
</style>
