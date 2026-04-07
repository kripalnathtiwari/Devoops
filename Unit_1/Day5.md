# Day 5: Docker & Docker Hub

---

## 1. Introduction to Docker Hub

### Definition
**Docker Hub** is a centralized cloud-based repository used to **store, manage, and distribute Docker images**.

---

### Key Features

- Public and Private repositories
- Official Images (verified and optimized)
- Automated Builds (CI/CD integration)
- Version control for images
- Easy sharing across teams

---

### Importance in DevOps

- Acts as a **central storage for container images**
- Enables **Build Once, Deploy Anywhere**
- Integrates seamlessly with CI/CD pipelines
- Ensures consistency across environments

---

## 2. Key Components of Docker

### 1. Docker Client

- The interface through which users interact with Docker
- Sends commands to Docker Daemon

**Example:**
docker run ubuntu

---

### 2. Docker Daemon

- Background service running on host
- Responsible for:
  - Building images
  - Running containers
  - Managing Docker objects

---

### 3. Docker Images

- Read-only templates used to create containers
- Built using Dockerfile

**Example:**
ubuntu, nginx

---

### 4. Container

- Running instance of a Docker image
- Lightweight and isolated environment

**Example:**
Running an Ubuntu container:
docker run ubuntu


---

### 5. Docker Registry

- Storage system for Docker images
- Docker Hub is the default registry

**Example:**
docker pull nginx


---

## 3. Docker Architecture Overview

### Flowchart
Docker Client
↓
Docker Daemon
↓
| Images | Containers | Networks |
  ↓

Docker Registry (Docker Hub)


---

## 4. Why Docker over Virtual Machine?

| Feature | Docker | Virtual Machine |
|--------|--------|----------------|
| OS | Shares host OS | Separate OS |
| Size | Small (MBs) | Large (GBs) |
| Startup Time | Seconds | Minutes |
| Performance | High | Moderate |
| Resource Usage | Low | High |
| Portability | High | Moderate |

---

## 5. Basic Docker Commands (Ubuntu)

### Pull Ubuntu Image
docker pull ubuntu

---

### List Images
docker images

---

### Run Ubuntu Container
docker run ubuntu

---

### Run Interactive Ubuntu Container
docker run -it ubuntu /bin/bash

---

### Stop Container
docker stop <container_id>

---

### Exit Container
exit

---

### Remove Container
docker rm <container_id>

---

### Remove Image
docker rmi <image_id>


---

### Clean System (Remove all unused data)
docker system prune -a

---

### Remove Volumes Also
docker system prune -a --volumes

---

## 6. Basic Docker Commands (Nginx)

### Pull Nginx Image
docker pull nginx

---

### List Images
docker images

---

### Run Nginx Container

docker run -d -p 8080:80 --name mynginx nginx

---

### Explanation of Flags

- `-d` → Run container in background (detached mode)
- `-p` → Port mapping (host:container)
- `--name` → Assign name to container

---

### Access Nginx

Open browser:
http://localhost:8080

---

## 7. Summary

- Docker Hub is a **central image repository**
- Docker uses **client-server architecture**
- Containers are **lightweight and fast**
- Docker is preferred over VMs due to **efficiency and speed**
- Commands like `pull`, `run`, `stop`, `rm` are essential for daily usage
