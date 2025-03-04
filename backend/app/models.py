from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

def str_object_id(value):
    if isinstance(value, ObjectId):
        return str(value)
    return value

class Category(BaseModel):
    id: Optional[str] = None
    name: str
    product_ids: List[str] = []

    class Config:
        json_encoders = {
            ObjectId: str_object_id
        }

class Product(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    price: float
    category_ids: List[str]
    image_url: str

    class Config:
        json_encoders = {
            ObjectId: str_object_id
        }

class Order(BaseModel):
    id: Optional[str] = None
    date: datetime
    product_ids: List[str]
    total: float

    class Config:
        json_encoders = {
            ObjectId: str_object_id
        }
