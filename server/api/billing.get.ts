import AWS from 'aws-sdk'
import { defineEventHandler, getQuery } from 'h3'

// CloudWatch client
const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION || 'ap-south-1'
})

// Pricing rule (PoC)
const COST_PER_HIT = 0.10

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // Example: ?month=2026-01
    const month = (query.month as string) || '2026-01'

    // Calculate month range safely
    const startTime = new Date(`${month}-01T00:00:00Z`)
    const endTime = new Date(startTime)
    endTime.setMonth(endTime.getMonth() + 1)

    // Fetch all metrics under the namespace
    const metricsResponse = await cloudwatch
      .listMetrics({
        Namespace: 'Multi-Tenant'
      })
      .promise()

    const billingResults: {
      tenantId: string
      appName: string
      usage: number
      amount: number
    }[] = []

    // To avoid duplicate tenant-app rows
    const seen = new Set<string>()

    for (const metric of metricsResponse.Metrics || []) {
      const tenantId = metric.Dimensions?.find(d => d.Name === 'tenant')?.Value
      const appName  = metric.Dimensions?.find(d => d.Name === 'app')?.Value

      if (!tenantId || !appName || !metric.MetricName) continue

      const key = `${tenantId}-${appName}`
      if (seen.has(key)) continue
      seen.add(key)

      // Fetch monthly usage
      const usageResponse = await cloudwatch
        .getMetricStatistics({
          Namespace: 'Multi-Tenant',
          MetricName: metric.MetricName,
          Dimensions: metric.Dimensions,
          StartTime: startTime,
          EndTime: endTime,
          Period: 2592000, // ~30 days
          Statistics: ['Sum']
        })
        .promise()

      const usage = usageResponse.Datapoints?.[0]?.Sum || 0
      const amount = usage * COST_PER_HIT

      billingResults.push({
        tenantId,
        appName,
        usage,
        amount
      })
    }

    // Final response
    return {
      month,
      currency: 'INR',
      pricing: {
        perHit: COST_PER_HIT
      },
      billing: billingResults
    }

  } catch (error: any) {
    console.error('Billing API error:', error)

    return {
      statusCode: 500,
      message: 'Billing calculation failed',
      error: error.message
    }
  }
})
