FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

# mysqlclient build deps + runtime libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# entrypoint: wait for db, migrate, collectstatic, gunicorn
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
