// Rate limiting with Upstash Redis
// Falls back gracefully if Upstash is not configured

let ratelimit: any = null

async function getRatelimit() {
  if (ratelimit) return ratelimit
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(10, '60 s'),
  })
  return ratelimit
}

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; remaining?: number }> {
  const rl = await getRatelimit()
  if (!rl) return { success: true } // Si no está configurado, permite todo

  const result = await rl.limit(identifier)
  return { success: result.success, remaining: result.remaining }
}
