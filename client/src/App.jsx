import { useState, useEffect, useMemo } from "react";
import { useGeolocation } from "./hooks/useGeolocation.js";
import { fetchNearbyCafes, fetchFavorites, saveFavorite, deleteFavorite } from "./api.js";
import SearchBar from "./components/SearchBar.jsx";
import CafeList from "./components/CafeList.jsx";
import FavoritesList from "./components/FavoritesList.jsx";
import "./index.css";

export default function App() {
  const { location, loading: locating, error: locationError, requestLocation } = useGeolocation();

  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(false);
  const [cafesError, setCafesError] = useState(null);
  const [radius, setRadius] = useState(1500);

  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("search"); // "search" | "favorites"

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.placeId)), [favorites]);

  // Load saved favorites once on mount.
  useEffect(() => {
    fetchFavorites()
      .then((data) => setFavorites(data.favorites))
      .catch(() => {
        // Non-fatal: favorites just won't be pre-populated if this fails.
      });
  }, []);

  // Whenever we get a location (or the radius changes), fetch cafes.
  useEffect(() => {
    if (!location) return;

    setCafesLoading(true);
    setCafesError(null);

    fetchNearbyCafes({ lat: location.lat, lng: location.lng, radius })
      .then((data) => setCafes(data.cafes))
      .catch((err) => setCafesError(err.message))
      .finally(() => setCafesLoading(false));
  }, [location, radius]);

  async function handleToggleSave(cafe) {
    const alreadySaved = favoriteIds.has(cafe.placeId);

    try {
      if (alreadySaved) {
        await deleteFavorite(cafe.placeId);
        setFavorites((prev) => prev.filter((f) => f.placeId !== cafe.placeId));
      } else {
        const saved = await saveFavorite({
          placeId: cafe.placeId,
          name: cafe.name,
          address: cafe.address,
          rating: cafe.rating,
          photoUrl: cafe.photoUrl,
        });
        setFavorites((prev) => [saved, ...prev]);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err.message);
    }
  }

  async function handleRemoveFavorite(placeId) {
    try {
      await deleteFavorite(placeId);
      setFavorites((prev) => prev.filter((f) => f.placeId !== placeId));
    } catch (err) {
      console.error("Failed to remove favorite:", err.message);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>☕ Cafe Finder</h1>
        <nav className="app__nav">
          <button
            className={view === "search" ? "tab tab--active" : "tab"}
            onClick={() => setView("search")}
          >
            Search
          </button>
          <button
            className={view === "favorites" ? "tab tab--active" : "tab"}
            onClick={() => setView("favorites")}
          >
            Favorites ({favorites.length})
          </button>
        </nav>
      </header>

      <main className="app__main">
        {view === "search" ? (
          <>
            <SearchBar
              onFindNearby={requestLocation}
              loading={locating}
              radius={radius}
              onRadiusChange={setRadius}
            />
            {locationError && <p className="status-message status-message--error">{locationError}</p>}
            <CafeList
              cafes={cafes}
              loading={cafesLoading}
              error={cafesError}
              favoriteIds={favoriteIds}
              onToggleSave={handleToggleSave}
            />
          </>
        ) : (
          <FavoritesList favorites={favorites} onRemove={handleRemoveFavorite} />
        )}
      </main>
    </div>
  );
}
