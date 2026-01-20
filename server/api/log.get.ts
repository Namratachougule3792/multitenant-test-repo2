export default defineEventHandler((event) => {
  const query = getQuery(event)

  const tenantId = query.tenantId || 'unknown'
  const app = query.app || 'unknown'

  const logPayload = {
    type: 'TENANT_USAGE',
    tenant: tenantId,
    app: app,
    message: 'This is a test log'
  }

  console.log(JSON.stringify(logPayload))

  return {
    success: true,
    tenantId,
    app
  }
})
