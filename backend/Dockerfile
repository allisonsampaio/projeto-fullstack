FROM python:3.9-slim

RUN apt-get update && apt-get install -y curl gnupg netcat-openbsd && \
    curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] http://repo.mongodb.org/apt/debian buster/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && apt-get install -y mongodb-mongosh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY scripts/seed_db.py /app/scripts/seed_db.py
COPY scripts/init.sh /app/scripts/init.sh

RUN chmod +x /app/scripts/init.sh

EXPOSE 8000

CMD ["/app/scripts/init.sh"]
