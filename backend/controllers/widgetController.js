const Widget = require("../models/Widget");
const weatherService = require("../services/weatherService");

// @desc    Get all widgets
// @route   GET /api/widgets
// @access  Public
const getAllWidgets = async (req, res) => {
  try {
    const widgets = await Widget.find({ isActive: true }).sort({ createdAt: -1 }).select("-__v");

    res.json({
      success: true,
      count: widgets.length,
      data: widgets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create new widget
// @route   POST /api/widgets
// @access  Public
const createWidget = async (req, res) => {
  try {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const location = req.body;

    // Check if widget with same location already exists
    const existingWidget = await Widget.findOne({
      location: location,
      isActive: true,
    });

    if (existingWidget) {
      return res.status(409).json({
        success: false,
        message: "Widget for this location already exists",
      });
    }

    const widget = await Widget.create({
      location: location,
    });

    res.status(201).json({
      success: true,
      message: "Widget created successfully",
      data: widget,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete widget
// @route   DELETE /api/widgets/:id
// @access  Public
const deleteWidget = async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id);

    if (!widget || !widget.isActive) {
      return res.status(404).json({
        success: false,
        message: "Widget not found",
      });
    }

    // Soft delete - mark as inactive instead of removing
    widget.isActive = false;
    await widget.save();

    res.json({
      success: true,
      message: "Widget deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Widget not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get weather data for widget
// @route   GET /api/widgets/:id/weather
// @access  Public
const getWeatherData = async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id);

    if (!widget || !widget.isActive) {
      return res.status(404).json({
        success: false,
        message: "Widget not found",
      });
    }

    const weatherData = await weatherService.getWeatherForLocation(widget.location);

    // Update widget's lastUpdated timestamp
    widget.lastUpdated = new Date();
    await widget.save();

    res.json({
      success: true,
      data: {
        widget: {
          id: widget._id,
          location: widget.location,
        },
        weather: weatherData,
      },
    });
  } catch (error) {
    console.error("Weather data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
      error: error.message,
    });
  }
};

module.exports = {
  getAllWidgets,
  createWidget,
  deleteWidget,
  getWeatherData,
};
