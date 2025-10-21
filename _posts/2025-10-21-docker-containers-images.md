---
layout: post
title: "Docker: Containers, Images, and Registries Through LEGO Sets"
date: 2025-10-21
tags: [system-design]
analogy_domain: "toys"
series: "system-design"
series_title: "System Design Fundamentals"
series_order: 2
excerpt: "Understand Docker containers, images, and registries through LEGO sets. Learn how Docker ensures your application runs the same everywhere, just like LEGO instructions build the same model every time."
description: "A comprehensive guide to Docker concepts using LEGO analogies. Covers containers, images, Dockerfile, Docker Hub, volumes, and Docker Compose for senior developers."
keywords: docker, containers, docker images, dockerfile, containerization, devops, microservices, docker compose
related_concepts:
  - "Kubernetes and container orchestration"
  - "Microservices architecture"
  - "CI/CD pipelines"
---

## The Problem

"It works on my machine!" is every developer's nightmare. Your application runs perfectly on your laptop but crashes in production. Dependencies conflict, environment variables differ, system libraries mismatch. Setting up a new developer's machine takes days. Deploying updates risks breaking everything. You need a way to package your application with everything it needs to run, consistently, everywhere.

---

## The Analogy

**Think of Docker like LEGO sets.**

### The Challenge: Building Without Instructions

Imagine trying to build a complex LEGO model without instructions:
- Someone tells you "just use these pieces"
- They send you a bag of random LEGO blocks
- You try to recreate what they built
- Different pieces, wrong colors, missing parts
- Your model looks nothing like theirs

**This is deploying applications without Docker:**
- "Just install Python 3.9, PostgreSQL, Redis..."
- Everyone has different versions
- Missing dependencies
- Works differently on each machine

### Docker Image = LEGO Instruction Manual

A LEGO instruction manual is a **step-by-step blueprint**:
- Page 1: Start with base plate
- Page 2: Add 4 red bricks here
- Page 3: Add 2 blue bricks there
- Page 4: Attach the roof piece
- **Result:** Everyone following these instructions builds the EXACT same model

<div class="mermaid">
graph TB
    Manual[LEGO Instruction Manual] --> Step1[Step 1: Base plate]
    Step1 --> Step2[Step 2: Add foundation bricks]
    Step2 --> Step3[Step 3: Build walls]
    Step3 --> Step4[Step 4: Add roof]
    Step4 --> Final[Completed Model]

    style Manual fill:#3498db
    style Final fill:#2ecc71
</div>

**A Docker Image works the same way:**

```dockerfile
# Dockerfile = LEGO instruction manual
FROM ubuntu:20.04          # Step 1: Start with base plate (base OS)

RUN apt-get update         # Step 2: Prepare pieces (update packages)

RUN apt-get install -y \   # Step 3: Add foundation (install dependencies)
    python3.9 \
    postgresql-client

COPY app.py /app/          # Step 4: Add your custom pieces (your code)

CMD ["python3", "/app/app.py"]  # Step 5: Final instruction (run app)
```

**Result:** Everyone building from this Dockerfile gets the EXACT same environment.

### Docker Container = Built LEGO Model

Once you follow the instructions, you have a **built model**:
- It's a physical thing you can touch
- You can display it on your shelf
- You can take it down and rebuild later
- Each person builds their own copy from the same instructions

