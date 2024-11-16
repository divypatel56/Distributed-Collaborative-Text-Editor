// The Document.js defines a schema where:

// _id: A String representing the unique document ID.This ID is typically passed via the URL.
// data: An Object that stores the document's content. Quill.js uses Delta objects to represent 
//       the content, which allows easy manipulation and rendering of text with formatting.

const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    _id: String,
    data: Object,
});

module.exports = mongoose.model("Document", DocumentSchema);
