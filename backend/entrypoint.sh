#!/bin/sh
set -e

echo "Waiting for MySQL at $DB_HOST:$DB_PORT ..."
while ! python -c "import socket,sys; s=socket.socket(); s.settimeout(2); sys.exit(0) if s.connect_ex(('$DB_HOST',int('$DB_PORT')))==0 else sys.exit(1)" 2>/dev/null; do
  sleep 2
done
echo "MySQL is up."

python manage.py migrate --noinput
python manage.py collectstatic --noinput

# create superuser if env provided and not existing
if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py createsuperuser --noinput 2>/dev/null || true
fi

exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
