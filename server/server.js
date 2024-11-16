const mongoose = require("mongoose")
const Document = require("./Document")


// Connect to MongoDB 
mongoose.connect("mongodb://localhost/google-docs-clone");

// Log connection errors
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});
// Default value for new documents
const defaultValue = ""

// Set up Socket.IO server on port 3001 with CORS support
const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from the client
        methods: ["GET", "POST"], // Allow specific HTTP methods
    },
})

// Handle Socket.IO connections
io.on("connection", socket => {
    // When a client requests a specific document
    socket.on("get-document", async documentId => {
        // Find or create the requested document in MongoDB
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)  // Join the document-specific room for collaborative updates

        socket.emit("load-document", document.data)   // Send the document data to the client

        // Broadcast changes made by one client to all other clients in the same room
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

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