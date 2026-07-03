/**
 * Sidebar/panel listing all saved cafes, with a remove button on each.
 */
export default function FavoritesList({ favorites, onRemove }) {
  if (!favorites || favorites.length === 0) {
    return <p className="status-message">No saved cafes yet. Tap ☆ on a cafe to save it.</p>;
  }

  return (
    <ul className="favorites-list">
      {favorites.map((fav) => (
        <li key={fav.placeId} className="favorites-list__item">
          <div>
            <strong>{fav.name}</strong>
            <p>{fav.address}</p>
          </div>
          <button
            className="btn btn--danger btn--small"
            onClick={() => onRemove(fav.placeId)}
            aria-label={`Remove ${fav.name} from favorites`}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
