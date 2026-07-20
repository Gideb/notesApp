const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  // Kept as a string to remain compatible with existing notes in the database.
  userId: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Note", noteSchema);
