import { useState, useEffect, useMemo } from "react";
import { useGeolocation } from "./hooks/useGeolocation.js";
import { fetchNearbyCafes, fetchFavorites, saveFavorite, deleteFavorite } from "./api.js";
import SearchBar from "./components/SearchBar.jsx";
import CafeList from "./components/CafeList.jsx";
import CafeMap from "./components/CafeMap.jsx";
import FavoritesList from "./components/FavoritesList.jsx";
import "./index.css";

export default function App() {
  const { location: geoLocation, loading: locating, error: locationError, requestLocation } = useGeolocation();

  const [searchCenter, setSearchCenter] = useState(null);
  const [clickedPoint, setClickedPoint] = useState(null);

  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(false);
  const [cafesError, setCafesError] = useState(null);
  const [radius, setRadius] = useState(1500);

  const [nameFilter, setNameFilter] = useState("");
  const [minRating, setMinRating] = useState(0);

  const [selectedCafe, setSelectedCafe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("search");

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.placeId)), [favorites]);

  useEffect(() => {
    fetchFavorites().then((data) => setFavorites(data.favorites)).catch(() => {});
  }, []);

  useEffect(() => {
    if (geoLocation) {
      setClickedPoint(null);
      setSearchCenter(geoLocation);
    }
  }, [geoLocation]);

  useEffect(() => {
    if (!searchCenter) return;
    setCafesLoading(true);
    setCafesError(null);
    setSelectedCafe(null);

    fetchNearbyCafes({ lat: searchCenter.lat, lng: searchCenter.lng, radius })
      .then((data) => setCafes(data.cafes))
      .catch((err) => setCafesError(err.message))
      .finally(() => setCafesLoading(false));
  }, [searchCenter, radius]);

  function handleMapClick(point) {
    setClickedPoint(point);
  }

  function handleFindAtSelected() {
    if (clickedPoint) setSearchCenter(clickedPoint);
  }

  const visibleCafes = useMemo(() => {
    return cafes
      .filter((cafe) => cafe.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter((cafe) => (minRating ? (cafe.rating ?? 0) >= minRating : true));
  }, [cafes, nameFilter, minRating]);

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
  <div className="flex min-h-screen flex-col bg-gray-100 font-sans text-gray-800">
    <header className="flex flex-shrink-0 items-center justify-between gap-4 bg-header px-6 py-4 text-white">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">☕</span>
        <div>
          <h1 className="text-lg font-bold tracking-tight">CafeMaps</h1>
          <p className="text-xs text-white/55">Discover cafes near you</p>
        </div>
      </div>
      <nav className="flex gap-1.5">
        <button
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
            view === "search"
              ? "border-primary bg-primary text-white"
              : "border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
          onClick={() => setView("search")}
        >
          Explore
        </button>
        <button
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
            view === "favorites"
              ? "border-primary bg-primary text-white"
              : "border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
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
          onFindAtSelected={handleFindAtSelected}
          loading={locating || cafesLoading}
          radius={radius}
          onRadiusChange={setRadius}
          nameFilter={nameFilter}
          onNameFilterChange={setNameFilter}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          hasSelectedPoint={!!clickedPoint}
        />
        {locationError && (
          <p className="px-6 py-3 text-center text-sm text-red-600">{locationError}</p>
        )}
        {!searchCenter && (
          <p className="px-6 py-3 text-center text-sm text-gray-500">
            Click anywhere on the map, or use "Search Near Me" to get started
          </p>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[5fr_4fr]">
          <div className="max-h-[calc(100vh-140px)] overflow-y-auto border-r border-gray-200 bg-gray-100">
            <CafeList
              cafes={visibleCafes}
              loading={cafesLoading}
              error={cafesError}
              radius={radius}
              favoriteIds={favoriteIds}
              selectedCafeId={selectedCafe?.placeId}
              onToggleSave={handleToggleSave}
              onSelectCafe={setSelectedCafe}
            />
          </div>
          <div className="sticky top-0 h-[calc(100vh-140px)]">
            <CafeMap
              searchCenter={searchCenter}
              radius={radius}
              cafes={visibleCafes}
              selectedCafe={selectedCafe}
              onSelectCafe={setSelectedCafe}
              onMapClick={handleMapClick}
            />
          </div>
        </div>
      </>
    ) : (
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <FavoritesList favorites={favorites} onRemove={handleRemoveFavorite} />
      </div>
    )}
  </div>
);
}