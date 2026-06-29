import pytest
from httpx import AsyncClient

from .conftest import create_product, create_review, register_user, login_user, TEST_NAME


@pytest.mark.asyncio
async def test_list_products_empty(client: AsyncClient):
    resp = await client.get("/api/products/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["page"] == 1
    assert data["total_pages"] == 1


@pytest.mark.asyncio
async def test_list_products_with_reviews(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session, title="Widget", description="A widget")
    await create_review(db_session, user_data["id"], product.id, rating=4)
    await create_review(db_session, user_data["id"], product.id, rating=2)

    resp = await client.get("/api/products/")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Widget"
    assert data["items"][0]["average_rating"] == 3.0
    assert data["items"][0]["review_count"] == 2
    assert data["total"] == 1


@pytest.mark.asyncio
async def test_search_products(client: AsyncClient, db_session):
    user_data = await register_user(client)
    await create_product(db_session, title="Wireless Mouse", description="Ergonomic mouse")
    await create_product(db_session, title="USB Cable", description="USB-C cable")
    await create_product(db_session, title="Bluetooth Speaker", description="Portable speaker")

    resp = await client.get("/api/products/", params={"search": "mouse"})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Wireless Mouse"


@pytest.mark.asyncio
async def test_search_products_partial_match(client: AsyncClient, db_session):
    user_data = await register_user(client)
    await create_product(db_session, title="Wireless Mouse")
    await create_product(db_session, title="Wired Mouse")

    resp = await client.get("/api/products/", params={"search": "mouse"})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2


@pytest.mark.asyncio
async def test_filter_by_min_rating(client: AsyncClient, db_session):
    user_data = await register_user(client)
    p1 = await create_product(db_session, title="Great Product")
    p2 = await create_product(db_session, title="Okay Product")
    p3 = await create_product(db_session, title="Bad Product")
    await create_review(db_session, user_data["id"], p1.id, rating=5)
    await create_review(db_session, user_data["id"], p2.id, rating=3)
    await create_review(db_session, user_data["id"], p3.id, rating=1)

    resp = await client.get("/api/products/", params={"min_rating": 4})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Great Product"


@pytest.mark.asyncio
async def test_filter_by_max_rating(client: AsyncClient, db_session):
    user_data = await register_user(client)
    p1 = await create_product(db_session, title="Great Product")
    p2 = await create_product(db_session, title="Okay Product")
    p3 = await create_product(db_session, title="Bad Product")
    await create_review(db_session, user_data["id"], p1.id, rating=5)
    await create_review(db_session, user_data["id"], p2.id, rating=3)
    await create_review(db_session, user_data["id"], p3.id, rating=1)

    resp = await client.get("/api/products/", params={"max_rating": 2})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Bad Product"


@pytest.mark.asyncio
async def test_filter_rating_range(client: AsyncClient, db_session):
    user_data = await register_user(client)
    p1 = await create_product(db_session, title="Great Product")
    p2 = await create_product(db_session, title="Okay Product")
    p3 = await create_product(db_session, title="Bad Product")
    await create_review(db_session, user_data["id"], p1.id, rating=5)
    await create_review(db_session, user_data["id"], p2.id, rating=3)
    await create_review(db_session, user_data["id"], p3.id, rating=1)

    resp = await client.get("/api/products/", params={"min_rating": 2, "max_rating": 4})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Okay Product"


@pytest.mark.asyncio
async def test_search_and_filter_combined(client: AsyncClient, db_session):
    user_data = await register_user(client)
    p1 = await create_product(db_session, title="Wireless Mouse")
    p2 = await create_product(db_session, title="Wired Mouse")
    await create_review(db_session, user_data["id"], p1.id, rating=5)
    await create_review(db_session, user_data["id"], p2.id, rating=2)

    resp = await client.get("/api/products/", params={"search": "mouse", "min_rating": 4})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Wireless Mouse"


@pytest.mark.asyncio
async def test_pagination(client: AsyncClient, db_session):
    await register_user(client)
    for i in range(15):
        await create_product(db_session, title=f"Product {i:02d}")

    resp = await client.get("/api/products/", params={"page": 1, "page_size": 5})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 5
    assert data["total"] == 15
    assert data["page"] == 1
    assert data["page_size"] == 5
    assert data["total_pages"] == 3

    resp2 = await client.get("/api/products/", params={"page": 3, "page_size": 5})
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert len(data2["items"]) == 5


@pytest.mark.asyncio
async def test_search_no_results(client: AsyncClient, db_session):
    await create_product(db_session, title="Widget")
    resp = await client.get("/api/products/", params={"search": "nonexistent"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_products_without_reviews_excluded_by_rating_filter(client: AsyncClient, db_session):
    user_data = await register_user(client)
    await create_product(db_session, title="No Reviews")
    has_reviews = await create_product(db_session, title="Has Reviews")
    await create_review(db_session, user_data["id"], has_reviews.id, rating=5)

    resp = await client.get("/api/products/", params={"min_rating": 1})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Has Reviews"


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
    assert data["reviews"][0]["user_name"] == TEST_NAME


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient):
    resp = await client.get("/api/products/9999")
    assert resp.status_code == 404
