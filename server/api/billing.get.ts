import AWS from 'aws-sdk'
import { defineEventHandler, getQuery } from 'h3'

const cloudwatch = new AWS.CloudWatch({
  region: process.env.AWS_REGION || 'ap-south-1'
})

// Pricing rule (PoC)
const COST_PER_HIT = 0.10

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Example: ?month=2026-01
  const month = (query.month as string) || '2026-01'

  const startTime = new Date(`${month}-01T00:00:00Z`)
  const endTime = new Date(`${month}-31T23:59:59Z`)

  //  Get all tenant–app metrics
  const metricsResponse = await cloudwatch
    .listMetrics({
      Namespace: 'Multi-Tenant'
    })
    .promise()

  const billingResults: any[] = []

  //  Loop over each tenant–app pair
  for (const metric of metricsResponse.Metrics || []) {
    const tenantId = metric.Dimensions?.find(d => d.Name === 'tenantId')?.Value
    const appName = metric.Dimensions?.find(d => d.Name === 'appName')?.Value

    if (!tenantId || !appName) continue

    //  Read usage for this tenant–app
    const usageResponse = await cloudwatch
      .getMetricStatistics({
        Namespace: 'Multi-Tenant',
        MetricName: metric.MetricName,
        Dimensions: metric.Dimensions,
        StartTime: startTime,
        EndTime: endTime,
        Period: 2592000, // 30 days
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

  //  Return billing summary
  return {
    month,
    currency: 'INR',
    pricing: {
      perHit: COST_PER_HIT
    },
    billing: billingResults
  }
})
