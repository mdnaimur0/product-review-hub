import pytest
from httpx import AsyncClient

from .conftest import create_product, create_review, register_user, login_user, TEST_EMAIL


@pytest.mark.asyncio
async def test_list_products_empty(client: AsyncClient):
    resp = await client.get("/api/products")
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_list_products_with_reviews(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session, title="Widget", description="A widget")
    await create_review(db_session, user_data["id"], product.id, rating=4)
    await create_review(db_session, user_data["id"], product.id, rating=2)

    resp = await client.get("/api/products")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["title"] == "Widget"
    assert data[0]["average_rating"] == 3.0
    assert data[0]["review_count"] == 2


@pytest.mark.asyncio
async def test_get_product_detail(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session)
    await create_review(db_session, user_data["id"], product.id, rating=5, comment="Love it!")

    resp = await client.get(f"/api/products/{product.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == product.title
    assert len(data["reviews"]) == 1
    assert data["reviews"][0]["rating"] == 5
    assert data["reviews"][0]["user_name"] == TEST_EMAIL


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient):
    resp = await client.get("/api/products/9999")
    assert resp.status_code == 404
