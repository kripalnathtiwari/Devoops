# Day 10: Docker Environment Variable Practical 🧪

---

## 1. Objective

- Run a container with environment variables  
- Access container terminal  
- Verify environment variables  
- Understand container lifecycle behavior  

---

## 2. Step-by-Step Execution

### Step 1: Pull Ubuntu Image (if not already present)

```bash
docker pull ubuntu
```

---

### Step 2: Run Container with Environment Variable

```bash
docker run -e COLLEGE=cse --name amish -it ubuntu /bin/bash
```

### Explanation:

- `-e COLLEGE=cse` → sets environment variable  
- `--name amish` → assigns container name  
- `-it` → interactive terminal  
- `/bin/bash` → opens bash shell  

---

### Step 3: Verify Environment Variable Inside Container

```bash
echo $COLLEGE
```

### Output:

```bash
cse
```

✔ Confirms variable is successfully set inside container

---

## 3. Important Observation ⚠️

### Attempted Command Inside Container:

```bash
docker stop
```

### Error:

```bash
bash: docker: command not found
```

---

### Why This Happens?

- Docker CLI is **not available inside container**
- Container is isolated environment
- Docker commands can only be executed on **host system**

👉 Containers ≠ Docker Engine

---

## 4. Correct Way to Stop Container

### Step 1: Exit Container

```bash
exit
```

---

### Step 2: Stop Container from Host

```bash
docker stop amish
```

✔ This is the correct approach

---

## 5. Key Learnings 🧠

- Environment variables are **container-specific**
- They do NOT affect host system
- Docker commands cannot be run inside container
- Always control containers from host system

---

## 6. Concept Summary

| Concept | Explanation |
|--------|------------|
| Environment Variable | Defined using `-e`, exists inside container |
| Container Isolation | Containers do not have Docker CLI |
| Host vs Container | Docker commands run only on host |
| Lifecycle | Start → Run → Exit → Stop |

---

## 7. Final Flow

```bash
docker run → container starts → access bash → check env → exit → docker stop
```

![Day 10 Image](../IMG/Day10.png)

---

## 8. Conclusion

- Successfully created container with environment variable  
- Verified variable inside container  
- Understood limitation of Docker commands inside container  
- Learned correct lifecycle handling  
