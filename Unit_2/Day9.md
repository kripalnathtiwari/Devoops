# Day 9: Docker Commands & Environment Variables

---

## 1. Basic Docker Commands

| Command | Description |
|--------|-------------|
| docker --version | Displays Docker version installed on system |
| docker info | Shows detailed system-wide Docker information |
| docker history <image_name> | Shows history and layers of a Docker image |
| docker pull <image_name> | Pulls image from Docker Hub |
| docker images | Lists all Docker images available locally |
| docker run [options] <image> | Creates and starts a container from image |

---

## 2. docker run Options (Detailed)

| Option | Description |
|--------|-------------|
| -it | Runs container in interactive mode with terminal |
| -d | Runs container in background (detached mode) |
| --name | Assigns a custom name to container |
| --rm | Automatically removes container after stop |
| -p | Maps host port to container port |
| -e / --env | Sets environment variables inside container |
| -v | Mounts volume for persistent storage |

---

## 3. Environment Variables in Docker (-e)

### Docker without -e ❌ vs Docker with -e ✅

| Without -e | With -e |
|-----------|--------|
| Config must be hardcoded in image | Same image → different behavior |
| Need to rebuild image for changes | No rebuild required |
| Less flexible | Highly flexible |
| Not secure | Secure configuration handling |

---

## 4. Example: Using Environment Variables

### Example 1: Basic Environment Variable

docker run -e MY_VAR=value httpd env


- Sets `MY_VAR=value`
- Runs container from `httpd` image
- `env` command prints environment variables inside container

---

### Example 2: Interactive Environment Variable

docker run -it -e MY_NAME=Amish ubuntu bash


Inside container:

echo $MY_NAME


#### Note:
- Variable exists only inside container
- Host system is NOT affected

---

### Example 3: Multiple Environment Variables

docker run -e APP_ENV=prod -e APP_VERSION=1.0 nginx


---

### Example 4: MySQL Container Setup

docker run -d
-e MYSQL_ROOT_PASSWORD=root123
-e MYSQL_DATABASE=college
-e MYSQL_USER=admin
-e MYSQL_PASSWORD=admin@123
mysql


- Configures MySQL container using environment variables
- Used in real-world applications

---

## 5. Why Environment Variables are Important

- Enable dynamic configuration
- Avoid hardcoding sensitive data
- Used in:
  - Microservices architecture
  - Cloud deployments
  - CI/CD pipelines

---

## 6. Summary

- `docker run` is the most important command
- `-e` allows flexible configuration
- Same image can behave differently using env variables
- Essential for scalable and production-ready systems