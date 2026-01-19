export default defineEventHandler((event) => {
  const query = getQuery(event)
  const tenantId = query.tenantId || 'unknown'

  const logMessage = `[LOG]: tenant=${tenantId} "This is a test log"`

  console.log(logMessage)

  return {
    success: true,
    tenantId,
    message: 'Log captured successfully'
  }
})
