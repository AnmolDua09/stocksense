import express from 'express'
import axios from 'axios'
import { redis } from '../config/redis.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const ML_URL = process.env.ML_URL || 'http://localhost:8000'

router.get('/quote/:symbol', protect, async (req, res) => {
  try {
    const { symbol } = req.params
    const cached = await redis.get(`quote:${symbol}`)
    if (cached) return res.json(JSON.parse(cached))
    const { data } = await axios.get(`${ML_URL}/quote/${symbol}`)
    await redis.setex(`quote:${symbol}`, 60, JSON.stringify(data))
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/history/:symbol', protect, async (req, res) => {
  try {
    const { symbol } = req.params
    const { period = '1mo' } = req.query
    const cached = await redis.get(`history:${symbol}:${period}`)
    if (cached) return res.json(JSON.parse(cached))
    const { data } = await axios.get(`${ML_URL}/history/${symbol}?period=${period}`)
    await redis.setex(`history:${symbol}:${period}`, 300, JSON.stringify(data))
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/predict/:symbol', protect, async (req, res) => {
  try {
    const { symbol } = req.params
    const cached = await redis.get(`predict:${symbol}`)
    if (cached) return res.json(JSON.parse(cached))
    const { data } = await axios.get(`${ML_URL}/predict/${symbol}`)
    await redis.setex(`predict:${symbol}`, 3600, JSON.stringify(data))
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router

router.get('/sentiment/:symbol', protect, async (req, res) => {
  try {
    const { symbol } = req.params
    const cached = await redis.get(`sentiment:${symbol}`)
    if (cached) return res.json(JSON.parse(cached))
    const { data } = await axios.get(`${ML_URL}/sentiment/${symbol}`)
    await redis.setex(`sentiment:${symbol}`, 1800, JSON.stringify(data))
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
