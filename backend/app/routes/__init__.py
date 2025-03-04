from fastapi import APIRouter
from .products import router as products_router
from .categories import router as categories_router
from .orders import router as orders_router
from .dashboard import router as dashboard_router

router = APIRouter()

router.include_router(products_router, prefix="/products", tags=["products"])
router.include_router(categories_router, prefix="/categories", tags=["categories"])
router.include_router(orders_router, prefix="/orders", tags=["orders"])
router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])