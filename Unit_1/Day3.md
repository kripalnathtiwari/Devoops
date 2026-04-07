# Day 3: Container Runtime & Process Isolation

---

## 1. Container Runtime

### Definition
A **container runtime** is the software responsible for **running and managing containers** on a host system.

It handles:
- Starting and stopping containers
- Managing container lifecycle
- Interacting with OS kernel features (namespaces, cgroups)

---

### Types of Container Runtime

Container runtimes are broadly classified into two types:

#### 1. High-Level Runtimes

- User-facing tools
- Manage full container lifecycle
- Provide CLI and APIs

#### These handle:
- Image pulling  
- Networking  
- Storage  
- Container lifecycle  

**Examples:**
- Docker Engine
- containerd
- CRI-O

---

#### 2. Low-Level Runtimes

- Responsible for actually running containers
- Directly interact with OS kernel
- Execute container processes

#### These directly interact with:
- Linux kernel  
- Namespaces  
- cgroups  

**Examples:**
- runc (most commonly used)
- runv
- kata-runtime (lightweight VM-based runtime)

---

### Key Responsibilities

- Pull container images
- Create container environment
- Apply namespaces and cgroups
- Execute container processes

---

## 2. Process Isolation

### Definition
Process isolation ensures that **processes inside a container are isolated from processes in other containers and the host system**.

---

### How It Works

- Achieved using **Namespaces**
- Each container has:
  - Its own process tree (PID namespace)
  - Cannot see processes of other containers

---

### Example

- A process inside container sees itself as:
PID = 1

- But on host system, it may have a different PID

---

### Benefits

- Security between containers
- Prevents interference
- Independent execution environments

---

## 3. Namespaces

### Definition
Namespaces are a feature of the Linux kernel that provide **isolation** for containers.  
They ensure that each container has its **own separate view of system resources**.

---

### Types of Namespaces

| Namespace Type | Description |
|---------------|------------|
| PID Namespace | Isolates process IDs. Each container has its own process tree. |
| Network Namespace | Provides separate network interfaces, IP addresses, ports, and routing tables. |
| Mount Namespace | Isolates filesystem mount points. Each container has its own file system view. |
| IPC Namespace | Isolates inter-process communication mechanisms like message queues and shared memory. |
| UTS Namespace(Unix Timesharing System) | Allows containers to have their own hostname and domain name. |
| User Namespace | Maps user and group IDs, allowing containers to run as root internally but not on host. |

---

### 🔹 Network Namespace (Detailed Example)

Containers can run applications on the **same port without conflict** because each container has its own isolated network stack.

#### Example:

Multiple Nginx containers all listen on port 80 internally:

- Container 1: 172.17.0.2:80 → Nginx  
- Container 2: 172.17.0.3:80 → Nginx  
- Container 3: 172.17.0.4:80 → Nginx  

👉 Each container has a unique IP, so no conflict occurs.

---

### 🔹 Mount Namespace

- Each container has its own filesystem view  
- File changes inside container do NOT affect host  

---

### 🔹 UTS(Unix Timesharing System) Namespace

- Allows each container to have its own hostname  

---

### 🔹 User Namespace (Advanced)

- Maps container users to non-root users on host  
- Improves security  

---

### Key Points

- Provides **isolation between containers**
- Ensures **security and independence**
- Makes containers behave like **separate machines**
- Lightweight compared to virtual machines

---

## 4. cgroups (Control Groups)

### Definition
cgroups (control groups) are a Linux kernel feature used to **limit, control, and monitor resource usage** of processes or containers.

---

### Purpose of cgroups

- Limit resource usage
- Monitor resource consumption
- Ensure fair distribution of system resources
- Prevent one container from affecting others

---

### Types of Resources Controlled by cgroups

| Resource | Description |
|----------|------------|
| CPU | Limits CPU usage and scheduling priority |
| Memory | Restricts RAM usage and prevents memory overflow |
| Disk I/O | Controls read/write speed of storage devices |
| Network Bandwidth | Limits network usage of containers |
| Processes (PIDs) | Restricts number of processes a container can create |

---

### Key Features

- Resource limiting (e.g., CPU %, memory limit)
- Resource accounting (monitor usage)
- Resource isolation
- Process grouping

---

## 5. Difference Between Namespaces and cgroups

| Feature | Namespaces | cgroups |
|--------|-----------|---------|
| Purpose | Isolation | Resource Management |
| Focus | Visibility of resources | Usage of resources |
| Example | Separate PID, network | Limit CPU, memory |
| Role | Makes containers independent | Prevents resource overuse |

---

## 6. Summary

- **Container Runtime → Runs and manages containers**
- **Process Isolation → Separates processes between containers**
- **Namespaces → Isolation (what a container can see)**
- **cgroups → Resource control (how much a container can use)**

Together, they form the **core foundation of containerization** in Linux.