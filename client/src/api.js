/**
 * Thin wrapper around fetch for talking to our own backend.
 * The frontend never talks to Google directly - it only ever
 * hits our Express server, which holds the real API key.
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export async function fetchNearbyCafes({ lat, lng, radius = 1500 }) {
  const params = new URLSearchParams({ lat, lng, radius });
  const response = await fetch(`${API_URL}/cafes?${params}`);
  return handleResponse(response);
}

export async function fetchCafeDetails(placeId) {
  const response = await fetch(`${API_URL}/cafes/${placeId}`);
  return handleResponse(response);
}

export async function fetchFavorites() {
  const response = await fetch(`${API_URL}/favorites`);
  return handleResponse(response);
}

export async function saveFavorite(cafe) {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cafe),
  });
  return handleResponse(response);
}

export async function deleteFavorite(placeId) {
  const response = await fetch(`${API_URL}/favorites/${placeId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
