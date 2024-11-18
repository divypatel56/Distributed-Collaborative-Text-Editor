# Project_COSC4437
 Shared Collaborative TextEditor App

To Run 
Clone the repo Project_COSC4437.
 1. You need to install Node js. Go to Google and install node js. 
 2. After installing the node run npm -v in PowerShell or cmd to verify that the node was installed successfully.  
 3. Install MongoDB in your system. 
 4. Go to the  server folder, Open Terminal, and run npm install. 
 5. Go to the Client folder, open the terminal, and run npm Install.

Current Functionality. 
- Users can create new documents with unique document IDs. 
- Multiple users can work on the same document and make concurrent changes with real-time updates. 
- Auto-saving document data in every 2 m/s.
- Every document has a separate room for example user opens 2 different documents, and updates one of them then the other document won't be modified.
- Conflict-free editing. 

Things to implement:
Our current System is centralized. To make it a Distributed system 
 1. Introduce Load Balancer
 Use a load balancer to distribute client requests across multiple servers.
 A load balancer ensures:
 Even distribution of client connections.
 Redundancy: If one server goes down, others can handle the load.
 Use an algorithm like round robin or Least connection to work as a load balancer.
 Else we will try to add free open-source load balancer like NGINX, HAProxy, or AWS Elastic Load Balancer (ELB).


 2. Scale MongoDB
 Use a distributed setup for MongoDB with replica sets or sharded clusters to ensure high availability and scalability.
 Currently, we have one server, but We will add at least 2 servers in our project. One server will act as a primary server(master) that handles all the write operations,  
 while the secondary server (slave server) replicates the data for the read operation. 
 


