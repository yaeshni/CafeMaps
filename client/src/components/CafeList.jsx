import CafeCard from "./CafeCard.jsx";

function SkeletonCards() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton h-[100px] animate-shimmer rounded-2xl" />
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
      <div className="flex flex-col gap-2.5 p-4">
        <h2 className="mb-1 text-sm font-semibold">Finding cafes...</h2>
        <SkeletonCards />
      </div>
    );
  }

  if (error) {
    return <p className="p-10 text-center text-sm text-red-600">{error}</p>;
  }

  if (!cafes || cafes.length === 0) {
    return (
      <p className="p-10 text-center text-sm text-gray-500">
        No cafes found. Try increasing the radius or enabling location.
      </p>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-gray-100 px-5 pb-2 pt-4">
        <h2 className="text-sm font-semibold">
          {cafes.length} cafe{cafes.length !== 1 ? "s" : ""} nearby
        </h2>
        <p className="mt-1 text-xs text-gray-500">Within {(radius / 1000).toFixed(1)} km of your location</p>
      </div>
      <div className="flex flex-col gap-2.5 px-4 pb-6">
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