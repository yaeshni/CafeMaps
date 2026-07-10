import CafeCard from "./CafeCard.jsx";

function SkeletonCards() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </>
  );
}

export default function CafeList({
  cafes,
  loading,
  error,
  radius,
  favoriteIds,
  selectedCafeId,
  onToggleSave,
  onSelectCafe,
}) {
  if (loading) {
    return (
      <div className="cafe-list">
        <div className="cafe-list__header">
          <h2>Finding cafes...</h2>
        </div>
        <SkeletonCards />
      </div>
    );
  }

  if (error) {
    return <p className="status-message status-message--error">{error}</p>;
  }

  if (!cafes || cafes.length === 0) {
    return (
      <p className="status-message">
        No cafes found. Try increasing the radius or enabling location.
      </p>
    );
  }

  return (
    <>
      <div className="cafe-list__header">
        <h2>{cafes.length} cafe{cafes.length !== 1 ? "s" : ""} nearby</h2>
        <p>Within {(radius / 1000).toFixed(1)} km of your location</p>
      </div>
      <div className="cafe-list">
        {cafes.map((cafe) => (
          <CafeCard
            key={cafe.placeId}
            cafe={cafe}
            isSaved={favoriteIds.has(cafe.placeId)}
            isSelected={selectedCafeId === cafe.placeId}
            onToggleSave={onToggleSave}
            onSelect={onSelectCafe}
          />
        ))}
      </div>
    </>
  );
}