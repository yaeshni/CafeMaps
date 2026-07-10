import { useState } from "react";

export default function CafeCard({
  cafe,
  isSaved,
  isSelected,
  onToggleSave,
  onSelect,
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const photoSrc = cafe.photoUrl?.startsWith("/api")
  ? `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${cafe.photoUrl}`
  : cafe.photoUrl;


  return (
    <article
      className={`cafe-card ${isSelected ? "cafe-card--selected" : ""}`}
      onClick={() => onSelect?.(cafe)}
    >
      <div className="cafe-card__photo">
        {/* 2. Changed cafe.photoUrl to photoSrc below */}
        {photoSrc && !imgFailed ? (
          <img
            src={photoSrc}
            alt={cafe.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="cafe-card__photo-placeholder">☕</div>
        )}
      </div>
      <div className="cafe-card__body">
        <div className="cafe-card__header">
          <h3 title={cafe.name}>{cafe.name}</h3>
          <button
            className="save-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevents clicking the button from triggering the card's onSelect
              onToggleSave(cafe);
            }}
            aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
          >
            {isSaved ? "★" : "☆"}
          </button>
        </div>
        <p className="cafe-card__address" title={cafe.address}>
          {cafe.address}
        </p>
        <div className="cafe-card__meta">
          {cafe.distanceMeters != null && (
            <span className="cafe-card__badge">
              📍 {(cafe.distanceMeters / 1000).toFixed(1)} km
            </span>
          )}
          {cafe.rating != null && (
            <span className="cafe-card__badge">
              ⭐ {cafe.rating}
              {cafe.userRatingCount ? ` (${cafe.userRatingCount})` : ""}
            </span>
          )}
          {cafe.openNow != null && (
            <span className={`cafe-card__status ${cafe.openNow ? "open" : "closed"}`}>
              {cafe.openNow ? "Open" : "Closed"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}