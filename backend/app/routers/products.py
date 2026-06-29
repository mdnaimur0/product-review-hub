from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..database import get_db
from ..models import Product, Review
from ..schemas import ProductDetail, ProductListItem, ReviewRead

router = APIRouter()


@router.get("/", response_model=list[ProductListItem])
async def list_products(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(
            Product,
            func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
            func.count(Review.id).label("review_count"),
        )
        .outerjoin(Review, Product.id == Review.product_id)
        .group_by(Product.id)
        .order_by(Product.created_at.desc())
    )
    rows = (await db.execute(stmt)).all()
    return [
        ProductListItem(
            id=product.id,
            title=product.title,
            description=product.description,
            image_url=product.image_url,
            average_rating=round(float(average_rating), 2),
            review_count=review_count,
        )
        for product, average_rating, review_count in rows
    ]


@router.get("/{product_id}", response_model=ProductDetail)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Product)
        .options(selectinload(Product.reviews).selectinload(Review.user))
        .where(Product.id == product_id)
    )
    product = (await db.execute(stmt)).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        created_at=product.created_at,
        reviews=[
            ReviewRead(
                id=r.id,
                product_id=r.product_id,
                user_id=r.user_id,
                user_name=(r.user.name if r.user is not None else ""),
                rating=r.rating,
                comment=r.comment,
                created_at=r.created_at,
            )
            for r in product.reviews
        ],
    )
