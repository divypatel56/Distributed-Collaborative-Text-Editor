# Project_COSC4437
 Shared Collaborative TextEditor App

To Run 
Clone the repo Project_COSC4437.
You need to install Node js. Go to Google and install node js. 
After installing the node run npm -v in PowerShell or cmd to verify that the node was installed successfully.  
Install MongoDB in your system. 
Go to the  server folder, Open Terminal, and run npm install. 
Go to the Client folder, open the terminal, and run npm Install.

Current Functionality. 
Users can create new documents with unique document IDs. 
Multiple users can work on the same document and make concurrent changes with real-time updates. 
Auto-saving document data in every 2 m/s.
Conflict-free editing. 

Things to implement:
Our current System is centralized. To make it a Distributed system 
1. Introduce Load Balancer
Use a load balancer to distribute client requests across multiple servers.
A load balancer ensures:
Even distribution of client connections.
Redundancy: If one server goes down, others can handle the load.
Example tools: NGINX, HAProxy, or AWS Elastic Load Balancer (ELB).

2. Synchronize Servers
Since multiple servers will handle requests for the same documents, ensure all servers stay in sync.
Use a shared database (MongoDB in your case) or a cache system (e.g., Redis) to store the latest document state and updates.

3. Socket.IO with Multiple Servers
Socket.IO can be scaled using Redis as a message broker. Redis Pub/Sub allows different servers to communicate real-time updates to each other.
Redis ensures changes made by a client connected to one server are broadcast to clients connected to other servers.

4. Scale MongoDB
Use a distributed setup for MongoDB with replica sets or sharded clusters to ensure high availability and scalability.



