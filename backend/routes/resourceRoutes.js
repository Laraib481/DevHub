const express = require("express");
const Resource = require("../models/Resource");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, title, category, visibility, link, tags, description } =
      req.body;

    if (!userId || !title || !category || !link || !description) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const newResource = new Resource({
      userId,
      title,
      category,
      visibility: visibility || "Private",
      link,
      tags: tags || [],
      description,
    });

    await newResource.save();

    return res.status(201).json({
      message: "Resource created successfully",
      resource: newResource,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create resource",
      error: error.message,
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const resources = await Resource.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user resources",
      error: error.message,
    });
  }
});

router.get("/public/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const resources = await Resource.find({
      userId,
      visibility: "Public",
    }).sort({ createdAt: -1 });

    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch public resources",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    return res.status(200).json(resource);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch resource",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, category, visibility, link, tags, description } = req.body;

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        visibility,
        link,
        tags,
        description,
      },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      message: "Resource updated successfully",
      resource: updatedResource,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update resource",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);

    if (!deletedResource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete resource",
      error: error.message,
    });
  }
});

module.exports = router;