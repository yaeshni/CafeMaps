/**
 * Controls for finding cafes: a "use my location" button and a
 * radius selector. Kept deliberately simple - manual address search
 * would require the Geocoding API, listed as a future improvement.
 */
export default function SearchBar({ onFindNearby, loading, radius, onRadiusChange }) {
  return (
    <div className="search-bar">
      <button className="btn btn--primary" onClick={onFindNearby} disabled={loading}>
        {loading ? "Locating..." : "📍 Find cafes near me"}
      </button>

      <label className="radius-select">
        Radius:
        <select value={radius} onChange={(e) => onRadiusChange(Number(e.target.value))}>
          <option value={500}>500 m</option>
          <option value={1000}>1 km</option>
          <option value={1500}>1.5 km</option>
          <option value={3000}>3 km</option>
          <option value={5000}>5 km</option>
        </select>
      </label>
    </div>
  );
}
