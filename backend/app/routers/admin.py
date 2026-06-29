from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import require_admin
from ..models import Product, Review, User
from ..schemas import ProductCreate, ProductRead

router = APIRouter()


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
