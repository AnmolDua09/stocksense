import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'
import Trade from '../models/Trade.js'
import Holding from '../models/Holding.js'
import axios from 'axios'

const router = express.Router()
const ML_URL = process.env.ML_URL || 'http://localhost:8000'

router.post('/buy', protect, async (req, res) => {
  try {
    const { symbol, quantity } = req.body
    const { data } = await axios.get(`${ML_URL}/quote/${symbol}`)
    const price = data.price
    const total = price * quantity
    const user = await User.findById(req.user.id)
    if (user.virtualBalance < total)
      return res.status(400).json({ message: 'Insufficient virtual balance' })
    user.virtualBalance -= total
    await user.save()
    await Trade.create({ user: req.user.id, symbol, type: 'buy', quantity, price, total })
    const holding = await Holding.findOne({ user: req.user.id, symbol })
    if (holding) {
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + total) / (holding.quantity + quantity)
      holding.quantity += quantity
      await holding.save()
    } else {
      await Holding.create({ user: req.user.id, symbol, quantity, avgPrice: price })
    }
    res.json({ message: 'Buy successful', balance: user.virtualBalance, price, total })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/sell', protect, async (req, res) => {
  try {
    const { symbol, quantity } = req.body
    const holding = await Holding.findOne({ user: req.user.id, symbol })
    if (!holding || holding.quantity < quantity)
      return res.status(400).json({ message: 'Insufficient holdings' })
    const { data } = await axios.get(`${ML_URL}/quote/${symbol}`)
    const price = data.price
    const total = price * quantity
    const user = await User.findById(req.user.id)
    user.virtualBalance += total
    await user.save()
    await Trade.create({ user: req.user.id, symbol, type: 'sell', quantity, price, total })
    holding.quantity -= quantity
    if (holding.quantity === 0) await holding.deleteOne()
    else await holding.save()
    res.json({ message: 'Sell successful', balance: user.virtualBalance, price, total })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/history', protect, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50)
    res.json(trades)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
