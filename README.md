# 📈 StockSense — Real-time Stock Analytics & Virtual Trading

A full-stack SaaS application for real-time stock market analytics, ML-powered price predictions, and virtual paper trading.

## 🚀 Features

- 🔐 JWT Authentication (register/login)
- 📊 Real-time stock price updates (auto-refreshes every 10s)
- 📈 Interactive charts with 5D / 1M / 3M / 6M / 1Y history
- 🤖 7-day price prediction using Facebook Prophet ML model
- 💹 Virtual trading — buy/sell stocks with $100,000 fake balance
- 💼 Portfolio tracker with holdings and trade history
- ⚡ Redis caching for fast API responses

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite, Recharts, Zustand, React Query |
| Backend | Node.js, Express, Socket.io, JWT |
| ML Service | Python, FastAPI, Prophet, yfinance |
| Database | MongoDB, Redis |
| Deployment | Vercel (frontend), Railway (backend + ML) |

## 🏗️ Architecture
