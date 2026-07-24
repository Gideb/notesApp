require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { signUp, login, getUser } = require("./controllers/authController");
const {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  updatePinnedNote,
} = require("./controllers/notesController");
const { authenticateToken } = require("./utils/utils");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://gideb-notebook.vercel.app"],
    credentials: true,
  })
);

app.get("/", (req, res) => res.json({ data: "hello" }));
app.post("/api/signup", signUp);
app.post("/api/login", login);
app.get("/api/get-user", authenticateToken, getUser);
app.post("/api/add-note", authenticateToken, addNote);
app.put("/api/edit-notes/:noteId", authenticateToken, editNote);
app.get("/api/get-all-notes", authenticateToken, getAllNotes);
app.delete("/api/delete-note/:noteId", authenticateToken, deleteNote);
app.put("/api/update-pinned-note/:noteId", authenticateToken, updatePinnedNote);

app.use((error, req, res, next) => {
  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ error: true, message: "Invalid resource ID." });
  }
  console.error(error);
  return res
    .status(500)
    .json({ error: true, message: "Internal server error." });
});

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI is not set. Continuing without database connection."
    );
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

mongoose.connection.on("error", (error) =>
  console.error("MongoDB connection error:", error.message)
);
connectToDatabase();

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
