export default function FavoritesList({ favorites, onRemove }) {
  if (!favorites || favorites.length === 0) {
    return (
      <p className="p-10 text-center text-sm text-gray-500">
        No saved cafes yet. Tap ☆ on a cafe to save it.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {favorites.map((fav) => (
        <li
          key={fav.placeId}
          className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card"
        >
          <div>
            <strong className="text-[0.95rem]">{fav.name}</strong>
            <p className="mt-1 text-xs text-gray-500">{fav.address}</p>
          </div>
          <button
            onClick={() => onRemove(fav.placeId)}
            aria-label={`Remove ${fav.name} from favorites`}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}