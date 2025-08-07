import { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import LocationExistsPopup from "@/components/LocationExistsPopup";

export const AddWidgetForm = ({ onAddWidget, widgets }) => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupLocation, setPopupLocation] = useState("");

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const popularCities = ["Berlin", "Hamburg", "Paris", "London", "New York", "Tokyo", "Sydney", "Toronto", "Amsterdam", "Rome"];

  // Fetch city suggestions from backend (which uses Open-Meteo)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      if (selectedSuggestion) return; // already picked

      try {
        const data = await api.getLocationSuggestions(location.split(",")[0].trim());

        setSuggestions(data);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [location, selectedSuggestion]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedSuggestion) return;

    // Check if widget for this location already exists
    const exists = widgets.some(
      widget =>
        widget.location.latitude === selectedSuggestion.latitude && widget.location.longitude === selectedSuggestion.longitude
    );

    if (exists) {
      setPopupLocation(selectedSuggestion.name);
      setShowPopup(true);
      return;
    }

    await onAddWidget(selectedSuggestion);
    setLocation("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestion(null);
  };
  const handleSuggestionClick = suggestion => {
    const locationName = suggestion.admin1
      ? `${suggestion.name}, ${suggestion.admin1}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setLocation(locationName);
    setSelectedSuggestion(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = e => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const handleInputChange = e => {
    const value = e.target.value;

    setLocation(value);
    if (selectedSuggestion) setSelectedSuggestion(null);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePopularCityClick = city => {
    setLocation(city);
    setSelectedSuggestion(null);
  };

  return (
    <>
      <div className="w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a city..."
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="flex justify-start items-start px-4 pb-12 w-full text-2xl text-primary bg-[#E8E1D6] outline-none mb-4 rounded h-32"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md shadow-lg z-70 max-h-60 overflow-y-auto bg-[#E8E1D6]"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.latitude}-${suggestion.longitude}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-4 py-3 hover:cursor-pointer hover:bg-black/20 transition-colors border-b border-black last:border-b-0 ${
                      selectedIndex === index ? "bg-accent/20" : ""
                    }`}
                  >
                    <div className="font-medium text-foreground">{suggestion.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {suggestion.admin1 && `${suggestion.admin1}, `} {suggestion.country}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="absolute hover:cursor-pointer bottom-2 right-2 disabled:bg-secondary/40 text-black px-4 py-2 rounded bg-secondary hover:scale-105 transition duration-200"
              disabled={!selectedSuggestion}
            >
              Check weather
            </button>
          </div>
        </form>
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {popularCities.map(city => (
              <button
                key={city}
                onClick={() => handlePopularCityClick(city)}
                className="border border-[#f2c9b3] px-4 py-1 rounded cursor-pointer text-white hover:bg-white hover:text-black transition-all duration-200"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
      {showPopup && <LocationExistsPopup locationName={popupLocation} onClose={() => setShowPopup(false)} />}
    </>
  );
};
