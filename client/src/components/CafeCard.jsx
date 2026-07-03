/**
 * Displays a single cafe's summary info: photo, name, rating, address,
 * and a save/unsave button.
 */
export default function CafeCard({ cafe, isSaved, onToggleSave }) {
  return (
    <div className="cafe-card">
      <div className="cafe-card__photo">
        {cafe.photoUrl ? (
          <img src={cafe.photoUrl} alt={cafe.name} loading="lazy" />
        ) : (
          <div className="cafe-card__photo-placeholder">☕</div>
        )}
      </div>

      <div className="cafe-card__body">
        <div className="cafe-card__header">
          <h3>{cafe.name}</h3>
          <button
            className={`save-btn ${isSaved ? "save-btn--active" : ""}`}
            onClick={() => onToggleSave(cafe)}
            aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
            title={isSaved ? "Remove from favorites" : "Save to favorites"}
          >
            {isSaved ? "★" : "☆"}
          </button>
        </div>

        <p className="cafe-card__address">{cafe.address}</p>

        <div className="cafe-card__meta">
          {cafe.rating != null && (
            <span className="cafe-card__rating">
              ⭐ {cafe.rating} ({cafe.userRatingCount})
            </span>
          )}
          {cafe.openNow != null && (
            <span className={`cafe-card__status ${cafe.openNow ? "open" : "closed"}`}>
              {cafe.openNow ? "Open now" : "Closed"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
