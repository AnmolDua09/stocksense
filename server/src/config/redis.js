import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = new Redis(redisUrl, {
  tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  maxRetriesPerRequest: 3
})

export const connectRedis = async () => {
  redis.on('connect', () => console.log('Redis connected'))
  redis.on('error', (err) => console.error('Redis error:', err.message))
}
