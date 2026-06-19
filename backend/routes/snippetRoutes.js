const express = require("express");
const Snippet = require("../models/Snippet");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, title, language, visibility, description, tags, code } =
      req.body;

    if (!userId || !title || !language || !description || !code) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const newSnippet = new Snippet({
      userId,
      title,
      language,
      visibility: visibility || "Private",
      description,
      tags: tags || [],
      code,
    });

    await newSnippet.save();

    return res.status(201).json({
      message: "Snippet created successfully",
      snippet: newSnippet,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create snippet",
      error: error.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const snippets = await Snippet.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(snippets);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user snippets",
      error: error.message,
    });
  }
});

router.get("/public/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const snippets = await Snippet.find({
      userId,
      visibility: "Public",
    }).sort({ createdAt: -1 });

    return res.status(200).json(snippets);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch public snippets",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        message: "Snippet not found",
      });
    }

    return res.status(200).json(snippet);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch snippet",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, language, visibility, description, tags, code } = req.body;

    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      {
        title,
        language,
        visibility,
        description,
        tags,
        code,
      },
      { new: true }
    );

    if (!updatedSnippet) {
      return res.status(404).json({
        message: "Snippet not found",
      });
    }

    return res.status(200).json({
      message: "Snippet updated successfully",
      snippet: updatedSnippet,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update snippet",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedSnippet = await Snippet.findByIdAndDelete(req.params.id);

    if (!deletedSnippet) {
      return res.status(404).json({
        message: "Snippet not found",
      });
    }

    return res.status(200).json({
      message: "Snippet deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete snippet",
      error: error.message,
    });
  }
});

module.exports = router;