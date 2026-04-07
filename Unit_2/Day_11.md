# Day 11: Deploying a Web Server using Docker (httpd)

---

## 1. Problem Statement

You are required to:

- Pull an Apache HTTP server image (`httpd`)
- Run a container and expose it on a specific port
- Modify the default web page inside the container
- Verify the output using browser/command
- Stop and remove the container after execution

---

## 2. Steps & Commands

### Step 1: Pull httpd Image

docker pull httpd


- Downloads Apache HTTP server image from Docker Hub

---

### Step 2: Run Container

docker run -d --name amish -p 8080:80 httpd


### Explanation:

- `-d` → Run in background  
- `--name amish` → Container name  
- `-p 8080:80` → Maps host port 8080 to container port 80  

---

### Step 3: Modify Web Page Inside Container

docker exec -it amish bash -c "echo '<h1>Hello from Docker</h1>' > /usr/local/apache2/htdocs/index.html"


### Explanation:

- `docker exec` → Run command inside container  
- `bash -c` → Execute inline command  
- Replaces default index page with custom HTML  

---

### Step 4: Verify Output

curl http://localhost:8080


### Expected Output:
<h1>Hello from Docker</h1> ``` id="d11out"
Step 5: Stop Container
docker stop amish
``` id="d11s5"

---

### Step 6: Remove Container

docker rm amish


---

## 3. Key Learnings 🧠

- How to deploy a web server using Docker  
- Port mapping between host and container  
- Using `docker exec` to modify container files  
- Testing application using `curl`  
- Container lifecycle management  

---

## 4. Flow Summary


pull → run → exec (modify) → verify → stop → remove


---

## 5. Conclusion

- Successfully deployed Apache server in container  
- Modified web content dynamically  
- Verified using localhost  
- Cleaned up container after use  
