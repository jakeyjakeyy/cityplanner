FROM python:3.10.12
COPY . /app/backend
WORKDIR /app/backend
RUN pip install -r requirements.txt
RUN python3 manage.py collectstatic --noinput
CMD ["gunicorn", "--config", "gunicorn_config.py", "backend.wsgi:application"]

# CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]