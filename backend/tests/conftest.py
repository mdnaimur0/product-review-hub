import uuid
from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import Product, Review, User

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
engine = create_async_engine(
    TEST_DB_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
)
TestSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "Secret123!"
TEST_NAME = "Test User"


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestSessionLocal() as session:
        yield session
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c
    app.dependency_overrides.clear()


async def register_user(
    client: AsyncClient,
    email: str = TEST_EMAIL,
    password: str = TEST_PASSWORD,
    name: str = TEST_NAME,
) -> dict:
    resp = await client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "name": name},
    )
    assert resp.status_code == 201
    return resp.json()


async def login_user(client: AsyncClient, email: str = TEST_EMAIL, password: str = TEST_PASSWORD) -> str:
    resp = await client.post(
        "/api/auth/jwt/login",
        data={"username": email, "password": password},
    )
    return resp.json()["access_token"]


async def auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


async def create_product(db: AsyncSession, **kwargs) -> Product:
    product = Product(
        title=kwargs.get("title", "Test Product"),
        description=kwargs.get("description", "A test product"),
        image_url=kwargs.get("image_url"),
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def create_review(db: AsyncSession, user_id: uuid.UUID, product_id: int, **kwargs) -> Review:
    review = Review(
        product_id=product_id,
        user_id=user_id,
        rating=kwargs.get("rating", 5),
        comment=kwargs.get("comment", "Great product!"),
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


async def make_admin(db: AsyncSession, user_id: uuid.UUID) -> None:
    from sqlalchemy import update

    await db.execute(update(User).where(User.id == user_id).values(is_superuser=True))
    await db.commit()


async def register_admin(
    client: AsyncClient,
    db: AsyncSession,
    email: str = "admin@test.com",
    password: str = "Admin123!",
    name: str = "Admin User",
) -> dict:
    user_data = await register_user(client, email=email, password=password, name=name)
    await make_admin(db, uuid.UUID(user_data["id"]))
    return user_data
