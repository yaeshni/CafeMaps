import { Search, Star, MapPin, Navigation } from "lucide-react";

export default function SearchBar({
  onFindNearby,
  onFindAtSelected,
  loading,
  radius,
  onRadiusChange,
  nameFilter,
  onNameFilterChange,
  minRating,
  onMinRatingChange,
  hasSelectedPoint,
}) {
  const radiusStepsKm = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-4">
      <div className="relative min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          className="w-full rounded-xl border-[1.5px] border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      <div className="relative">
        <Star className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
        <select
          value={minRating}
          onChange={(e) => onMinRatingChange(Number(e.target.value))}
          className="cursor-pointer rounded-xl border-[1.5px] border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm font-semibold text-gray-800 transition-colors focus:border-primary focus:outline-none"
        >
          <option value={0}>Any rating</option>
          <option value={3}>3.0+</option>
          <option value={3.5}>3.5+</option>
          <option value={4}>4.0+</option>
          <option value={4.5}>4.5+</option>
        </select>
      </div>

      <div className="flex items-center gap-2.5 rounded-full border-[1.5px] border-gray-200 bg-gray-100 py-1.5 pl-3.5 pr-1.5">
        <span className="text-xs font-semibold text-gray-500">Radius (km)</span>
        <div className="flex gap-1 rounded-full bg-white p-1">
          {radiusStepsKm.map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => onRadiusChange(km * 1000)}
              className={`h-7 w-7 rounded-full text-xs font-bold transition-all ${
                radius === km * 1000
                  ? "bg-primary text-white shadow-md shadow-primary/40"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {km}
            </button>
          ))}
        </div>
      </div>

      <div className="ml-auto flex gap-2.5">
        <button
          onClick={onFindAtSelected}
          disabled={loading || !hasSelectedPoint}
          title={hasSelectedPoint ? "" : "Click a spot on the map first"}
          className="flex items-center gap-1.5 rounded-xl border-[1.5px] border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
        >
          <MapPin className="h-4 w-4" />
          Find Nearby
        </button>
        <button
          onClick={onFindNearby}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Navigation className="h-4 w-4" />
          {loading ? "Locating..." : "Search Near Me"}
        </button>
      </div>
    </div>
  );
}