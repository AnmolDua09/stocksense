from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
from prophet import Prophet
import warnings
warnings.filterwarnings('ignore')

app = FastAPI(title="StockSense ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/quote/{symbol}")
def get_quote(symbol: str):
    try:
        ticker = yf.Ticker(symbol.upper())
        info = ticker.fast_info
        return {
            "symbol": symbol.upper(),
            "price": round(info.last_price, 2),
            "open": round(info.open, 2),
            "high": round(info.day_high, 2),
            "low": round(info.day_low, 2),
            "volume": info.shares,
            "prev_close": round(info.previous_close, 2),
            "change": round(info.last_price - info.previous_close, 2),
            "change_pct": round(((info.last_price - info.previous_close) / info.previous_close) * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/history/{symbol}")
def get_history(symbol: str, period: str = "1mo"):
    try:
        ticker = yf.Ticker(symbol.upper())
        df = ticker.history(period=period)
        df = df.reset_index()
        df['Date'] = df['Date'].astype(str)
        records = df[['Date','Open','High','Low','Close','Volume']].round(2).to_dict(orient='records')
        return {"symbol": symbol.upper(), "data": records}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/predict/{symbol}")
def predict(symbol: str):
    try:
        ticker = yf.Ticker(symbol.upper())
        df = ticker.history(period="6mo")
        df = df.reset_index()[['Date', 'Close']]
        df.columns = ['ds', 'y']
        df['ds'] = pd.to_datetime(df['ds']).dt.tz_localize(None)

        model = Prophet(daily_seasonality=False, weekly_seasonality=True)
        model.fit(df)

        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)

        next7 = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(7)
        next7['ds'] = next7['ds'].astype(str)
        next7 = next7.round(2)

        last_price = df['y'].iloc[-1]
        predicted_price = next7['yhat'].iloc[-1]
        signal = "bullish" if predicted_price > last_price else "bearish"
        change_pct = round(((predicted_price - last_price) / last_price) * 100, 2)

        return {
            "symbol": symbol.upper(),
            "signal": signal,
            "current_price": round(last_price, 2),
            "predicted_price": round(predicted_price, 2),
            "change_pct": change_pct,
            "forecast": next7.to_dict(orient='records')
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

import logging
logging.getLogger('prophet').setLevel(logging.ERROR)
