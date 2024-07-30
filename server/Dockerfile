FROM python:3.12-slim AS builder
 
WORKDIR /app
 
COPY requirements.txt .

RUN python3 -m venv venv
ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
 
RUN apt-get update 
RUN apt-get install -y libgl1 libglib2.0-0
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Stage 2
FROM python:3.12-slim AS runner
 
WORKDIR /app
 
COPY --from=builder /app/venv venv
COPY . .

ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV FLASK_APP=app/app.py
 
EXPOSE 8080
 
CMD ["gunicorn", "--bind" , ":8080", "--workers", "2", "app:app"]