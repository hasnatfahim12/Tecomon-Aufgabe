import { useState, useEffect } from "react";
import { X, MapPin, Clock, Calendar, Star, Expand, Minimize2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import api from "../../utils/api"; // ← Your centralized API utility
import {
  getWeatherIcon,
  getWeatherDescription,
  isItDaytime,
  getCardinalDirection,
  formatTime,
  getDayName,
} from "../../utils/helper"; // ← Your helper utilities

export const WeatherWidget = ({ id, location, isFavorite = false, onDelete, onToggleFavorite, className }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch weather from your backend (which uses cache + Open-Meteo)
        const data = await api.getWeather(id);

        const current = data.current;
        const details = data.details;
        const daily = data.daily;
        const forecast = data.forecast;

        // Determine if it's daytime using sunrise/sunset
        const day = isItDaytime(daily.sunrise, daily.sunset);

        // Format hourly forecast
        const hourlyForecast = forecast.hourly.map(h => ({
          time: h.time,
          temperature: Math.round(h.temperature),
          weatherCode: h.weatherCode,
          precipitation: h.precipitation,
          icon: getWeatherIcon(h.weatherCode, day),
        }));

        // Format daily forecast
        const dailyForecast = forecast.daily.map(d => ({
          date: d.date,
          dayName: getDayName(d.date),
          maxTemp: Math.round(d.maxTemp),
          minTemp: Math.round(d.minTemp),
          weatherCode: d.weatherCode,
          precipitationSum: d.precipitationSum,
          icon: getWeatherIcon(d.weatherCode, true),
          description: getWeatherDescription(d.weatherCode),
        }));

        // Build final weather object
        setWeather({
          location: location.name,
          temperature: Math.round(current.temperature),
          description: getWeatherDescription(current.weatherCode),
          icon: getWeatherIcon(current.weatherCode, day),
          weatherInfo: [
            {
              id: "feels_like",
              label: "Feels like",
              iconName: "thermometer",
              value: `${details.apparentTemperature}°C`,
              color: "red",
              expandView: true,
            },
            {
              id: "humidity",
              label: "Humidity",
              iconName: "droplets",
              value: `${details.humidity}%`,
              color: "blue",
              expandView: false,
            },
            {
              id: "wind",
              label: "Wind",
              iconName: "wind",
              value: `${Math.round(current.windSpeed)} km/h ${getCardinalDirection(current.windDirection)}`,
              color: "green",
              expandView: false,
            },
            {
              id: "visibility",
              label: "Visibility",
              iconName: "eye",
              value: `${details.visibility} km`,
              color: "purple",
              expandView: false,
            },
            {
              id: "pressure",
              label: "Pressure",
              iconName: "gauge",
              value: `${details.pressure} hPa`,
              color: "red",
              expandView: false,
            },
            {
              id: "precipitation",
              label: "Precipitation",
              iconName: "cloud-rain",
              value: `${details.precipitation} mm`,
              color: "white",
              expandView: true,
            },
            {
              id: "sunrise",
              label: "Sunrise",
              iconName: "sun",
              value: formatTime(daily.sunrise, false),
              color: "yellow",
              expandView: true,
            },
            {
              id: "sunset",
              label: "Sunset",
              iconName: "sun",
              value: formatTime(daily.sunset, false),
              color: "yellow",
              expandView: true,
            },
            {
              id: "uv_index",
              label: "UV Index",
              iconName: "sun",
              value: details.uvIndex,
              color: "orange",
              expandView: true,
            },
          ],
          hourlyForecast,
          dailyForecast,
        });
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        setError(err.message || "Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWeather();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-glass backdrop-blur-glass border border-white/20 shadow-glass animate-fade-in ${className}`}
      >
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-12 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-glass backdrop-blur-glass border border-red-200 shadow-glass animate-fade-in ${className}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-destructive">Error</h3>
            <button
              onClick={() => onDelete(id)}
              className="h-6 w-6 hover:bg-destructive/10 opacity-70 hover:opacity-100"
              title="Remove widget"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            <strong>Location:</strong> {location.name}
          </p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      className={`rounded-lg shadow-sm relative overflow-hidden h-fit border border-white/20 shadow-glass hover:shadow-widget transition-all duration-300 animate-fade-in hover:scale-105 my-2 ${
        isExpanded ? "fixed inset-0 z-50 m-4 bg-background" : ""
      }`}
    >
      <div className={`relative ${isExpanded ? "h-full overflow-y-auto" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 bg-[#F3935B]/90 p-6 shadow-sm text-black">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            <h3 className="font-normal text-foreground text-2xl truncate">{location.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 hover:bg-accent/10 opacity-70 hover:opacity-100 hover:cursor-pointer"
              title={isExpanded ? "Collapse view" : "Expand view"}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onToggleFavorite(id)}
              className="h-6 w-6 hover:bg-accent/10 opacity-90 hover:opacity-100 hover:cursor-pointer"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-4 w-4 ${isFavorite ? "fill-current text-accent text-black" : "text-muted-foreground"}`} />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="h-6 w-6 hover:bg-destructive/10 opacity-70 hover:opacity-100 hover:cursor-pointer"
              title="Delete widget"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Weather Info */}
        <div className={isExpanded ? "text-center space-y-6 p-8" : "px-6 py-4"}>
          <div className={`flex items-center ${isExpanded ? "justify-center flex-col" : "justify-between"}`}>
            <div className={`flex items-center gap-3 ${isExpanded && "flex-col"}`}>
              <span className={`text-4xl ${isExpanded && "text-8xl"}`}>{weather.icon}</span>
              <div className={isExpanded ? "text-center" : ""}>
                <div className={`font-black text-foreground ${isExpanded ? "text-7xl mb-2" : "text-4xl"}`}>
                  {weather.temperature}°C
                </div>
                <div className={`text-muted-foreground ${isExpanded ? "text-2xl mb-4" : "text-sm"}`}>{weather.description}</div>

                {/* High/Low in Expanded View */}
                {isExpanded && weather.dailyForecast.length > 0 && (
                  <div className="flex items-center justify-center gap-6 text-lg mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">High:</span>
                      <span className="font-semibold text-red-400">{weather.dailyForecast[0].maxTemp}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Low:</span>
                      <span className="font-semibold text-blue-400">{weather.dailyForecast[0].minTemp}°C</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Extended Details in Expanded View */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {weather.weatherInfo.map(info => (
                <div key={info.id} className="flex flex-col items-start justify-start text-left gap-2 p-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DynamicIcon name={info.iconName} className="h-6 w-6" color={info.color} />
                    <span className="text-foreground font-medium">{info.label}</span>
                  </div>
                  <span className="font-bold text-2xl ml-9">{info.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compact Details (Collapsed View) */}
        {!isExpanded && (
          <div className="grid grid-cols-2 gap-4 text-md p-6">
            {weather.weatherInfo
              .filter(info => !info.expandView)
              .map(info => (
                <div key={info.id} className="flex items-center gap-2">
                  <DynamicIcon name={info.iconName} className="h-5 w-5" color={info.color} />
                  <span className="font-medium">{info.label}</span>
                  <span className="font-semibold ml-auto">{info.value}</span>
                </div>
              ))}
          </div>
        )}

        {/* Forecast Sections */}
        {isExpanded ? (
          <div className="space-y-8 px-8 pb-8">
            {/* Hourly Forecast */}
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                24-Hour Forecast
              </h4>
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-2" style={{ minWidth: "max-content" }}>
                  {weather.hourlyForecast.slice(0, 24).map((hour, index) => (
                    <div key={index} className="flex flex-col items-center text-center bg-gray-950 rounded-lg p-3 min-w-[80px]">
                      <div className="text-sm font-medium text-muted-foreground mb-1">{index === 0 ? "Now" : hour.time}</div>
                      <div className="text-2xl mb-1">{hour.icon}</div>
                      <div className="font-medium">{hour.temperature}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Forecast */}
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                7-Day Forecast
              </h4>
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-2" style={{ minWidth: "max-content" }}>
                  {weather.dailyForecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center text-center bg-gray-950 p-2 rounded-lg min-w-[100px]">
                      <div className="text-sm font-medium mb-2">{day.dayName}</div>
                      <div className="text-3xl mb-2">{day.icon}</div>
                      <div className="text-sm text-muted-foreground mb-2">{day.description}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{day.maxTemp}°</span>
                        <span className="text-muted-foreground text-xs">{day.minTemp}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 px-6 pb-6">
            {/* Quick Hourly Forecast */}
            <div>
              <h4 className="text-base font-medium text-foreground mb-4 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Next 12 hours
              </h4>
              <div className="flex gap-2 overflow-x-auto">
                {weather.hourlyForecast.slice(0, 12).map((hour, index) => (
                  <div key={index} className="flex flex-col items-center text-center min-w-[50px] bg-gray-950 p-2 rounded">
                    <div className="text-xs">{index === 0 ? "Now" : hour.time}</div>
                    <div className="text-lg my-1">{hour.icon}</div>
                    <div className="text-sm font-medium">{hour.temperature}°</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
