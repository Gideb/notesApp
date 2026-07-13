require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

const userModel = require("./models/user_model");
const Note = require("./models/notes_model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authentication } = require("./utils/utils");
const user_model = require("./models/user_model");

const PORT = process.env.PORT || 8000;

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
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting to reconnect...");
});

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

//create accounut
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required!" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required!" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required!" });
  }

  const isUser = await userModel.findOne({ email });

  if (isUser) {
    return res.json({ error: true, message: "User already exists!" });
  }

  const newUser = new userModel({
    fullName,
    email,
    password,
  });

  await newUser.save();

  const accessToken = jwt.sign(
    { user: newUser },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1hr",
    }
  );
  return res.json({
    error: false,
    user: newUser,
    accessToken,
    message: "Registration Successful",
  });
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({ error: true, message: "Email is required!" });
  }

  if (!password) {
    res.status(400).json({ error: true, message: "Password is required!" });
  }

  const userInfo = await userModel.findOne({ email });

  if (!userInfo) {
    res.status(400).json({ error: true, message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }
});

//add notes
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required!" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required!" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();

    return res
      .status(400)
      .json({ error: false, message: "Note added successfully", note });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//edit notes
app.put("/edit-notes/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note editted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.findOne({ userId: user._id }).sort({
      isPinned: -1,
    });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
