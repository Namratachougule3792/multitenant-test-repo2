export default defineEventHandler((event) => {
  const query = getQuery(event)

  const tenantId = query.tenantId || 'unknown'
  const app = query.app || 'gurukul-os'

  const logMessage = `[LOG]: tenant=${tenantId} app=${app} "This is a test log"`

  console.log(logMessage)

  return {
    success: true,
    tenantId,
    app,
    message: 'Log captured successfully'
  }
})
