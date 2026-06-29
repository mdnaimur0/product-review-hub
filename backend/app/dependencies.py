from fastapi import Depends

from .models import User
from .users import current_active_user


async def get_current_active_user(
    user: User = Depends(current_active_user),
) -> User:
    return user
