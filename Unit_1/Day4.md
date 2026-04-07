# Day 4: Container Images & Image Registry

---

## 1. Container Image

### Definition
A **container image** is a lightweight, standalone, executable package that includes everything needed to run an application.

---

### What Does a Container Image Contain?

- Application code
- Runtime (e.g., Java, Python)
- Libraries and dependencies
- Environment variables
- Configuration files
- System tools

---

### Important Concept: Images are Immutable ⚠️

- Once an image is created, **it cannot be modified**
- Any change results in a **new image version**
- Ensures:
  - Consistency
  - Reliability
  - Reproducibility

---

## 2. Image Layering System

### Definition
Container images are built in **layers**, where each layer represents a set of changes.

---

### How Layering Works

- Each instruction in a Dockerfile creates a new layer
- Layers are **stacked on top of each other**
- Layers are **read-only**
- Only the top layer (container layer) is writable

---

### Benefits of Layering

- Faster builds (reuse existing layers)
- Efficient storage (shared layers)
- Faster image transfer (only new layers pushed/pulled)

---

## 3. Image Registry

### Definition
An **image registry** is a centralized repository used to:

- Store container images
- Manage versions
- Distribute images

---

### It Enables

- Sharing images across teams and environments
- Consistent deployment (dev, test, production)
- Integration with CI/CD pipelines

---

### Analogy

| System | Purpose |
|-------|--------|
| GitHub | Source code |
| Maven Central | Java libraries |
| Image Registry | Container images |

---

## 4. Why Image Registry is Required?

### Without Registry ❌

- Each system builds image independently
- High inconsistency across environments
- Manual software installation
- No version control

---

### With Registry ✅

- Build once, deploy everywhere
- Faster deployment
- Version-controlled environments
- Rollback capabilities

---

## 5. Types of Image Registry

### 1. Public Image Registry

Public registries allow open access.

#### Characteristics

- Images are publicly visible
- Anyone can pull images
- Often free
- Used for base images and open-source apps

---

### 2. Private Image Registry

Restricted access using authentication and authorization.

#### Characteristics

- Secure and controlled access
- Used in enterprises
- Stores proprietary applications
- Integrated with IAM and RBAC

---

### Examples

- AWS ECR
- Azure Container Registry (ACR)
- GitHub Container Registry (GHCR)
- On-premise private registry

---

## 6. Image Naming Convention

### Format
<registry>/<namespace>/<image>:<tag>


### Example
docker.io/amish/webapp:v1






---

### Components

| Component | Meaning |
|----------|--------|
| Registry | Location of image |
| Namespace | User or organization |
| Image | Application name |
| Tag | Version or label |

---

## 7. Tags and Versioning

| Tag | Purpose |
|-----|--------|
| latest | Default (not recommended for development) |
| v1, v2 | Versioning |
| dev | Development environment |
| qa | Testing environment |
| prod | Production environment |

---

## 8. Image Distribution Process

### Flow

1. Developer builds image locally  
2. Image is pushed to registry  
3. Registry stores image  

---

### Push Operation

- Uploads image layers to registry
- Requires authentication
- Only new layers are pushed

---

### Pull Operation

- Downloads image layers from registry
- Uses caching to avoid re-downloading existing layers

---

## 9. Role of Image Registry in CI/CD Pipeline

### Workflow

1. Code is committed to Git  
2. CI system builds container image  
3. Image is pushed to registry  
4. CD system pulls the image  
5. Application is deployed automatically  

---

### Key Insight

> Image registry acts as a **bridge between CI and CD**

---

## 10. Difference Between Public and Private Registry

| Feature | Public Registry | Private Registry |
|--------|----------------|------------------|
| Access | Open to everyone | Restricted |
| Security | Low | High |
| Usage | Open-source, base images | Enterprise applications |
| Cost | Often free | Paid / Managed |
| Control | Limited | Full control |
| Examples | Docker Hub | AWS ECR, ACR, GHCR |

---

## 11. Summary

- Container images are **immutable and layered**
- Image registries enable **storage, sharing, and versioning**
- They are essential for **CI/CD pipelines**
- Public vs Private registries differ in **access and security**