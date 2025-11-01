// routes/locationNames.js
const express = require("express");
const router = express.Router();
const LocationName = require("../models/LocationName");

// Get all location names
router.get("/", async (req, res) => {
  try {
    const locationNames = await LocationName.find().sort({ createdAt: -1 });
    res.json(locationNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get location name by ID
router.get("/:id", async (req, res) => {
  try {
    const locationName = await LocationName.findById(req.params.id);
    if (!locationName) {
      return res.status(404).json({ message: "Location name not found" });
    }
    res.json(locationName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new location name
router.post("/", async (req, res) => {
  try {
    const { name, coordinates } = req.body;

    if (
      !name ||
      !coordinates ||
      !coordinates.latitude ||
      !coordinates.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Name and coordinates are required" });
    }

    const locationName = new LocationName({
      name,
      coordinates,
    });

    const savedLocationName = await locationName.save();
    res.status(201).json(savedLocationName);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update location name
router.put("/:id", async (req, res) => {
  try {
    const { name, coordinates } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (coordinates) updateData.coordinates = coordinates;

    const locationName = await LocationName.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!locationName) {
      return res.status(404).json({ message: "Location name not found" });
    }
    res.json(locationName);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete location name
router.delete("/:id", async (req, res) => {
  try {
    const locationName = await LocationName.findByIdAndDelete(req.params.id);
    if (!locationName) {
      return res.status(404).json({ message: "Location name not found" });
    }
    res.json({ message: "Location name deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
