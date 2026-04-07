# Day 7: Docker Cleanup Commands 🧹

---

## 1. Why Cleanup is Important?

Docker keeps accumulating:

- Stopped containers
- Unused images
- Dangling volumes
- Unused networks

This can lead to:
- Disk space issues
- System slowdown

👉 Cleanup helps maintain a **healthy Docker environment**

---

## 2. Container Cleanup

### Stop All Running Containers

docker stop $(docker ps -aq)


- Stops all running containers
- `docker ps -aq` → returns all container IDs

---

### Remove Stopped Containers

docker container prune


- Deletes all stopped containers

---

### Remove Specific Container

docker rm <container_id>


---

### Force Remove Running Container

docker rm -f <container_id>


---

## 3. Image Cleanup

### Remove Specific Image

docker rmi <image_id>


---

### Remove Dangling Images

docker image prune


---

### Remove All Unused Images

docker image prune -a


---

## 4. Volume Cleanup

### Remove Unused Volumes

docker volume prune


---

### Remove Specific Volume

docker volume rm <volume_name>


---

## 5. Network Cleanup

### Remove Unused Networks

docker network prune


---

### Remove Specific Network

docker network rm <network_name>


---

## 6. System Cleanup (Most Important 🔥)

### Remove Everything Unused

docker system prune


---

### Aggressive Cleanup

docker system prune -a


---

### Cleanup Including Volumes

docker system prune -a --volumes


⚠️ This deletes EVERYTHING unused including volumes

---

## 7. Quick Cleanup Summary Table

| Command | Purpose |
|--------|--------|
| docker stop $(docker ps -aq) | Stop all containers |
| docker container prune | Remove stopped containers |
| docker image prune | Remove dangling images |
| docker image prune -a | Remove all unused images |
| docker volume prune | Remove unused volumes |
| docker network prune | Remove unused networks |
| docker system prune | Basic cleanup |
| docker system prune -a --volumes | Full cleanup |

---

## 8. Best Practices ⚠️

- Always check before deleting:

docker ps -a
docker images
docker volume ls


- Avoid deleting volumes unless sure
- Use cleanup commands carefully in production

---

## 9. Summary

- Use `docker stop $(docker ps -aq)` to stop all containers quickly
- Cleanup improves **performance and storage**
- `docker system prune -a --volumes` is the **ultimate cleanup command**