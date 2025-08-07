const API_BASE = "http://localhost:5000";

const api = {
  // Get all active widgets
  async getWidgets() {
    const res = await fetch(`${API_BASE}/api/widgets`);
    if (!res.ok) throw new Error("Failed to fetch widgets");
    const data = await res.json();
    return data.data; // returns array of widgets
  },

  // Create a new widget
  async createWidget(location) {
    const res = await fetch(`${API_BASE}/api/widgets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create widget");
    }
    const data = await res.json();
    return data.data; // new widget
  },

  // Delete a widget by ID
  async deleteWidget(id) {
    const res = await fetch(`${API_BASE}/api/widgets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete widget");
    const data = await res.json();
    return data;
  },

  // Get weather for a widget
  async getWeather(id) {
    const res = await fetch(`${API_BASE}/api/widgets/${id}/weather`);
    if (!res.ok) throw new Error("Failed to fetch weather");
    const data = await res.json();
    return data.data.weather;
  },

  // Get location suggestions
  async getLocationSuggestions(query) {
    const res = await fetch(`${API_BASE}/api/widgets/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: query }),
    });
    if (!res.ok) throw new Error("Failed to fetch location suggestions");
    return await res.json();
  },
};

export default api;
