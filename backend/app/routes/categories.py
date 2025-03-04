from fastapi import APIRouter, HTTPException
from ..database import db
from ..utils import convert_object_id
from ..models import Category, Product
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/", response_model=Category)
def create_category(category: Category):
    category_dict = category.dict()
    category_dict["_id"] = ObjectId()
    db.categories.insert_one(category_dict)
    return convert_object_id(category_dict)

@router.get("/", response_model=List[Category])
def list_categories():
    categories = db.categories.find()
    return [convert_object_id(category) for category in categories]

@router.get("/{category_id}", response_model=Category)
def get_category(category_id: str):
    category = db.categories.find_one({"_id": ObjectId(category_id)})
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return convert_object_id(category)

@router.get("/{category_id}/products", response_model=List[Product])
def list_products_in_category(category_id: str):
    category = db.categories.find_one({"_id": ObjectId(category_id)})
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    products = db.products.find({"_id": {"$in": [ObjectId(product_id) for product_id in category["product_ids"]]}})
    return [convert_object_id(product) for product in products]