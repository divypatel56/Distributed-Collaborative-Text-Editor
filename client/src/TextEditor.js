import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from "react-router-dom"


const SAVE_INTERVAL_MS = 2000; // Interval for saving documents (2 seconds)

// Quill toolbar configuration
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

export default function TextEditor() {
    const { id: documentId } = useParams() // Get the document ID from the URL
    const [socket, setSocket] = useState(); // State to store the socket connection
    const [quill, setQuill] = useState();  // State to store the Quill editor instance


    // Establish the Socket.IO connection
    useEffect(() => {
        //const s = io("http://localhost:3001/") // Connect to the server
        //const serverUrl = Math.random() > 0.5 ? "http://localhost:3001" : "http://localhost:3002";
        const serverUrl = [
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3003"
        ][Math.floor(Math.random() * 3)];
        const s = io(serverUrl);
        setSocket(s) // Save the socket connection in state
        // Cleanup: Disconnect the socket on component unmount
        return () => {
            s.disconnect()
        }
    }, [])

    //To display server info
    useEffect(() => {
        if (socket == null) return;

        // Listen for server info
        socket.on("server-info", ({ serverPort }) => {
            console.log(`Connected to server on port: ${serverPort}`);
            alert(`Connected to server on port: ${serverPort}`); // Optional
        });

        return () => {
            socket.off("server-info");
        };
    }, [socket]);


    // Load the document when the editor is ready
    useEffect(() => {
        if (socket == null || quill == null) return
        // Once the document is loaded, populate the editor and enable it
        socket.once("load-document", document => {
            quill.setContents(document) // Set the content in the editor
            quill.enable() // Enable the editor for editing
        })


        // Request the document data from the server
        socket.emit("get-document", documentId)

    }, [socket, quill, documentId])

    //Save the document at regular intervals
    useEffect(() => {
        if (socket == null || quill == null) return
        // Emit the save-document event every SAVE_INTERVAL_MS milliseconds
        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents())
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval) // Cleanup: Clear the interval on component unmount
        }

    }, [socket, quill])

    // Handle changes made by the user in the editor
    useEffect(() => {
        if (socket == null || quill == null) return

        // Send changes to the server when the user edits the document
        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return  // Ignore changes not made by the user
            socket.emit("send-changes", delta) // Emit the changes to the server
        }
        quill.on('text-change', handler) // Listen for text-change events
        return () => {
            quill.off("text-change", handler) // Cleanup: Remove the listener on unmount
        }
    }, [socket, quill])


    // Receive and apply changes from other clients
    useEffect(() => {
        if (socket == null || quill == null) return

        // Update the editor content with changes received from other clients
        const handler = delta => {
            quill.updateContents(delta)
        }
        socket.on("receive-changes", handler) // Listen for receive-changes events

        return () => {
            socket.off("receive-changes", handler) // Cleanup: Remove the listener on unmount
        }
    }, [socket, quill])

    // Initialize the Quill editor
    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return; // Exit if the wrapper is not available
        wrapperRef.innerHTML = " "
        const editor = document.createElement("div") // Create a div for the editor
        wrapper.append(editor)
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } })
        q.disable();  // Disable the editor initially (until the document is loaded)
        q.setText("Loading....")
        setQuill(q);

    }, [])
    return (
        <div className="container" ref={wrapperRef}>

        </div>
    )
}
