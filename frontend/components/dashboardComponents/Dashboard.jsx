import React, { useState, useEffect } from "react";
import { AddWidgetForm } from "./AddWidgetForm";
import { WeatherWidget } from "./WeatherWidget";
import api from "../../utils/api";

const FAVORITES_KEY = "weatherAppFavorites";

const Dashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    setFavorites(new Set(saved));
  }, []);

  // Load widgets from backend
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const data = await api.getWidgets();
        setWidgets(data);
      } catch (error) {
        console.error("Failed to load widgets:", error);
        alert("Could not load widgets. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    loadWidgets();
  }, []);

  // Save favorites to localStorage

  const addWidget = newWidget => {
    setWidgets(prev => [...prev, newWidget]);
  };

  const deleteWidget = async id => {
    try {
      await api.deleteWidget(id);
      setWidgets(prev => prev.filter(w => w._id !== id));
      setFavorites(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      alert("Failed to delete widget");
    }
  };

  const toggleFavorite = id => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading your weather widgets...</div>;
  }

  const favoriteWidgets = widgets.filter(w => favorites.has(w._id));
  const regularWidgets = widgets.filter(w => !favorites.has(w._id)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-12">
      <div className="flex flex-col">
        <span className="font-Satoshi font-light text-7xl text-secondary">Weather Dashboard</span>
        <span className="font-satoshi font-normal text-lg mt-4 text-secondary">
          Find real-time weather data for any location worldwide.
        </span>
      </div>
      <AddWidgetForm onAddWidget={addWidget} widgets={widgets} />
      <div className="flex flex-wrap gap-y-6 gap-x-6 text-white">
        {favoriteWidgets.length > 0 && (
          <div className="space-y-6 w-full">
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Favourites</h2>
              <p className="text-sm text-muted-foreground">Your favourite weather locations</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {favoriteWidgets.map(widget => (
                <WeatherWidget
                  key={widget._id}
                  id={widget._id}
                  location={widget.location}
                  isFavorite={favorites.has(widget._id)}
                  onDelete={deleteWidget}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
        {regularWidgets.length > 0 && (
          <div className="space-y-6 w-full">
            {favoriteWidgets.length > 0 && (
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-foreground mb-2">All locations</h2>
                <p className="text-sm text-muted-foreground">Your weather widgets</p>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {regularWidgets.map(widget => (
                <WeatherWidget
                  key={widget._id}
                  id={widget._id}
                  location={widget.location}
                  isFavorite={favorites.has(widget._id)}
                  onDelete={deleteWidget}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
