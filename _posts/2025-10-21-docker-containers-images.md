---
layout: post
title: "Docker: Containers and Images"
date: 2025-10-21
tags: [system-design]
analogy_domain: "toys"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 2
excerpt: "Understand Docker containers and images. Learn why Docker solves the 'it works on my machine' problem."
description: "Quick guide to Docker for interview preparation."
keywords: docker, containers, docker images, dockerfile, containerization
related_concepts:
  - "Kubernetes"
  - "Microservices"
---

## The Problem

"It works on my machine!" - Your app runs perfectly on your laptop but crashes in production. Different OS versions, missing dependencies, conflicting libraries. Docker solves this by packaging everything needed to run your app.

---

## The Analogy

**Docker Image = LEGO instruction manual**
- Step 1: Start with base (Ubuntu/Alpine)
- Step 2: Install dependencies (Python, PostgreSQL, etc.)
- Step 3: Copy your code
- Step 4: Run app
- Result: Everyone running these instructions builds the EXACT same container

**Docker Container = Built LEGO model**
- The actual running instance
- Same model every time, every machine

---

## Key Concepts

**Image:**
- Blueprint/template (like source code)
- Immutable
- Layered: each command creates a layer

**Container:**
- Running instance of an image
- Mutable (but throwaway)
- Isolated from other containers and host

**Registry (Docker Hub):**
- Repository of images
- Like GitHub for Docker images

---

## Dockerfile (Instructions)

```dockerfile
# Start with a base image
FROM python:3.9-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl

# Copy application code
COPY . /app
WORKDIR /app

# Install Python packages
RUN pip install -r requirements.txt

# Expose port
EXPOSE 8080

# Run application
CMD ["python", "app.py"]
```

---

## Docker Commands

```bash
# Build image from Dockerfile
docker build -t myapp:1.0 .

# Run container from image
docker run -p 8080:8080 myapp:1.0

# List running containers
docker ps

# Stop container
docker stop <container_id>

# Push image to registry (Docker Hub)
docker push myapp:1.0

# Pull image from registry
docker pull myapp:1.0
```

---

## Dockerfile Best Practices

**1. Keep images small:**
```dockerfile
# BAD: 1GB image
FROM ubuntu:latest
RUN apt-get install python3

# GOOD: 150MB image
FROM python:3.9-alpine
```

**2. Layer caching - order by change frequency:**
```dockerfile
FROM python:3.9

# Rarely changes
COPY requirements.txt .
RUN pip install -r requirements.txt

# Changes frequently
COPY . /app
CMD ["python", "app.py"]
```

**3. Multi-stage builds (reduce final size):**
```dockerfile
# Build stage
FROM python:3.9 as builder
COPY . /src
RUN pip install -r /src/requirements.txt

# Runtime stage (smaller)
FROM python:3.9-slim
COPY --from=builder /src /app
CMD ["python", "/app/app.py"]
```

---

## Docker Compose (Multiple Containers)

Running multiple services together:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down
```

---

## Volumes (Persistent Data)

```bash
# Volume mounts (persistent data)
docker run -v mydata:/data myapp:1.0

# Bind mounts (local directory)
docker run -v /home/user/data:/data myapp:1.0
```

---

## Why Docker?

1. **Consistency** - Same behavior everywhere
2. **Isolation** - App doesn't affect system
3. **Reproducibility** - Anyone can run exact same version
4. **Easy deployment** - Just `docker run image`
5. **Microservices friendly** - Each service in own container

---

## Key Interview Points

1. **Image = blueprint, Container = running instance**
2. **Dockerfile defines how to build image**
3. **Layers = optimization (caching)**
4. **Docker Hub = registry for sharing images**
5. **Volumes = persistent data**
6. **Docker Compose = run multiple containers together**

---

## TL;DR

Docker packages your app + all dependencies into an image. Run the image as containers. Everyone gets exact same environment. Solves "it works on my machine" problem. Use Dockerfile to define image. Use Docker Compose for multiple services. No more "but it works on my laptop!"
