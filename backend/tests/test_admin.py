import pytest
from httpx import AsyncClient

from .conftest import (
    auth_header,
    create_product,
    create_review,
    login_user,
    register_admin,
    register_user,
)


@pytest.mark.asyncio
async def test_admin_list_products(client: AsyncClient, db_session):
    await create_product(db_session, title="Alpha")
    await create_product(db_session, title="Beta")

    await register_admin(client, db_session)
    token = await login_user(client, email="admin@test.com", password="Admin123!")

    resp = await client.get(
        "/api/admin/products",
        headers=await auth_header(token),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    titles = {p["title"] for p in data}
    assert titles == {"Alpha", "Beta"}
    for p in data:
        assert "id" in p
        assert "title" in p
        assert "description" in p
        assert "image_url" in p


@pytest.mark.asyncio
async def test_admin_list_products_unauthorized(client: AsyncClient, db_session):
    await register_user(client)
    token = await login_user(client)

    resp = await client.get(
        "/api/admin/products",
        headers=await auth_header(token),
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_create_product(client: AsyncClient, db_session):
    await register_admin(client, db_session)
    token = await login_user(client, email="admin@test.com", password="Admin123!")

    resp = await client.post(
        "/api/admin/products",
        json={"title": "Admin Product", "description": "Created by admin"},
        headers=await auth_header(token),
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Admin Product"
    assert data["description"] == "Created by admin"


@pytest.mark.asyncio
async def test_admin_create_product_unauthorized(client: AsyncClient, db_session):
    await register_user(client)
    token = await login_user(client)

    resp = await client.post(
        "/api/admin/products",
        json={"title": "Nope"},
        headers=await auth_header(token),
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_delete_product(client: AsyncClient, db_session):
    await register_admin(client, db_session)
    token = await login_user(client, email="admin@test.com", password="Admin123!")
    product = await create_product(db_session, title="To Delete")

    resp = await client.delete(
        f"/api/admin/products/{product.id}",
        headers=await auth_header(token),
    )
    assert resp.status_code == 204

    resp = await client.get(f"/api/products/{product.id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_admin_delete_product_not_found(client: AsyncClient, db_session):
    await register_admin(client, db_session)
    token = await login_user(client, email="admin@test.com", password="Admin123!")

    resp = await client.delete(
        "/api/admin/products/9999",
        headers=await auth_header(token),
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_admin_delete_review(client: AsyncClient, db_session):
    user = await register_user(client, email="user@test.com")
    product = await create_product(db_session)
    review = await create_review(db_session, user["id"], product.id, comment="Spam")

    await register_admin(client, db_session, email="admin2@test.com")
    token = await login_user(client, email="admin2@test.com", password="Admin123!")

    resp = await client.delete(
        f"/api/admin/reviews/{review.id}",
        headers=await auth_header(token),
    )
    assert resp.status_code == 204

    resp = await client.get(f"/api/products/{product.id}")
    assert resp.json()["reviews"] == []


@pytest.mark.asyncio
async def test_admin_delete_review_not_found(client: AsyncClient, db_session):
    await register_admin(client, db_session)
    token = await login_user(client, email="admin@test.com", password="Admin123!")

    resp = await client.delete(
        "/api/admin/reviews/9999",
        headers=await auth_header(token),
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_admin_delete_review_unauthorized(client: AsyncClient, db_session):
    user = await register_user(client, email="user@test.com")
    product = await create_product(db_session)
    review = await create_review(db_session, user["id"], product.id)

    token = await login_user(client, email="user@test.com")

    resp = await client.delete(
        f"/api/admin/reviews/{review.id}",
        headers=await auth_header(token),
    )
    assert resp.status_code == 403
