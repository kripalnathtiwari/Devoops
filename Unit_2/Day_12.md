# Day 12: Using docker run with -it, -e, -v and --name

---

## 1. Problem Statement

You need to run a Docker container with the following requirements:

- Set an environment variable `APP_ENV=production`
- Bind a local directory `/app/data` to `/data` inside the container
- Assign a custom name `my-app` to the container
- Run the container in interactive mode

---

## 2. Step-by-Step Commands

### Step 1: Pull Ubuntu Image

docker pull ubuntu


---

### Step 2: Run Container with Required Options

docker run -it --name my-app -e APP_ENV=production -v /app/data:/data ubuntu /bin/bash


---

### Explanation of Options

| Option | Purpose |
|--------|--------|
| -it | Interactive terminal |
| --name my-app | Assigns container name |
| -e APP_ENV=production | Sets environment variable |
| -v /app/data:/data | Binds host directory to container |

---

## 3. Alternative (Windows Setup)

### Step 1: Create Local Directory

mkdir C:/app/data


---

### Step 2: Run Container

docker run -it --name my-app -e APP_ENV=production -v C:/app/data:/data ubuntu /bin/bash


---

## 4. Verify Inside Container

### Check Environment Variable

echo $APP_ENV


Expected Output:

production


---

### Create File in Mounted Volume

echo "hello" > /data/test.txt


---

## 5. Verify from Host System

Check if file exists in local directory:


C:/app/data/test.txt


✔ Confirms volume binding is working

---

## 6. Key Observations 🧠

- Environment variable is accessible inside container only  
- Volume creates a **two-way sync** between host and container  
- Changes inside container reflect on host system  
- No need to rebuild image for configuration changes  

---

## 7. Flow Summary


pull → run (-it -e -v --name) → verify env → create file → check host


---

## 8. Conclusion

- Successfully used multiple docker run options together  
- Understood environment variables and volume binding  
- Verified real-time data sharing between host and container  
