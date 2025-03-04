from fastapi import APIRouter, HTTPException
from ..database import db
from ..utils import convert_object_id
from ..models import Product, Category
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/", response_model=Product)
def create_product(product: Product):
    product_dict = product.dict()
    product_dict["_id"] = ObjectId()

    for category_id in product.category_ids:
        db.categories.update_one(
            {"_id": ObjectId(category_id)},
            {"$addToSet": {"product_ids": str(product_dict['_id'])}}
        )

    db.products.insert_one(product_dict)
    return convert_object_id(product_dict)

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: str, product: Product):
    product_dict = product.dict()
    result = db.products.update_one({"_id": ObjectId(product_id)}, {"$set": product_dict})

    for category_id in product.category_ids:
        db.categories.update_one(
            {"_id": ObjectId(category_id)},
            {"$addToSet": {"product_ids": str(product_dict['_id'])}}
        )

    updated_product = db.products.find_one({"_id": ObjectId(product_id)})
    return convert_object_id(updated_product)

@router.get("/", response_model=List[Product])
def list_products():
    products = db.products.find()
    return [convert_object_id(product) for product in products]

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str):
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return convert_object_id(product)

@router.get("/{product_id}/categories", response_model=List[Category])
def list_categories_of_product(product_id: str):
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    categories = db.categories.find({"_id": {"$in": [ObjectId(category_id) for category_id in product["category_ids"]]}})
    return [convert_object_id(category) for category in categories]