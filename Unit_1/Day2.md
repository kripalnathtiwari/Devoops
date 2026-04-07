# Day 2: What is Virtual Machine

A Virtual Machine (VM) is a software-based computer that runs on top of physical hardware using a hypervisor.

Each VM contains:
- A full operating system
- Virtual hardware
- Applications
- Libraries and dependencies

 It is like a real physical pc.


----------------------------------------------------------------


## HyperVisor

The Hypervisor is software that creates and manages VMs.
Example: 
+ VMware
+ VirtualBox
+ Hyper-V
+ KVM

| Advantages of Virtual Machines | Disadvantages of Virtual Machines |
|--------------------------------|-----------------------------------|
| Strong Isolation: Each VM is completely isolated from others. | Heavy Resource Usage: Each VM requires a full OS. |
| Run Multiple OSs: You can run Windows, Linux and macOS on the same physical machine. | Slow Startup: Booting a VM takes minutes. |
| Security: If one VM crashes, others remain unaffected. | Large Storage Requirement: VM images can be several GB. |




----------------------------------------------------------------



# Containers

A container is a lightweight virtualization technology that packages  an application along with its dependencies so it can run consistently across environments.

Containers share the host Operating System kernel instead of running seperate OS instances.



Each container contains:
Application + Dependencies


## Example

Suppose we deploy a web application.

Instead of creating full VMs:

* Container 1 → Web server

* Container 2 → Database

* Container 3 → API service

All share the same OS kernel.


----------------------------------------------------------------

| Advantages of Containers | Disadvantages of Containers |
|--------------------------|-----------------------------|
| Lightweight: Containers do not require a full OS. | Weaker Isolation: Containers share the OS kernel. |
| Fast Startup: Containers start in seconds. | OS Dependency: Containers must use the host OS kernel type. |
| Efficient Resource Usage: More containers can run on the same machine. | Example: Linux containers require a Linux kernel. |
| Portability: Containers run the same on developer laptop, testing environment, and production servers. |  |

----------------------------------------------------------------


# Virtual Machine v/s  Container


| Feature | Virtual Machine | Container |
|--------|----------------|-----------|
| OS | Each VM has its own OS | Share host OS |
| Size | Large (GBs) | Small (MBs) |
| Boot Time | Minutes | Seconds |
| Resource Usage | High | Low |
| Isolation | Strong | Moderate |
| Performance | Slower | Faster |
| Example Tools | VMware, VirtualBox | Docker, Kubernetes |

----------------------------------------------------------------

# Real world Example

Suppose a company deploys a Netflix-like streaming service.

Without containers:

- Each service runs on separate virtual machines

- Infrastructure becomes heavy

With containers:

- Video service container

- Recommendation engine container

- User authentication container

- These containers can scale independently.



----------------------------------------------------------------  

# ROLE in DevOps 

Containers are central to modern DevOps pipelines.

FLOW

Developer → Git → CI/CD Pipeline → Docker Container → Kubernetes Deployment → Cloud

Containers allow:

* continuous integration

* continuous deployment

* scalable microservices


----------------------------------------------------------------


Popular Container platforms:
* Docker
* Podman
* containerd
