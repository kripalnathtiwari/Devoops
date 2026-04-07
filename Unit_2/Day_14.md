# Day 14: Custom Docker Image & Dockerfile Deep Dive 🚀

---

## 1. Image Layering (VERY IMPORTANT)

Docker images are not a single file, but a **stack of layers**.

---

### 🔹 How Layering Works

Each Dockerfile instruction creates a new layer:


FROM node:18
RUN apt-get update
COPY . .
RUN npm install
CMD ["node", "app.js"]


👉 Layers created:

- Base OS (node:18)  
- Installed packages  
- Copied files  
- Installed dependencies  
- Run command  

---

### 🔥 Why Layering Matters

#### ✔ Caching (Important for Interviews)

- If nothing changes → Docker reuses old layers  
- Builds become much faster  

---

#### ✔ Efficiency

- Only changed layers are rebuilt  

---

#### ✔ Reusability

- Multiple images share common layers  

---

### ⚠️ Optimization Tip

#### ❌ Bad Practice

COPY . .
RUN npm install


#### ✔ Good Practice

COPY package.json .
RUN npm install
COPY . .


👉 Prevents reinstalling dependencies every time

---

## 2. Build Context & .dockerignore

### 🔹 Build Context


docker build .


👉 `.` = current directory = build context  

Docker sends **all files** to daemon.

---

### 🔥 Problem

Unnecessary files slow builds:

- node_modules  
- .git  
- logs  

---

### 🧹 .dockerignore

Example:

node_modules
.git
*.log
.env


✔ Reduces image size  
✔ Improves build speed  
✔ Prevents sensitive data leaks  

---

## 3. Dockerfile (Heart of Image Creation)

### 🔹 Basic Structure


FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "app.js"]


---

## 4. Dockerfile Instructions

| Instruction | Purpose |
|------------|--------|
| FROM | Base image |
| RUN | Execute commands |
| COPY | Copy files |
| ADD | Advanced copy (avoid if possible) |
| WORKDIR | Set working directory |
| CMD | Default command |
| ENTRYPOINT | Fixed command |
| ENV | Environment variables |
| EXPOSE | Document port |
| VOLUME | Persistent storage |

---

### 🔥 CMD vs ENTRYPOINT

| Feature | CMD | ENTRYPOINT |
|--------|-----|------------|
| Override | Yes | No |
| Use Case | Default args | Main command |

---

## 5. Image Creation (Build Process)

### 🔹 Steps

1. Docker reads Dockerfile  
2. Sends build context  
3. Executes instructions  
4. Creates layers  
5. Uses cache  
6. Generates final image  

---

### 🔹 Command

docker build -t myapp:1.0 .


✔ `-t` → tag  
✔ `.` → build context  

---

## 6. Image Tagging & Versioning

### 🔹 Format

<image_name>:<tag>


### Examples:

myapp:1.0
node:18
ubuntu:latest


---

### 🔥 Important Points

- `latest` is just a label  
- Always use versioning:


myapp:1.0
myapp:prod
myapp:dev


---

### Tag Command

docker tag myapp:1.0 myapp:latest


---

### List Images

docker images


---

# 🧪 7. Practical: Custom Nginx Docker Image

---

## Step 1: Create HTML File

### index.html
<!DOCTYPE html> <html> <head> <title>My App</title> <style> body { background: #111; color: #fff; text-align: center; margin-top: 50px; } </style> </head> <body> <h1>Hello World from Custom Docker Image 🚀</h1> </body> </html> ```
Step 2: Create Nginx Config
default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
Step 3: Create Dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
Step 4: Project Directory Structure
project/
│
├── Dockerfile
├── index.html
└── default.conf
Step 5: Build Image
docker build -t custom-nginx:v1 .
Step 6: Run Container
docker run -d -p 8080:80 --name nginx-container custom-nginx:v1
Step 7: Verify Output

Open browser:

http://localhost:8080

✔ You should see your custom "Hello World" page

8. Key Learnings 🧠
Docker images are built using layering
.dockerignore is critical for optimization
Dockerfile is the core of image creation
Custom images allow full control over applications
Nginx can be easily customized using config + HTML
9. Summary
Dockerfile → Build → Image → Run → Container → Access via Browser
10. Conclusion
Successfully created a custom Docker image
Deployed a web server using Nginx
Learned image optimization and layering
Understood real-world Docker workflow

---

If you want next level upgrade, I can build:

- 🔥 **Day 15: Docker Compose (multi-container app like frontend + backend + DB)**
- ⚙️ **Mini Project (production-level setup with volumes + env + nginx reverse proxy)**