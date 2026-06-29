import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..database import get_db
from ..models import Product, Review
from ..schemas import PaginatedProductList, ProductDetail, ProductListItem, ReviewRead

router = APIRouter()


@router.get("/", response_model=PaginatedProductList)
async def list_products(
    search: str | None = Query(None, description="Search product titles"),
    min_rating: float | None = Query(None, ge=0, le=5, description="Minimum average rating"),
    max_rating: float | None = Query(None, ge=0, le=5, description="Maximum average rating"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(
            Product,
            func.coalesce(func.avg(Review.rating), 0).label("average_rating"),
            func.count(Review.id).label("review_count"),
        )
        .outerjoin(Review, Product.id == Review.product_id)
        .group_by(Product.id)
    )

    if search:
        stmt = stmt.where(Product.title.ilike(f"%{search}%"))

    if min_rating is not None:
        stmt = stmt.having(func.coalesce(func.avg(Review.rating), 0) >= min_rating)

    if max_rating is not None:
        stmt = stmt.having(func.coalesce(func.avg(Review.rating), 0) <= max_rating)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar() or 0

    stmt = stmt.order_by(Product.created_at.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    rows = (await db.execute(stmt)).all()

    return PaginatedProductList(
        items=[
            ProductListItem(
                id=product.id,
                title=product.title,
                description=product.description,
                image_url=product.image_url,
                average_rating=round(float(average_rating), 2),
                review_count=review_count,
            )
            for product, average_rating, review_count in rows
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(1, math.ceil(total / page_size)),
    )


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
