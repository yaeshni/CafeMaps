import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIconCafe from "leaflet/dist/images/marker-icon.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function CafeMap({ userLocation, cafes, onSelectCafe }) {
  if (!userLocation) {
    return (
      <div className="map-placeholder">
        Enable location to see cafes on the map
      </div>
    );
  }

  const center = [userLocation.lat, userLocation.lng];

  return (
    <MapContainer center={center} zoom={14} className="cafe-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={center} />
      <Marker position={center}>
        <Popup>You are here</Popup>
      </Marker>
            {cafes.map((cafe) =>cafe.location ? (
                <Marker
        key={cafe.placeId}
        position={[cafe.location.latitude, cafe.location.longitude]}
        eventHandlers={{ click: () => onSelectCafe?.(cafe) }}
        >
        <Popup>
            <strong>{cafe.name}</strong>
            <br />
            {cafe.rating != null && `⭐ ${cafe.rating}`}
            {cafe.distanceMeters != null && (
            <>
                <br />
                📍 {(cafe.distanceMeters / 1000).toFixed(1)} km away
            </>
            )}
        </Popup>
        </Marker>
        ) : null
      )}
    </MapContainer>
  );
}