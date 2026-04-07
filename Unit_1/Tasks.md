# Task1: Troubleshooting a Running Container

---

## Objective

You need to troubleshoot a running container by:

- Accessing its terminal
- Checking logs
- Viewing running processes

---

## Commands

### 1. Open Bash Inside Container

docker exec -it <container_id> /bin/bash


---

### 2. View Container Logs

docker logs <container_id>


---

### 3. Show Running Processes

docker top <container_id>


---

## Summary

- `docker exec -it` → Access container shell  
- `docker logs` → Debug using logs  
- `docker top` → Monitor running processes 




# Task2: Create and Verify Docker Network

---

## Objective

Create a custom Docker network named **mynetwork** and verify its configuration.

---

## Commands

### 1. Create Network

docker network create mynetwork


---

### 2. List Networks

docker network ls


---

### 3. Inspect Network

docker network inspect mynetwork

---

## Summary

- `docker network create` → Creates custom network  
- `docker network ls` → Lists all networks  
- `docker network inspect` → Shows detailed configuration  