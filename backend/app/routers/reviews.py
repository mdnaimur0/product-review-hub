from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..database import get_db
from ..dependencies import get_current_active_user
from ..models import Product, Review, User
from ..schemas import ReviewCreate, ReviewRead, ReviewUpdate

router = APIRouter()


@router.post("/", response_model=ReviewRead, status_code=201)
async def create_review(
    data: ReviewCreate,
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    product = await db.get(Product, data.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = await db.execute(
        select(Review).where(
            Review.product_id == data.product_id, Review.user_id == user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already reviewed this product")

    user_name = user.name
    review = Review(
        product_id=data.product_id,
        user_id=user.id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return ReviewRead(
        id=review.id,
        product_id=review.product_id,
        user_id=review.user_id,
        user_name=user_name,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )


@router.get("/me", response_model=list[ReviewRead])
async def get_my_reviews(
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    user_name = user.name
    stmt = (
        select(Review)
        .options(selectinload(Review.product))
        .where(Review.user_id == user.id)
        .order_by(Review.created_at.desc())
    )
    reviews = (await db.execute(stmt)).scalars().all()
    return [
        ReviewRead(
            id=r.id,
            product_id=r.product_id,
            user_id=r.user_id,
            user_name=user_name,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at,
        )
        for r in reviews
    ]


async def _get_owned_review(
    review_id: int, user: User, db: AsyncSession
) -> Review:
    review = await db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return review


@router.put("/{review_id}", response_model=ReviewRead)
async def update_review(
    review_id: int,
    data: ReviewUpdate,
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    review = await _get_owned_review(review_id, user, db)
    user_name = user.name
    if data.rating is not None:
        review.rating = data.rating
    if data.comment is not None:
        review.comment = data.comment
    await db.commit()
    await db.refresh(review)
    return ReviewRead(
        id=review.id,
        product_id=review.product_id,
        user_id=review.user_id,
        user_name=user_name,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )


@router.delete("/{review_id}", status_code=204)
async def delete_review(
    review_id: int,
    user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    review = await _get_owned_review(review_id, user, db)
    await db.delete(review)
    await db.commit()
