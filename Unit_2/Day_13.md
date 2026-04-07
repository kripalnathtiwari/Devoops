# Day 13: Container File Operations & Host Interaction

---

## 1. Problem Statement

Inside the same running container, you are required to:

- Create a new directory `/project`  
- Inside `/project`, create a file `report.txt`  
- Add content to the file  
- Verify the file content  
- Copy the file from container to host (desktop)  
- Create another file `notes.txt`  
- Append text to it  
- Verify both files exist  

---

## 2. Step-by-Step Commands

### Step 1: Access Running Container

docker exec -it <container_id> /bin/bash


---

### Step 2: Create Directory

mkdir /project


---

### Step 3: Create report.txt with Content

echo "This is our container interaction with our host machine" > /project/report.txt


---

### Step 4: Verify File Content

cat /project/report.txt


---

### Step 5: Exit Container

exit


---

### Step 6: Copy File from Container to Host (Desktop)


docker cp <container_id>:/project/report.txt C:/Users/YourUsername/Desktop/


✔ Copies file from container to host machine

---

### Step 7: Re-enter Container

docker exec -it <container_id> /bin/bash


---

### Step 8: Create notes.txt

touch /project/notes.txt


---

### Step 9: Append Text to notes.txt

echo "Additional notes for container practice" >> /project/notes.txt


---

### Step 10: Verify Both Files Exist

ls /project


---

### Step 11: Verify Content (Optional)

cat /project/notes.txt


---

## 3. Expected Output


report.txt notes.txt


---


![Day 10 Image](../IMG/Day13.png)

---

## 4. Key Learnings 🧠

- File creation inside container  
- Directory management  
- Copying files between container and host  
- Difference between `>` (overwrite) and `>>` (append)  
- Container-host interaction  

---

## 5. Flow Summary


exec → mkdir → create file → verify → copy → create another file → append → verify


---

## 6. Conclusion

- Successfully performed file operations inside container  
- Verified content and file existence  
- Learned how to transfer files between container and host  