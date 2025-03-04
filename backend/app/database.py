from pymongo import MongoClient

try:
    client = MongoClient("mongodb://mongo:27017/")
    db = client["fullstack_db"]
    print("Conectado ao MongoDB com sucesso!")
except Exception as e:
    print(f"Erro ao conectar ao MongoDB: {e}")
    raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados")