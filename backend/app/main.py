from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import admin, products, reviews
from .schemas import UserCreate, UserRead, UserUpdate
from .users import auth_backend, fastapi_users, AUTH_URL_PATH
from .utils import generate_unique_route_id

app = FastAPI(
    title="Review Hub API",
    version="1.0.0",
    generate_unique_id_function=generate_unique_route_id,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.CORS_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend, requires_verification=False),
    prefix=f"/api/{AUTH_URL_PATH}/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix=f"/api/{AUTH_URL_PATH}",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate, requires_verification=False),
    prefix=f"/api/users",
    tags=["users"],
)
app.include_router(products.router, prefix=f"/api/products", tags=["products"])
app.include_router(reviews.router, prefix=f"/api/reviews", tags=["reviews"])
app.include_router(admin.router, prefix=f"/api/admin", tags=["admin"])
