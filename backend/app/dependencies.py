from fastapi import Depends, HTTPException

from .models import User
from .users import current_active_user


async def get_current_active_user(
    user: User = Depends(current_active_user),
) -> User:
    return user


async def require_admin(
    user: User = Depends(get_current_active_user),
) -> User:
    if not user.is_superuser:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
