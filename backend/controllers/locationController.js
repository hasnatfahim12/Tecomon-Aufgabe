const axios = require("axios");

exports.getLocationSuggestions = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Location name is required" });
  }

  try {
    const response = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
      params: {
        name,
        count: 5,
        language: "en",
        format: "json",
      },
    });

    const results = response.data.results || [];

    // Map to clean format
    const locations = results.map(loc => ({
      id: loc.id,
      name: loc.name,
      country: loc.country,
      latitude: loc.latitude,
      longitude: loc.longitude,
      admin1: loc.admin1 || "",
    }));

    res.json(locations);
  } catch (err) {
    console.error("Geocoding error:", err.message);
    res.status(500).json({ error: "Failed to fetch location suggestions" });
  }
};
