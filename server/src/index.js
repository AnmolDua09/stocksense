import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import { connectRedis } from './config/redis.js'
import authRoutes from './routes/auth.js'
import stockRoutes from './routes/stocks.js'
import portfolioRoutes from './routes/portfolio.js'
import tradeRoutes from './routes/trades.js'
import { initSocket } from './socket/priceSocket.js'

dotenv.config()
const app = express()
app.set('trust proxy', 1)
const server = http.createServer(app)

const allowedOrigins = [
  'http://localhost:5173',
  'https://stocksense-seven-zeta.vercel.app'
]

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] }
})

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/stocks', stockRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/trades', tradeRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

initSocket(io)

const start = async () => {
  await connectDB()
  await connectRedis()
  server.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`))
}
start()
