from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..database import get_db
from ..dependencies import require_admin
from ..models import Product, Review, User
from ..schemas import AdminReviewRead, ProductCreate, ProductRead

router = APIRouter()


@router.get("/products", response_model=list[ProductRead])
async def admin_list_products(
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Product).order_by(Product.created_at.desc()))
    return result.scalars().all()


@router.get("/reviews", response_model=list[AdminReviewRead])
async def admin_list_reviews(
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Review)
        .options(selectinload(Review.product), selectinload(Review.user))
        .order_by(Review.created_at.desc())
    )
    reviews = (await db.execute(stmt)).scalars().all()
    return [
        AdminReviewRead(
            id=r.id,
            product_id=r.product_id,
            product_title=r.product.title,
            user_id=r.user_id,
            user_name=r.user.name,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at,
        )
        for r in reviews
    ]


@router.post("/products", response_model=ProductRead, status_code=201)
async def admin_create_product(
    data: ProductCreate,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    product = Product(
        title=data.title,
        description=data.description,
        image_url=data.image_url,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


@router.delete("/products/{product_id}", status_code=204)
async def admin_delete_product(
    product_id: int,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(product)
    await db.commit()


@router.delete("/reviews/{review_id}", status_code=204)
async def admin_delete_review(
    review_id: int,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    review = await db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.delete(review)
    await db.commit()
