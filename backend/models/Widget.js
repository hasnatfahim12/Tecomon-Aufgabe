const mongoose = require("mongoose");

const widgetSchema = new mongoose.Schema(
  {
    location: {
      type: Object,
      required: [true, "Location is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
widgetSchema.index({ location: 1 });
widgetSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Widget", widgetSchema);
