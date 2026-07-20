const Note = require("../models/notes_model");

const currentUserId = (req) => req.user.user._id;

//add notes
const addNote = async (req, res, next) => {
  try {
    const { title, content, tags = [] } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ error: true, message: "Title and content are required." });
    }
    if (!Array.isArray(tags)) {
      return res
        .status(400)
        .json({ error: true, message: "Tags must be an array." });
    }

    const note = await Note.create({
      title,
      content,
      tags,
      userId: currentUserId(req),
    });
    return res
      .status(201)
      .json({ error: false, message: "Note added successfully.", note });
  } catch (error) {
    return next(error);
  }
};

//edit notes
const editNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    if (
      [title, content, tags, isPinned].every((value) => value === undefined)
    ) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided." });
    }
    if (tags !== undefined && !Array.isArray(tags)) {
      return res
        .status(400)
        .json({ error: true, message: "Tags must be an array." });
    }
    if (isPinned !== undefined && typeof isPinned !== "boolean") {
      return res
        .status(400)
        .json({ error: true, message: "isPinned must be a boolean." });
    }

    const updates = {};
    for (const [key, value] of Object.entries({
      title,
      content,
      tags,
      isPinned,
    })) {
      if (value !== undefined) updates[key] = value;
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: currentUserId(req) },
      updates,
      { new: true, runValidators: true }
    );
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found." });

    return res.json({
      error: false,
      note,
      message: "Note updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

//get all notes
const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: currentUserId(req) }).sort({
      isPinned: -1,
      createdOn: -1,
    });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

//delete note
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: currentUserId(req),
    });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found." });
    return res.json({ error: false, message: "Note deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

//update pinned note
const updatePinnedNote = async (req, res, next) => {
  try {
    const { isPinned } = req.body;
    if (typeof isPinned !== "boolean") {
      return res
        .status(400)
        .json({ error: true, message: "isPinned must be a boolean." });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: currentUserId(req) },
      { isPinned },
      { new: true }
    );
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found." });
    return res.json({
      error: false,
      note,
      message: "Note pin status updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addNote,
  editNote,
  getAllNotes,
  deleteNote,
  updatePinnedNote,
};
