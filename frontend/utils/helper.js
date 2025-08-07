// utils/helper.js

/**
 * Weather condition codes from Open-Meteo API
 * https://open-meteo.com/en/docs/weather-api
 */
const WEATHER_CODES = {
  0: { description: "Clear sky", icon: { day: "☀️", night: "🌙" } },
  1: { description: "Mainly clear", icon: { day: "🌤️", night: "🌙" } },
  2: { description: "Partly cloudy", icon: { day: "⛅", night: "☁️" } },
  3: { description: "Overcast", icon: { day: "☁️", night: "☁️" } },
  45: { description: "Fog", icon: { day: "🌫️", night: "🌫️" } },
  48: { description: "Depositing rime fog", icon: { day: "🌫️", night: "🌫️" } },
  51: { description: "Light drizzle", icon: { day: "🌦️", night: "🌧️" } },
  53: { description: "Moderate drizzle", icon: { day: "🌦️", night: "🌧️" } },
  55: { description: "Dense drizzle", icon: { day: "🌧️", night: "🌧️" } },
  61: { description: "Slight rain", icon: { day: "🌧️", night: "🌧️" } },
  63: { description: "Moderate rain", icon: { day: "🌧️", night: "🌧️" } },
  65: { description: "Heavy rain", icon: { day: "🌧️", night: "🌧️" } },
  71: { description: "Slight snow", icon: { day: "🌨️", night: "🌨️" } },
  73: { description: "Moderate snow", icon: { day: "🌨️", night: "🌨️" } },
  75: { description: "Heavy snow", icon: { day: "🌨️", night: "🌨️" } },
  95: { description: "Thunderstorm", icon: { day: "⛈️", night: "⛈️" } },
  96: { description: "Thunderstorm with hail", icon: { day: "⛈️", night: "⛈️" } },
  99: { description: "Heavy thunderstorm", icon: { day: "⛈️", night: "⛈️" } },
};

/**
 * Get the appropriate weather emoji icon based on code and time of day
 * @param {number} code - Open-Meteo weather code
 * @param {boolean} isDay - Whether it's daytime
 * @returns {string} Emoji icon
 */
export const getWeatherIcon = (code, isDay = true) => {
  const weather = WEATHER_CODES[code];
  if (!weather) return isDay ? "🌤️" : "☁️"; // fallback
  return weather.icon[isDay ? "day" : "night"];
};

/**
 * Get the human-readable weather description
 * @param {number} code - Open-Meteo weather code
 * @returns {string} Description of weather condition
 */
export const getWeatherDescription = code => {
  const weather = WEATHER_CODES[code];
  return weather ? weather.description : "Unknown";
};

/**
 * Determine if it's daytime based on sunrise/sunset times
 * @param {string} sunrise - ISO time string (e.g., "2023-10-05T06:30")
 * @param {string} sunset - ISO time string
 * @returns {boolean}
 */
export const isItDaytime = (sunrise, sunset) => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const sunriseTime = new Date(`${today}T${sunrise.split("T")[1]}`).getTime();
  const sunsetTime = new Date(`${today}T${sunset.split("T")[1]}`).getTime();

  return now.getTime() >= sunriseTime && now.getTime() <= sunsetTime;
};

/**
 * Format temperature with unit
 * @param {number} temp
 * @param {string} unit - 'C' or 'F'
 * @returns {string}
 */
export const formatTemperature = (temp, unit = "C") => {
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Convert wind direction in degrees to cardinal direction
 * @param {number} degrees
 * @returns {string}
 */
export const getCardinalDirection = degrees => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8] || "N";
};

/**
 * Format time to HH:MM (12h or 24h)
 * @param {string} isoTime - e.g., "2023-10-05T07:45"
 * @param {boolean} use12Hour - whether to use 12-hour format
 * @returns {string}
 */
export const formatTime = (isoTime, use12Hour = true) => {
  const date = new Date(isoTime);
  if (use12Hour) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Get day name from date string
 * @param {string} isoDate - e.g., "2023-10-05"
 * @returns {string}
 */
export const getDayName = isoDate => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};