<div class="mermaid">
graph LR
    Instructions[LEGO Instructions] --> Build1[Your Built Model]
    Instructions --> Build2[Friend's Built Model]
    Instructions --> Build3[Another Built Model]

    Build1 --> Shelf1[Your Shelf]
    Build2 --> Shelf2[Friend's Shelf]
    Build3 --> Shelf3[Another Shelf]

    style Instructions fill:#3498db
    style Build1 fill:#2ecc71
    style Build2 fill:#2ecc71
    style Build3 fill:#2ecc71
</div>

**A Docker Container is the same:**

```bash
# Build LEGO model from instructions
docker build -t my-app:v1 .

# Create instances of the built model (containers)
docker run my-app:v1  # First model on shelf
docker run my-app:v1  # Second model on shelf
docker run my-app:v1  # Third model on shelf

# Each container is an independent running instance
# All built from the same image (instructions)
```

### Docker Hub = LEGO Store

The LEGO store has thousands of instruction manuals:
- Star Wars sets
- City sets
- Architecture sets
- You can buy any manual and build at home
- Everyone building "Death Star #75159" follows the same instructions

<div class="mermaid">
graph TB
    Store[LEGO Store<br/>Docker Hub] --> StarWars[Star Wars Set<br/>nginx:latest]
    Store --> City[City Set<br/>postgres:14]
    Store --> Architecture[Architecture Set<br/>redis:alpine]

    StarWars --> You1[You Build It<br/>docker run nginx]
    City --> You2[You Build It<br/>docker run postgres]
    Architecture --> You3[You Build It<br/>docker run redis]

    style Store fill:#e74c3c
    style StarWars fill:#3498db
    style City fill:#3498db
    style Architecture fill:#3498db
</div>

**Docker Hub is the same:**

```bash
# Download instruction manual from LEGO store (pull image from Docker Hub)
docker pull nginx:latest
docker pull postgres:14
docker pull redis:alpine

# Build the models (run containers)
docker run nginx:latest
docker run postgres:14
docker run redis:alpine

# Anyone, anywhere can pull these same images
# Everyone gets identical results
```

### Layers = Building in Steps

LEGO instructions build layer by layer:
- **Layer 1:** Base plate (foundation)
- **Layer 2:** First row of bricks
- **Layer 3:** Walls
- **Layer 4:** Roof
- Each layer builds on the previous

If you want to change just the roof:
- Keep layers 1-3
- Only rebuild layer 4
- Much faster!

<div class="mermaid">
graph TB
    subgraph "LEGO Layers = Docker Image Layers"
        L1[Layer 1: Base plate<br/>FROM ubuntu:20.04]
        L2[Layer 2: Foundation<br/>RUN apt-get update]
        L3[Layer 3: Dependencies<br/>RUN apt-get install python3]
        L4[Layer 4: Your code<br/>COPY app.py /app/]
        L5[Layer 5: Configuration<br/>ENV PORT=8080]
    end

    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5

    style L1 fill:#3498db
    style L2 fill:#3498db
    style L3 fill:#3498db
    style L4 fill:#e74c3c
    style L5 fill:#e74c3c
</div>

**Docker uses the same layered approach:**

```dockerfile
# Each instruction creates a layer
FROM ubuntu:20.04        # Layer 1 (cached, shared)
RUN apt-get update       # Layer 2 (cached, shared)
RUN apt-get install -y python3  # Layer 3 (cached, shared)
COPY app.py /app/        # Layer 4 (changes frequently)
ENV PORT=8080            # Layer 5 (changes frequently)

# If you only change app.py:
# - Layers 1-3 are reused (cached)
# - Only rebuild layers 4-5
# Builds in seconds instead of minutes!
```

### Volumes = Shared Storage Box

Imagine you want to save your LEGO creation's modifications:
- You build the model from instructions
- You add custom pieces not in the manual
- You want those customizations to persist
- You store them in a separate storage box
- If you rebuild the model, you can reattach your custom parts

<div class="mermaid">
graph LR
    Instructions[Instructions] --> Model[Built LEGO Model]
    Storage[Storage Box<br/>Your Custom Pieces] -.Attached.-> Model

    Model --> Destroy[Disassemble]
    Destroy --> Rebuild[Rebuild from Instructions]
    Storage -.Still There.-> Rebuild

    style Storage fill:#f39c12
    style Model fill:#2ecc71
</div>

**Docker volumes work the same way:**

```bash
# Container without volume (data lost when removed)
docker run postgres:14
# Store data inside container
# Remove container → data gone!

# Container with volume (data persists)
docker run -v my-data:/var/lib/postgresql/data postgres:14
# my-data volume = storage box
# Data stored in volume, not container
# Remove container → data still in volume!
# New container can attach to same volume

# Volume persists independently
docker rm my-postgres-container  # Container gone
docker run -v my-data:/var/lib/postgresql/data postgres:14
# New container, same data!
```

### Docker Compose = LEGO City Plan

Building a LEGO city requires multiple sets:
- Train station set
- Fire station set
- Police station set
- Road plates
- They need to connect and work together

Instead of building each individually, you have a **master plan**:

```yaml
# LEGO City Plan (docker-compose.yml)
LEGO City:
  Train Station:
    - Use set #60050
    - Place at coordinates (0, 0)
    - Connect to main road

  Fire Station:
    - Use set #60215
    - Place at coordinates (10, 0)
    - Connect to train station road

  Police Station:
    - Use set #60246
    - Place at coordinates (20, 0)
    - Connect to fire station
```

<div class="mermaid">
graph TB
    Plan[LEGO City Plan<br/>docker-compose.yml]

    Plan --> Train[Train Station<br/>Web Server]
    Plan --> Fire[Fire Station<br/>Database]
    Plan --> Police[Police Station<br/>Cache]

    Train <--> Fire
    Train <--> Police
    Fire <--> Police

    style Plan fill:#9b59b6
    style Train fill:#2ecc71
    style Fire fill:#2ecc71
    style Police fill:#2ecc71
</div>

**Docker Compose works the same way:**

```yaml
# docker-compose.yml = LEGO city plan
version: '3.8'

services:
  web:                    # Train station
    image: nginx:latest
    ports:
      - "80:80"
    depends_on:
      - database

  database:               # Fire station
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

  cache:                  # Police station
    image: redis:alpine

volumes:
  db-data:                # Shared storage

# Start entire city with one command
# docker-compose up
# All sets built, connected, and running!
```

### How It Maps

| LEGO Concept | Docker Concept | Key Point |
|--------------|----------------|-----------|
| **Instruction manual** | Docker Image | Blueprint for building |
| **Built LEGO model** | Docker Container | Running instance |
| **LEGO store** | Docker Hub | Repository of images |
| **Building steps** | Dockerfile instructions | How to create image |
| **Layers of bricks** | Image layers | Cached, reusable steps |
| **Storage box** | Docker Volume | Persistent data |
| **City plan** | Docker Compose | Multi-container orchestration |
| **Disassemble model** | Stop/remove container | Container is temporary |
| **Rebuild from instructions** | Recreate container | Image remains unchanged |

---

## The Technical Deep Dive

### Docker Image vs Container

**Image = Recipe (Immutable)**

```bash
# Build image from Dockerfile (create recipe)
docker build -t my-app:v1 .

# Image is read-only
# Can't modify an image
# Must rebuild to make changes

# List images
docker images
# REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
# my-app       v1        abc123...      2 mins ago    200MB
```

**Container = Meal (Running instance)**

```bash
# Create containers from image (cook meals from recipe)
docker run --name instance1 my-app:v1
docker run --name instance2 my-app:v1
docker run --name instance3 my-app:v1

# Each container is independent
# All created from same image
# Changes in one container don't affect others

# List running containers
docker ps
# CONTAINER ID   IMAGE        COMMAND     STATUS       NAMES
# def456...      my-app:v1    "python3"   Up 5 mins    instance1
# ghi789...      my-app:v1    "python3"   Up 3 mins    instance2
```

**Key difference:**
- **1 Image** → Can create **many Containers**
- Image is template → Container is instance
- Image is blueprint → Container is building

### Dockerfile: The Instruction Manual

```dockerfile
# Start with base LEGO plate (base image)
FROM python:3.9-slim
# FROM = which instruction manual to start with
# python:3.9-slim = pre-made LEGO base with Python installed

# Set working directory (which shelf to build on)
WORKDIR /app

# Copy dependency list (which pieces you need)
COPY requirements.txt .

# Install dependencies (get LEGO pieces)
RUN pip install --no-cache-dir -r requirements.txt
# RUN = execute command during build
# This creates a layer

# Copy application code (add custom pieces)
COPY . .
# COPY = add files from your computer into image

# Expose port (how to access the model)
EXPOSE 8000
# Documentation: this app uses port 8000

# Define startup command (what the model does when activated)
CMD ["python", "app.py"]
# CMD = command to run when container starts
```

**Build and run:**

```bash
# Build image (follow LEGO instructions)
docker build -t my-python-app:v1 .

# Run container (display built model)
docker run -p 8000:8000 my-python-app:v1

# Access at http://localhost:8000
```

### Layer Caching: Building Efficiently

**Without caching (slow):**

```dockerfile
FROM python:3.9-slim
COPY . .                          # Copy everything
RUN pip install -r requirements.txt
CMD ["python", "app.py"]

# Change one line of code in app.py
# Rebuild: ALL layers rebuild (slow!)
# Like rebuilding entire LEGO model for one piece change
```

**With caching (fast):**

```dockerfile
FROM python:3.9-slim              # Layer 1: Cached
COPY requirements.txt .           # Layer 2: Cached (unchanged)
RUN pip install -r requirements.txt  # Layer 3: Cached (unchanged)
COPY . .                          # Layer 4: Rebuilt (code changed)
CMD ["python", "app.py"]          # Layer 5: Rebuilt

# Change app.py
# Rebuild: Layers 1-3 cached, only 4-5 rebuild (fast!)
# Like keeping LEGO base intact, only changing top pieces
```

**Best practice: Order by change frequency**

```dockerfile
# ✅ GOOD: Least changing to most changing
FROM python:3.9-slim         # Rarely changes
COPY requirements.txt .      # Changes occasionally
RUN pip install -r requirements.txt
COPY . .                     # Changes frequently (your code)
CMD ["python", "app.py"]

# ❌ BAD: Code copied early
FROM python:3.9-slim
COPY . .                     # Changes frequently
RUN pip install -r requirements.txt  # Reinstalls every time!
CMD ["python", "app.py"]
```

### Docker Hub: Public LEGO Store

**Pulling official images:**

```bash
# Download from Docker Hub
docker pull nginx:latest          # Web server
docker pull postgres:14           # Database
docker pull redis:alpine          # Cache
docker pull node:18-alpine        # Node.js runtime
docker pull mysql:8               # MySQL database

# See what you've downloaded
docker images

# Run them
docker run -d -p 80:80 nginx:latest
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:14
```

**Publishing your own image:**

```bash
# Build your image
docker build -t myusername/my-app:v1 .

# Login to Docker Hub
docker login

# Push to Docker Hub (share your LEGO instructions)
docker push myusername/my-app:v1

# Anyone can now pull and use
docker pull myusername/my-app:v1
```

### Volumes: Persistent Storage

**Problem without volumes:**

```bash
# Start database container
docker run --name mydb postgres:14

# Insert data
docker exec mydb psql -c "INSERT INTO users VALUES ('Alice')"

# Stop and remove container
docker stop mydb
docker rm mydb

# Start new container
docker run --name mydb postgres:14

# Data is GONE!
# Like disassembling LEGO and losing custom pieces
```

**Solution with volumes:**

```bash
# Create named volume (storage box)
docker volume create postgres-data

# Run container with volume attached
docker run --name mydb \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:14

# Insert data
docker exec mydb psql -c "INSERT INTO users VALUES ('Alice')"

# Stop and remove container
docker stop mydb
docker rm mydb

# Start new container with SAME volume
docker run --name mydb \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:14

# Data is STILL THERE!
# Volume persists independently of container
```

**Volume types:**

```bash
# Named volume (recommended)
docker run -v my-data:/app/data my-app

# Bind mount (link to host directory)
docker run -v /host/path:/container/path my-app

# Anonymous volume (temporary)
docker run -v /app/data my-app
```

### Docker Compose: Orchestrating Multiple Containers

**Without Docker Compose (manual):**

```bash
# Create network
docker network create my-network

# Start database
docker run -d \
  --name postgres \
  --network my-network \
  -e POSTGRES_PASSWORD=secret \
  -v db-data:/var/lib/postgresql/data \
  postgres:14

# Start cache
docker run -d \
  --name redis \
  --network my-network \
  redis:alpine

# Start web server
docker run -d \
  --name web \
  --network my-network \
  -p 80:80 \
  -e DATABASE_URL=postgres://postgres:secret@postgres:5432/db \
  -e REDIS_URL=redis://redis:6379 \
  my-web-app

# Tedious! Easy to make mistakes!
```

**With Docker Compose (automated):**

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/db
      REDIS_URL: redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

  cache:
    image: redis:alpine

volumes:
  db-data:

# One command to start everything!
```

```bash
# Start entire application stack
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Stop and remove volumes (reset data)
docker-compose down -v
```

### Complete Example: Blog Application

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies (cache this layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build frontend
RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  blog:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://bloguser:blogpass@database:5432/blogdb
      REDIS_URL: redis://cache:6379
      NODE_ENV: production
    depends_on:
      - database
      - cache
    restart: unless-stopped

  database:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: blogpass
      POSTGRES_DB: blogdb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

  cache:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres-data:
```

**Usage:**

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f blog

# Execute commands in running container
docker-compose exec blog npm run migrate

# Scale service
docker-compose up -d --scale blog=3
```

### Common Docker Commands

```bash
# Images
docker images                    # List images
docker build -t name:tag .       # Build image
docker pull image:tag            # Download image
docker push image:tag            # Upload image
docker rmi image:tag             # Remove image

# Containers
docker ps                        # List running containers
docker ps -a                     # List all containers
docker run image                 # Create and start container
docker start container           # Start stopped container
docker stop container            # Stop running container
docker rm container              # Remove container
docker logs container            # View container logs
docker exec -it container bash   # Access container shell

# Volumes
docker volume ls                 # List volumes
docker volume create name        # Create volume
docker volume rm name            # Remove volume
docker volume prune              # Remove unused volumes

# Networks
docker network ls                # List networks
docker network create name       # Create network
docker network rm name           # Remove network

# Cleanup
docker system prune              # Remove unused data
docker system prune -a           # Remove all unused data
docker system df                 # Show disk usage
```

---

## Where the Analogy Breaks Down

1. **LEGO models are static** - Containers run processes and do work
2. **LEGO instructions don't update themselves** - Base images get security updates
3. **LEGO pieces are physical** - Containers share the host kernel (lightweight)
4. **Disassembling LEGO is manual** - Containers can auto-restart and self-heal
5. **LEGO sets have limited pieces** - Containers can scale infinitely

---

## Best Practices

**1. Keep images small**

```dockerfile
# ❌ BAD: Large base image
FROM ubuntu:latest
RUN apt-get install python3

# ✅ GOOD: Slim base image
FROM python:3.9-alpine
```

**2. Use .dockerignore**

```
# .dockerignore (like .gitignore)
node_modules
.git
.env
*.log
```

**3. Don't run as root**

```dockerfile
# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

**4. Use multi-stage builds**

```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

**5. Health checks**

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1
```

---

## TL;DR

Docker is like LEGO sets. A **Docker image** is the instruction manual (blueprint) that defines how to build your application environment. A **Docker container** is the built model (running instance) created from those instructions. **Docker Hub** is like the LEGO store where you can download instruction manuals (images) created by others. Images are built in **layers** like LEGO steps, allowing caching and reuse. **Volumes** are like storage boxes that keep your custom pieces (data) even when you disassemble the model (remove container). **Docker Compose** is like a city plan that coordinates multiple LEGO sets (containers) to work together. Unlike VMs that need entire operating systems, containers are lightweight because they share the host kernel - like LEGO models sharing the same base plate. The key insight: Docker ensures your application runs the same everywhere, just like LEGO instructions build the same model every time, eliminating "it works on my machine" problems.
