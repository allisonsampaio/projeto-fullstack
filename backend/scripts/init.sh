#!/bin/bash

echo "Aguardando o MongoDB ficar pronto..."
while ! nc -z mongo 27017; do
    sleep 1
done

echo "MongoDB está pronto. Populando o banco de dados..."
python /app/scripts/seed_db.py

if [ $? -eq 0 ]; then
    echo "Banco de dados populado com sucesso!"
else
    echo "Erro ao popular o banco de dados."
    exit 1
fi

echo "Iniciando o servidor FastAPI..."
uvicorn app.main:app --host 0.0.0.0 --port 8000