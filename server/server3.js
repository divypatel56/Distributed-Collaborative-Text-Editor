const mongoose = require("mongoose")
const Document = require("./Document")

// Connect to MongoDB 
mongoose.connect("mongodb://localhost/google-docs-clone");
// Log connection errors
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

//For reddis
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

// Create Redis clients for pub and sub
const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();
//log errors
pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

// Set up Socket.IO server on port 3001 with CORS support
const io = require("socket.io")(3003, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from the client
        methods: ["GET", "POST"], // Allow specific HTTP methods
    },
})

// Default value for new documents
const defaultValue = ""

// Attach Redis adapter after Redis clients are connected
Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
        io.adapter(createAdapter(pubClient, subClient));
        console.log("Redis adapter connected");
    })
    .catch((err) => console.error("Redis connection failed:", err));


// Handle Socket.IO connections
io.on("connection", socket => {
    //console.log("Client connected");

    // Send the server's port to the client
    socket.emit("server-info", { serverPort: 3003 });
    // When a client requests a specific document
    socket.on("get-document", async documentId => {
        // Find or create the requested document in MongoDB
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)  // Join the document-specific room for collaborative updates

        socket.emit("load-document", document.data)   // Send the document data to the client

        // Broadcast changes made by one client to all other clients in the same room
        // socket.on("send-changes", delta => {
        //     socket.broadcast.to(documentId).emit("receive-changes", delta)
        // })

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });


        // Save document updates sent by the client to MongoDB
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })

    })

})
// Helper function to find an existing document or create a new one
async function findOrCreateDocument(id) {
    if (id == null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })

}