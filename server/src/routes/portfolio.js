import express from 'express'
import { protect } from '../middleware/auth.js'
import Holding from '../models/Holding.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const [holdings, user] = await Promise.all([
      Holding.find({ user: req.user.id }),
      User.findById(req.user.id).select('virtualBalance name email')
    ])
    res.json({ holdings, virtualBalance: user.virtualBalance, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
