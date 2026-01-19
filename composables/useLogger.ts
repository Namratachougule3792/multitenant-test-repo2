export const useLogger = () => {
  const logTenantActivity = async (tenantId: string, message: string) => {
    const url = `/api/log?tenantId=${tenantId}`

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
  }

  return { logTenantActivity }
}
