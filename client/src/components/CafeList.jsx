import CafeCard from "./CafeCard.jsx";

/**
 * Renders a grid of CafeCard components, or an empty/loading state.
 */
export default function CafeList({ cafes, loading, error, favoriteIds, onToggleSave }) {
  if (loading) {
    return <p className="status-message">Finding cafes near you...</p>;
  }

  if (error) {
    return <p className="status-message status-message--error">{error}</p>;
  }

  if (!cafes || cafes.length === 0) {
    return <p className="status-message">No cafes found yet. Try searching your location.</p>;
  }

  return (
    <div className="cafe-list">
      {cafes.map((cafe) => (
        <CafeCard
          key={cafe.placeId}
          cafe={cafe}
          isSaved={favoriteIds.has(cafe.placeId)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
