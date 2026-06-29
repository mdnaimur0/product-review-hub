import uuid
from datetime import datetime

from fastapi_users import schemas
from pydantic import BaseModel, ConfigDict, Field


class UserRead(schemas.BaseUser[uuid.UUID]):
    pass


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass


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
