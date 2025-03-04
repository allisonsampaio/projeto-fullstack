from fastapi import APIRouter, HTTPException
from ..database import db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
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