<template>
  <div class="card">
    <h2>Send Test Log</h2>

    <!-- Tenant ID input -->
    <input
      v-model="tenantId"
      type="text"
      placeholder="Enter Tenant ID"
      class="input"
    />

    <!-- App selector -->
    <select v-model="selectedApp" class="input">
      <option value="funds-admission">funds-admission</option>
      <option value="attendance">attendance</option>
      <option value="identity-provider">identity-provider</option>
      <option value="billing">billing</option>
    </select>

    <!-- Submit button -->
    <button @click="submitLog" class="button">
      Send Log
    </button>

    <!-- Success message -->
    <p v-if="successMessage" class="success">
      {{ successMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tenantId = ref('')
const selectedApp = ref('funds-admission')
const successMessage = ref('')

async function submitLog() {
  if (!tenantId.value) {
    successMessage.value = 'Please enter tenantId'
    return
  }

  try {
    const response = await fetch(
      `/api/log?tenantId=${tenantId.value}&app=${selectedApp.value}`
    )

    const data = await response.json()

    successMessage.value = `Log submitted for tenant ${data.tenantId} using app ${data.app}`

    tenantId.value = ''
  } catch (error) {
    successMessage.value = 'Failed to send log'
  }
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
