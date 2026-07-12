import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function ratingBadgeIcon(rating, isSelected) {
  const label = rating != null ? rating.toFixed(1) : "—";
  const color = isSelected ? "#8b5e3c" : "#dc2626";

  return L.divIcon({
    className: "pin-marker-wrapper",
    html: `
      <div class="pin-marker">
        <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0z"
                fill="${color}" stroke="#fff" stroke-width="1.5"/>
        </svg>
        <span class="pin-marker__label">${label}${rating != null ? "★" : ""}</span>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44], // pin tip touches the actual location
  });
}

function centerPointIcon() {
  return L.divIcon({
    className: "user-location-wrapper",
    html: `<div class="user-location-dot"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

/**
 * Actively moves the map when the search center or result set changes.
 * MapContainer's center/zoom props only apply on first mount, so without
 * this, searching a new area would leave the map looking at the old view.
 */
function MapUpdater({ searchCenter, cafes }) {
  const map = useMap();

  useEffect(() => {
    if (!searchCenter) return;

    if (cafes && cafes.length > 0) {
      const bounds = L.latLngBounds([
        [searchCenter.lat, searchCenter.lng],
        ...cafes.map((c) => [c.location.latitude, c.location.longitude]),
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else {
      map.setView([searchCenter.lat, searchCenter.lng], 14);
    }
  }, [searchCenter, cafes, map]);

  return null;
}

export default function CafeMap({ searchCenter, radius, cafes, selectedCafe, onSelectCafe, onMapClick }) {
  const fallbackCenter = [28.6139, 77.209]; // New Delhi, used only before any search happens

  return (
    <MapContainer center={fallbackCenter} zoom={12} className="cafe-map" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />
      <MapUpdater searchCenter={searchCenter} cafes={cafes} />

      {searchCenter && radius && (
        <Circle
          center={[searchCenter.lat, searchCenter.lng]}
          radius={radius}
          pathOptions={{ color: "#8b5e3c", fillColor: "#8b5e3c", fillOpacity: 0.08, weight: 1.5 }}
        />
      )}

      {searchCenter && (
        <Marker position={[searchCenter.lat, searchCenter.lng]} icon={centerPointIcon()}>
          <Popup>Search center</Popup>
        </Marker>
      )}

      {cafes.map((cafe) => (
        <Marker
          key={cafe.placeId}
          position={[cafe.location.latitude, cafe.location.longitude]}
          icon={ratingBadgeIcon(cafe.rating, selectedCafe?.placeId === cafe.placeId)}
          eventHandlers={{ click: () => onSelectCafe?.(cafe) }}
        >
          <Popup>
            <strong>{cafe.name}</strong>
            <br />
            {cafe.rating != null ? `⭐ ${cafe.rating} (${cafe.userRatingCount})` : "No rating yet"}
            {cafe.distanceMeters != null && (
              <>
                <br />
                📍 {(cafe.distanceMeters / 1000).toFixed(1)} km away
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}