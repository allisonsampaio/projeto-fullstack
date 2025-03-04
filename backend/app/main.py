from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from typing import List
from datetime import datetime, timedelta
from .models import Product, Category, Order
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    client = MongoClient("mongodb://mongo:27017/")
    db = client["fullstack_db"]
    print("Conectado ao MongoDB com sucesso!")
except Exception as e:
    print(f"Erro ao conectar ao MongoDB: {e}")
    raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados")

def convert_object_id(item):
    if item:
        item["id"] = str(item["_id"])
        del item["_id"]
    return item

@app.post("/products/", response_model=Product)
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

@app.put("/products/{product_id}", response_model=Product)
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

@app.post("/categories/", response_model=Category)
def create_category(category: Category):
    category_dict = category.dict()
    category_dict["_id"] = ObjectId()
    db.categories.insert_one(category_dict)
    return convert_object_id(category_dict)

@app.get("/categories/", response_model=List[Category])
def list_categories():
    categories = db.categories.find()
    return [convert_object_id(category) for category in categories]

@app.post("/orders/", response_model=Order)
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

@app.get("/orders/", response_model=List[Order])
def list_orders():
    orders = db.orders.find()
    return [convert_object_id(order) for order in orders]

@app.get("/products/", response_model=List[Product])
def list_products():
    products = db.products.find()
    return [convert_object_id(product) for product in products]

@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return convert_object_id(product)

@app.get("/categories/{category_id}", response_model=Category)
def get_category(category_id: str):
    category = db.categories.find_one({"_id": ObjectId(category_id)})
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return convert_object_id(category)

@app.get("/orders/{order_id}", response_model=Order)
def get_order(order_id: str):
    order = db.orders.find_one({"_id": ObjectId(order_id)})
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return convert_object_id(order)

@app.get("/categories/{category_id}/products", response_model=List[Product])
def list_products_in_category(category_id: str):
    category = db.categories.find_one({"_id": ObjectId(category_id)})
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    products = db.products.find({"_id": {"$in": [ObjectId(product_id) for product_id in category["product_ids"]]}})
    return [convert_object_id(product) for product in products]

@app.get("/products/{product_id}/categories", response_model=List[Category])
def list_categories_of_product(product_id: str):
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    categories = db.categories.find({"_id": {"$in": [ObjectId(category_id) for category_id in product["category_ids"]]}})
    return [convert_object_id(category) for category in categories]

@app.get("/dashboard/")
def get_dashboard_metrics():
    try:
        total_orders = db.orders.count_documents({})

        average_order_value = db.orders.aggregate([
            {
                "$group": {
                    "_id": None,
                    "average_value": {"$avg": "$total"}
                }
            }
        ])
        average_order_value = list(average_order_value)
        average_order_value = average_order_value[0]["average_value"] if average_order_value else 0

        total_revenue = db.orders.aggregate([
            {
                "$group": {
                    "_id": None,
                    "total_revenue": {"$sum": "$total"}
                }
            }
        ])
        total_revenue = list(total_revenue)
        total_revenue = total_revenue[0]["total_revenue"] if total_revenue else 0

        seven_days_ago = datetime.now() - timedelta(days=7)
        orders_last_7_days = db.orders.aggregate([
            {
                "$match": {
                    "date": {"$gte": seven_days_ago}
                }
            },
            {
                "$group": {
                    "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$date"}},
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id": 1}
            }
        ])
        orders_last_7_days = list(orders_last_7_days)

        return {
            "total_orders": total_orders,
            "average_order_value": average_order_value,
            "total_revenue": total_revenue,
            "orders_last_7_days": orders_last_7_days
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))