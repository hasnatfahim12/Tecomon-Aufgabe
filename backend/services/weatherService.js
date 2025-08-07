const axios = require("axios");
const cache = require("./cacheService");

const WEATHER_API_URL = process.env.WEATHER_API_URL || "https://api.open-meteo.com/v1";

class WeatherService {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        "User-Agent": "WeatherWidget/1.0",
      },
    });
  }

  async getWeatherForLocation(location) {
    const cacheKey = `weather:${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const weatherData = await this.getWeatherData(location);
      const processedData = this.processWeatherData(weatherData, location);
      cache.set(cacheKey, processedData);

      return processedData;
    } catch (error) {
      console.error(`❌ Weather service error for ${location}:`, error.message);
      throw new Error(`Failed to fetch weather data for ${location}`);
    }
  }

  async getWeatherData(location) {
    const response = await this.axiosInstance.get(`${WEATHER_API_URL}/forecast`, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current_weather: true,
        hourly: [
          "temperature_2m",
          "apparent_temperature",
          ,
          "relative_humidity_2m",
          "weathercode",
          "surface_pressure",
          "visibility",
          "uv_index",
          "precipitation",
        ].join(","),
        daily: [
          "weathercode",
          "temperature_2m_max",
          "temperature_2m_min",
          "sunrise",
          "sunset",
          "uv_index_max",
          "precipitation_sum",
        ].join(","),
        timezone: "auto",
        forecast_days: 7,
      },
    });

    return {
      ...response.data,
    };
  }

  processWeatherData(rawData) {
    const current = rawData.current_weather;
    const hourly = rawData.hourly;
    const daily = rawData.daily;
    const currentHour = new Date().getHours();

    return {
      current: {
        temperature: Math.round(current.temperature),
        weatherCode: current.weathercode,
        windSpeed: Math.round(current.windspeed),
        windDirection: current.winddirection,
        isDay: current.is_day === 1,
        time: current.time,
      },
      details: {
        humidity: Math.round(hourly.relative_humidity_2m[currentHour] || 0),
        apparentTemperature: Math.round(hourly.apparent_temperature[currentHour] || 0),
        pressure: Math.round(hourly.surface_pressure[currentHour] || 0),
        visibility: Math.round((hourly.visibility[currentHour] || 0) / 1000),
        uvIndex: Math.round(hourly.uv_index[currentHour] || 0),
        precipitation: Math.round((hourly.precipitation[currentHour] || 0) * 10) / 10,
      },
      daily: {
        sunrise: daily.sunrise[0],
        sunset: daily.sunset[0],
        maxTemp: Math.round(daily.temperature_2m_max[0]),
        minTemp: Math.round(daily.temperature_2m_min[0]),
        uvIndexMax: Math.round(daily.uv_index_max[0] || 0),
        precipitationSum: Math.round((daily.precipitation_sum[0] || 0) * 10) / 10,
      },
      forecast: {
        hourly: this.processHourlyForecast(hourly, currentHour),
        daily: this.processDailyForecast(daily),
      },
      meta: {
        fetchedAt: new Date().toISOString(),
        timezone: rawData.timezone,
      },
    };
  }

  processHourlyForecast(hourly, currentHour) {
    const forecast = [];
    for (let i = 1; i <= 24; i++) {
      const hour = (currentHour + i) % 24;
      const dayOffset = Math.floor((currentHour + i) / 24);
      const index = hour + dayOffset * 24;

      if (index < hourly.temperature_2m.length) {
        forecast.push({
          time: `${hour.toString().padStart(2, "0")}:00`,
          temperature: Math.round(hourly.temperature_2m[index]),
          weatherCode: hourly.weathercode[index],
          precipitation: Math.round((hourly.precipitation[index] || 0) * 10) / 10,
        });
      }
    }
    return forecast;
  }

  processDailyForecast(daily) {
    const forecast = [];
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const date = new Date(daily.time[i]);
      forecast.push({
        date: daily.time[i],
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        weatherCode: daily.weathercode[i],
        precipitationSum: Math.round((daily.precipitation_sum[i] || 0) * 10) / 10,
      });
    }
    return forecast;
  }
}

module.exports = new WeatherService();
