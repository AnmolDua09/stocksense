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
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(cors())
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
  server.listen(process.env.PORT || 5001, () => console.log(`Server running on port ${process.env.PORT || 5001}`))
}
start()
