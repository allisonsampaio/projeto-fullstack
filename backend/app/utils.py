from bson import ObjectId

def convert_object_id(item):
    if item:
        item["id"] = str(item["_id"])
        del item["_id"]
    return item