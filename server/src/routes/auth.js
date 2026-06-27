import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Otp from '../models/Otp.js'
import { sendOtpEmail } from '../config/email.js'
import { loginLimiter, otpLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

const isStrongPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

// Step 1: Register - sends OTP, doesn't create user yet
router.post('/register/send-otp', otpLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters with uppercase, lowercase, and a number'
      })
    }

    const otp = generateOtp()
    await Otp.deleteMany({ email: normalizedEmail }) // clear old OTPs
    await Otp.create({ email: normalizedEmail, code: otp })
    await sendOtpEmail(normalizedEmail, otp)

    res.json({ message: 'OTP sent to your email', email: normalizedEmail })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Step 2: Verify OTP and create account
router.post('/register/verify', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body
    const normalizedEmail = email.toLowerCase().trim()

    const validOtp = await Otp.findOne({ email: normalizedEmail, code: otp })
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name, email: normalizedEmail, password: hash, isVerified: true
    })
    await Otp.deleteMany({ email: normalizedEmail })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, virtualBalance: user.virtualBalance }
    })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, virtualBalance: user.virtualBalance }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
