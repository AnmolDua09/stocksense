from fastapi import APIRouter, HTTPException
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import requests
import os

router = APIRouter()
analyzer = SentimentIntensityAnalyzer()

def get_sentiment_label(score):
    if score >= 0.05:
        return "positive"
    elif score <= -0.05:
        return "negative"
    else:
        return "neutral"

def get_sentiment_color(label):
    return {"positive": "#22c55e", "negative": "#ef4444", "neutral": "#f59e0b"}[label]

@router.get("/sentiment/{symbol}")
def get_sentiment(symbol: str):
    try:
        api_key = os.getenv("NEWS_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="NEWS_API_KEY not set")

        company_names = {
            "AAPL": "Apple", "GOOGL": "Google", "MSFT": "Microsoft",
            "TSLA": "Tesla", "AMZN": "Amazon", "NVDA": "NVIDIA", "META": "Meta"
        }
        query = company_names.get(symbol.upper(), symbol.upper())

        params = {
            "q": query,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 10,
            "apiKey": api_key
        }
        response = requests.get("https://newsapi.org/v2/everything", params=params)
        articles = response.json().get("articles", [])

        if not articles:
            return {"symbol": symbol.upper(), "overall": "neutral", "score": 0, "articles": []}

        results = []
        scores = []

        for article in articles:
            title = article.get("title") or ""
            description = article.get("description") or ""
            text = f"{title}. {description}"
            vs = analyzer.polarity_scores(text)
            compound = vs["compound"]
            scores.append(compound)
            label = get_sentiment_label(compound)
            results.append({
                "title": title,
                "source": article.get("source", {}).get("name", "Unknown"),
                "url": article.get("url", ""),
                "publishedAt": article.get("publishedAt", ""),
                "score": round(compound, 3),
                "label": label,
                "color": get_sentiment_color(label)
            })

        avg_score = round(sum(scores) / len(scores), 3)
        overall = get_sentiment_label(avg_score)
        positive = len([s for s in scores if s >= 0.05])
        negative = len([s for s in scores if s <= -0.05])
        neutral = len(scores) - positive - negative

        return {
            "symbol": symbol.upper(),
            "overall": overall,
            "score": avg_score,
            "color": get_sentiment_color(overall),
            "breakdown": {"positive": positive, "negative": negative, "neutral": neutral},
            "articles": results
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
