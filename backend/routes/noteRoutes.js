const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, title, category, visibility, tags, content } = req.body;

    if (!userId || !title || !category || !content) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const newNote = new Note({
      userId,
      title,
      category,
      visibility: visibility || "Private",
      tags: tags || [],
      content,
    });

    await newNote.save();

    return res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user notes",
      error: error.message,
    });
  }
});

router.get("/public/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({
      userId,
      visibility: "Public",
    }).sort({ createdAt: -1 });

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch public notes",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch note",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, category, visibility, tags, content } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        visibility,
        tags,
        content,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update note",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete note",
      error: error.message,
    });
  }
});

module.exports = router;