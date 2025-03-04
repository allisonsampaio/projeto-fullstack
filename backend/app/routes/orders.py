from fastapi import APIRouter, HTTPException
from ..database import db
from ..utils import convert_object_id
from ..models import Order
from bson import ObjectId
from typing import List

router = APIRouter()

@router.post("/", response_model=Order)
def create_order(order: Order):
    order_dict = order.dict()
    order_dict["_id"] = ObjectId()
    db.orders.insert_one(order_dict)

    for product_id in order.product_ids:
        db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$addToSet": {"order_ids": str(order_dict['_id'])}}
        )

    return convert_object_id(order_dict)

@router.get("/", response_model=List[Order])
def list_orders():
    orders = db.orders.find()
    return [convert_object_id(order) for order in orders]

@router.get("/{order_id}", response_model=Order)
def get_order(order_id: str):
    order = db.orders.find_one({"_id": ObjectId(order_id)})
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return convert_object_id(order)