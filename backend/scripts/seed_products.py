import asyncio

import httpx

from app.database import async_session_maker, engine
from app.models import Base, Product

CATEGORIES = [
    "laptops",
    "mobile-accessories",
    "smartphones",
    "tablets",
    "mens-watches",
]

API_URL = "https://dummyjson.com/products/category/{category}?limit=5&select=title,description,thumbnail"


async def fetch_products(category: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.get(API_URL.format(category=category))
        resp.raise_for_status()
        return resp.json()["products"]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    products = []
    for cat in CATEGORIES:
        items = await fetch_products(cat)
        for item in items:
            products.append(
                Product(
                    title=item["title"],
                    description=item["description"],
                    image_url=item.get("thumbnail"),
                )
            )
        print(f"Fetched {len(items)} products from {cat}")

    async with async_session_maker() as session:
        session.add_all(products)
        await session.commit()
        print(f"Inserted {len(products)} products into the database")


if __name__ == "__main__":
    asyncio.run(seed())
