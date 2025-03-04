from pymongo import MongoClient
from datetime import datetime, timedelta
import random
from bson import ObjectId

client = MongoClient("mongodb://mongo:27017/")
db = client["fullstack_db"]

categories_data = [
    {
        "name": "Frutas",
        "products": [
            {"name": "Banana", "price": 2.50, "image_url": "https://placehold.co/400x400?text=Banana"},
            {"name": "Maçã", "price": 3.00, "image_url": "https://placehold.co/400x400?text=Maçã"},
            {"name": "Laranja", "price": 2.00, "image_url": "https://placehold.co/400x400?text=Laranja"},
            {"name": "Morango", "price": 5.00, "image_url": "https://placehold.co/400x400?text=Morango"},
            {"name": "Uva", "price": 6.00, "image_url": "https://placehold.co/400x400?text=Uva"},
        ]
    },
    {
        "name": "Eletrônicos",
        "products": [
            {"name": "Smartphone", "price": 1500.00, "image_url": "https://placehold.co/400x400?text=Smartphone"},
            {"name": "Notebook", "price": 3500.00, "image_url": "https://placehold.co/400x400?text=Notebook"},
            {"name": "Fone de Ouvido", "price": 200.00, "image_url": "https://placehold.co/400x400?text=Fone+de+Ouvido"},
            {"name": "Smartwatch", "price": 800.00, "image_url": "https://placehold.co/400x400?text=Smartwatch"},
            {"name": "Tablet", "price": 1200.00, "image_url": "https://placehold.co/400x400?text=Tablet"},
        ]
    },
    {
        "name": "Roupas",
        "products": [
            {"name": "Camiseta", "price": 50.00, "image_url": "https://placehold.co/400x400?text=Camiseta"},
            {"name": "Calça Jeans", "price": 120.00, "image_url": "https://placehold.co/400x400?text=Calça+Jeans"},
            {"name": "Tênis", "price": 200.00, "image_url": "https://placehold.co/400x400?text=Tênis"},
            {"name": "Casaco", "price": 150.00, "image_url": "https://placehold.co/400x400?text=Casaco"},
            {"name": "Vestido", "price": 100.00, "image_url": "https://placehold.co/400x400?text=Vestido"},
        ]
    },
    {
        "name": "Livros",
        "products": [
            {"name": "Livro de Ficção", "price": 40.00, "image_url": "https://placehold.co/400x400?text=Livro+de+Ficção"},
            {"name": "Livro de Não Ficção", "price": 50.00, "image_url": "https://placehold.co/400x400?text=Livro+de+Não+Ficção"},
            {"name": "Livro de Autoajuda", "price": 30.00, "image_url": "https://placehold.co/400x400?text=Livro+de+Autoajuda"},
            {"name": "Livro Infantil", "price": 25.00, "image_url": "https://placehold.co/400x400?text=Livro+Infantil"},
            {"name": "Livro de Culinária", "price": 60.00, "image_url": "https://placehold.co/400x400?text=Livro+de+Culinária"},
        ]
    },
]

def clear_database():
    db.categories.delete_many({})
    db.products.delete_many({})
    db.orders.delete_many({})
    print("Banco de dados limpo!")

def populate_database():
    clear_database()

    for category_data in categories_data:
        category = {
            "name": category_data["name"],
            "product_ids": []
        }
        category_id = db.categories.insert_one(category).inserted_id

        for product_data in category_data["products"]:
            product = {
                "name": product_data["name"],
                "description": f"Descrição do {product_data['name']}.",
                "price": product_data["price"],
                "category_ids": [str(category_id)],
                "image_url": product_data["image_url"]
            }
            product_id = db.products.insert_one(product).inserted_id

            db.categories.update_one(
                {"_id": category_id},
                {"$addToSet": {"product_ids": str(product_id)}}
            )

    products = list(db.products.find())
    for _ in range(20):
        order = {
            "date": datetime.now() - timedelta(days=random.randint(1, 30)),
            "product_ids": [],
            "total": 0
        }

        selected_products = random.sample(products, random.randint(1, 5))
        order["product_ids"] = [str(product["_id"]) for product in selected_products]
        order["total"] = sum(product["price"] for product in selected_products)

        order_id = db.orders.insert_one(order).inserted_id

        for product in selected_products:
            db.products.update_one(
                {"_id": product["_id"]},
                {"$addToSet": {"order_ids": str(order_id)}}
            )

    print("Banco de dados populado com sucesso!")

if __name__ == "__main__":
    populate_database()
