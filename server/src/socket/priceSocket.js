import axios from 'axios'

const ML_URL = process.env.ML_URL || 'http://localhost:8000'
const watchlist = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META']

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    socket.on('subscribe', (symbol) => socket.join(symbol))
    socket.on('unsubscribe', (symbol) => socket.leave(symbol))
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
  })

  setInterval(async () => {
    for (const symbol of watchlist) {
      try {
        const { data } = await axios.get(`${ML_URL}/quote/${symbol}`)
        io.to(symbol).emit('price', { symbol, ...data })
      } catch {}
    }
  }, 5000)
}
