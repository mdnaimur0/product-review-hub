import pytest
from httpx import AsyncClient

from .conftest import create_product, create_review, register_user, login_user, auth_header, TEST_NAME


@pytest.mark.asyncio
async def test_create_review(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session)
    token = await login_user(client)

    resp = await client.post(
        "/api/reviews/",
        json={"product_id": product.id, "rating": 5, "comment": "Excellent!"},
        headers=await auth_header(token),
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["rating"] == 5
    assert data["product_id"] == product.id


@pytest.mark.asyncio
async def test_create_review_invalid_rating(client: AsyncClient, db_session):
    await register_user(client)
    product = await create_product(db_session)
    token = await login_user(client)

    resp = await client.post(
        "/api/reviews/",
        json={"product_id": product.id, "rating": 6},
        headers=await auth_header(token),
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_review_product_not_found(client: AsyncClient, db_session):
    await register_user(client)
    token = await login_user(client)

    resp = await client.post(
        "/api/reviews/",
        json={"product_id": 9999, "rating": 5},
        headers=await auth_header(token),
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_create_review_duplicate(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session)
    await create_review(db_session, user_data["id"], product.id, rating=5)
    token = await login_user(client)

    resp = await client.post(
        "/api/reviews/",
        json={"product_id": product.id, "rating": 4},
        headers=await auth_header(token),
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_update_review(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session)
    review = await create_review(db_session, user_data["id"], product.id, rating=3)
    token = await login_user(client)

    resp = await client.put(
        f"/api/reviews/{review.id}",
        json={"rating": 5, "comment": "Updated!"},
        headers=await auth_header(token),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["rating"] == 5
    assert data["comment"] == "Updated!"


@pytest.mark.asyncio
async def test_update_review_unauthorized(client: AsyncClient, db_session):
    user1 = await register_user(client, email="user1@test.com")
    product = await create_product(db_session)
    review = await create_review(db_session, user1["id"], product.id)
    await register_user(client, email="user2@test.com", password="Another123!")
    token = await login_user(client, email="user2@test.com", password="Another123!")

    resp = await client.put(
        f"/api/reviews/{review.id}",
        json={"rating": 1},
        headers=await auth_header(token),
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_delete_review(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session)
    review = await create_review(db_session, user_data["id"], product.id)
    token = await login_user(client)

    resp = await client.delete(
        f"/api/reviews/{review.id}",
        headers=await auth_header(token),
    )
    assert resp.status_code == 204

    resp = await client.get(f"/api/products/{product.id}")
    assert resp.json()["reviews"] == []


@pytest.mark.asyncio
async def test_delete_review_unauthorized(client: AsyncClient, db_session):
    user1 = await register_user(client, email="user1@test.com")
    product = await create_product(db_session)
    review = await create_review(db_session, user1["id"], product.id)
    await register_user(client, email="user2@test.com", password="Another123!")
    token = await login_user(client, email="user2@test.com", password="Another123!")

    resp = await client.delete(
        f"/api/reviews/{review.id}",
        headers=await auth_header(token),
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_get_my_reviews(client: AsyncClient, db_session):
    user_data = await register_user(client)
    product = await create_product(db_session)
    await create_review(db_session, user_data["id"], product.id, rating=4, comment="Good")
    await create_review(db_session, user_data["id"], product.id, rating=5, comment="Great")
    token = await login_user(client)

    resp = await client.get(
        "/api/reviews/me",
        headers=await auth_header(token),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    assert data[0]["user_name"] == TEST_NAME
    assert data[0]["product_id"] == product.id


@pytest.mark.asyncio
async def test_get_my_reviews_empty(client: AsyncClient, db_session):
    await register_user(client)
    token = await login_user(client)

    resp = await client.get(
        "/api/reviews/me",
        headers=await auth_header(token),
    )
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_get_my_reviews_unauthorized(client: AsyncClient):
    resp = await client.get("/api/reviews/me")
    assert resp.status_code == 401
