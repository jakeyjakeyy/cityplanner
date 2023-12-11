FROM python:3.10.12
COPY . /app/backend
WORKDIR /app/backend
RUN pip install -r requirements.txt
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]