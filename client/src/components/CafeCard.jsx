import { useState } from "react";
import { Star } from "lucide-react";

export default function CafeCard({ cafe, isSaved, isSelected, onToggleSave, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);

  const photoSrc = cafe.photoUrl?.startsWith("/api")
    ? `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${cafe.photoUrl}`
    : cafe.photoUrl;

  return (
    <article
      onClick={() => onSelect?.(cafe)}
      className={`flex cursor-pointer overflow-hidden rounded-2xl border-2 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${
        isSelected ? "border-primary ring-4 ring-primary/15" : "border-transparent"
      }`}
    >
      <div className="h-[100px] w-[100px] flex-shrink-0 bg-gradient-to-br from-[#d4a574] to-primary">
        {cafe.photoUrl && !imgFailed ? (
          <img
            src={photoSrc}
            alt={cafe.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl opacity-70">☕</div>
        )}
      </div>

      <div className="min-w-0 flex-1 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[0.95rem] font-semibold" title={cafe.name}>
            {cafe.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(cafe);
            }}
            aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
            className="flex-shrink-0 text-lg text-accent transition-transform hover:scale-110"
          >
            {isSaved ? "★" : "☆"}
          </button>
        </div>

        <p className="mt-1 truncate text-[0.78rem] text-gray-500" title={cafe.address}>
          {cafe.address}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.78rem]">
          {cafe.distanceMeters != null && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium">
              📍 {(cafe.distanceMeters / 1000).toFixed(1)} km
            </span>
          )}
          {cafe.rating != null && (
            <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 font-medium">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {cafe.rating}
              {cafe.userRatingCount ? ` (${cafe.userRatingCount})` : ""}
            </span>
          )}
          {cafe.openNow != null && (
            <span className={`font-semibold ${cafe.openNow ? "text-emerald-600" : "text-red-600"}`}>
              {cafe.openNow ? "Open" : "Closed"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}