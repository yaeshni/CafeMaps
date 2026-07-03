import { useState, useCallback } from "react";

/**
 * Wraps the browser Geolocation API in a hook with loading/error state,
 * so components don't have to deal with the callback-based API directly.
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? "Location access was denied. Please enable it in your browser settings."
            : "Unable to retrieve your location.";
        setError(message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, loading, error, requestLocation };
}
