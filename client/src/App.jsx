import { useState, useEffect, useMemo } from "react";
import { useGeolocation } from "./hooks/useGeolocation.js";
import { fetchNearbyCafes, fetchFavorites, saveFavorite, deleteFavorite } from "./api.js";
import SearchBar from "./components/SearchBar.jsx";
import CafeList from "./components/CafeList.jsx";
import FavoritesList from "./components/FavoritesList.jsx";
import CafeMap from "./components/CafeMap.jsx";
import "./index.css";

export default function App() {
  const { location, loading: locating, error: locationError, requestLocation } = useGeolocation();

  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(false);
  const [cafesError, setCafesError] = useState(null);
  const [radius, setRadius] = useState(1500);

  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("search"); // "search" | "favorites"
  const [selectedCafe, setSelectedCafe] = useState(null);
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
        <div className="app__brand">
          <span className="app__brand-icon">☕</span>
          <div>
            <h1>CafeMaps</h1>
            <p>Discover cafes near you</p>
          </div>
        </div>
        <nav className="app__nav">
          <button
            className={`tab ${view === "search" ? "tab--active" : ""}`}
            onClick={() => setView("search")}
          >
            Explore
          </button>
          <button
            className={`tab ${view === "favorites" ? "tab--active" : ""}`}
            onClick={() => setView("favorites")}
          >
            Saved ({favorites.length})
          </button>
        </nav>
      </header>

      {view === "search" ? (
        <>
          <SearchBar
            onFindNearby={requestLocation}
            loading={locating}
            radius={radius}
            onRadiusChange={setRadius}
          />
          {locationError && (
            <p className="status-message status-message--error">{locationError}</p>
          )}
          <div className="app__main">
            <div className="app__list-panel">
              <CafeList
                cafes={cafes}
                loading={cafesLoading}
                error={cafesError}
                radius={radius}
                favoriteIds={favoriteIds}
                selectedCafeId={selectedCafe?.placeId}
                onToggleSave={handleToggleSave}
                onSelectCafe={setSelectedCafe}
              />
            </div>
            <div className="app__map-panel">
              <CafeMap
                userLocation={location}
                cafes={cafes}
                selectedCafe={selectedCafe}
                onSelectCafe={setSelectedCafe}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="favorites-panel">
          <FavoritesList favorites={favorites} onRemove={handleRemoveFavorite} />
        </div>
      )}
    </div>
  );
}