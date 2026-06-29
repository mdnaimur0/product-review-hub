import uuid
from datetime import datetime

from fastapi_users import schemas
from pydantic import BaseModel, ConfigDict, Field


class UserRead(schemas.BaseUser[uuid.UUID]):
    name: str


class UserCreate(schemas.BaseUserCreate):
    name: str = ""


class UserUpdate(schemas.BaseUserUpdate):
    name: str | None = None


class ProductBase(BaseModel):
    title: str
    description: str = ""
    image_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ProductListItem(BaseModel):
    id: int
    title: str
    description: str
    image_url: str | None
    average_rating: float
    review_count: int
    model_config = ConfigDict(from_attributes=True)


class ReviewBase(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = ""


class ReviewCreate(ReviewBase):
    product_id: int


class ReviewUpdate(BaseModel):
    rating: int | None = Field(default=None, ge=1, le=5)
    comment: str | None = None


class ReviewRead(ReviewBase):
    id: int
    product_id: int
    user_id: uuid.UUID
    user_name: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ProductDetail(ProductRead):
    reviews: list[ReviewRead]


class AdminReviewRead(ReviewBase):
    id: int
    product_id: int
    product_title: str
    user_id: uuid.UUID
    user_name: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PaginatedProductList(BaseModel):
    items: list[ProductListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
