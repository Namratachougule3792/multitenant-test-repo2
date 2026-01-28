<template>
  <div class="page">
    <h1> Tenant Billing Dashboard</h1>

    <!-- Month selector -->
    <div class="controls">
      <label>Select Month:</label>
      <input type="month" v-model="month" @change="fetchBilling" />
    </div>

    <p v-if="loading">Loading billing data...</p>

    <table v-if="billing.length">
      <thead>
        <tr>
          <th>Tenant</th>
          <th>App</th>
          <th>Usage</th>
          <th>Cost (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in billing" :key="index">
          <td>{{ row.tenantId }}</td>
          <td>{{ row.appName }}</td>
          <td>{{ row.usage }}</td>
          <td>{{ row.amount.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="billing.length" class="summary">
      <h3>Total Cost: ₹{{ totalCost.toFixed(2) }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const month = ref(new Date().toISOString().slice(0, 7))
const billing = ref([])
const loading = ref(false)

async function fetchBilling() {
  loading.value = true
  const res = await fetch(`/api/billing?month=${month.value}`)
  const data = await res.json()
  billing.value = data.billing || []
  loading.value = false
}

const totalCost = computed(() =>
  billing.value.reduce((sum, r) => sum + r.amount, 0)
)

onMounted(fetchBilling)
</script>

<style scoped>
.page {
  padding: 24px;
  max-width: 900px;
  margin: auto;
}

.controls {
  margin-bottom: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background: #f3f4f6;
}

.summary {
  margin-top: 16px;
  font-size: 18px;
  font-weight: bold;
}
</style>
