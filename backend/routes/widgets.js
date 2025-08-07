const express = require("express");
const router = express.Router();
const { getAllWidgets, createWidget, deleteWidget, getWeatherData } = require("../controllers/widgetController");
const locationController = require("../controllers/locationController");

// GET /api/widgets - Get all widgets
router.get("/", getAllWidgets);

// POST /api/widgets - Create new widget
router.post("/", createWidget);

// DELETE /api/widgets/:id - Delete widget
router.delete("/:id", deleteWidget);

// GET /api/widgets/:id/weather - Get weather data for specific widget
router.get("/:id/weather", getWeatherData);

router.post("/locations", locationController.getLocationSuggestions);

module.exports = router;
