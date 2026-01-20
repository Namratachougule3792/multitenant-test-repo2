export default defineEventHandler((event) => {
  const query = getQuery(event)

  // Read inputs from frontend
  const tenantId = query.tenantId || 'unknown'
  const app = query.app || 'gurukul-os'

  /**
   * CloudWatch Embedded Metrics Format (EMF)
   * This will automatically create:
   * Namespace: GurukulOS
   * Metric: Usage
   * Dimensions: tenant, app
   */
  console.log(JSON.stringify({
    _aws: {
      Timestamp: Date.now(),
      CloudWatchMetrics: [
        {
          Namespace: "GurukulOS",
          Dimensions: [["tenant", "app"]],
          Metrics: [
            {
              Name: "Usage",
              Unit: "Count"
            }
          ]
        }
      ]
    },
    tenant: tenantId,
    app: app,
    Usage: 1
  }))

  return {
    success: true,
    tenantId,
    app,
    message: 'Usage logged successfully'
  }
})
