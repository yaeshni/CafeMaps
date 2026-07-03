/**
 * Wrapper around Google Places API (New).
 *
 * All calls to Google live here so the rest of the app never has to know
 * about Google's request/response shape. This also means the API key
 * only ever exists on the server - it is never sent to the browser.
 *
 * Field masks are used everywhere to control cost: Places API (New) bills
 * by which fields you request, so asking for less than you need keeps this
 * project comfortably inside the free tier.
 */

const PLACES_BASE_URL = "https://places.googleapis.com/v1/places";

const NEARBY_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.currentOpeningHours.openNow",
  "places.priceLevel",
  "places.photos.name",
].join(",");

const DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "rating",
  "userRatingCount",
  "currentOpeningHours",
  "nationalPhoneNumber",
  "websiteUri",
  "priceLevel",
  "photos.name",
  "googleMapsUri",
].join(",");

class PlacesApiError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "PlacesApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Searches for cafes within a radius of a lat/lng point.
 * @param {{ lat: number, lng: number, radius: number }} params
 * @returns {Promise<Array>} simplified list of cafe objects
 */
export async function searchNearbyCafes({ lat, lng, radius = 1500 }) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new PlacesApiError("Server is missing GOOGLE_PLACES_API_KEY", 500);
  }

  const body = {
    includedTypes: ["cafe"],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius,
      },
    },
  };

  const response = await fetch(`${PLACES_BASE_URL}:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": NEARBY_FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new PlacesApiError(
      `Places API nearby search failed: ${response.status} ${errorBody}`,
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const data = await response.json();
  const places = data.places || [];

  return places.map(formatCafeSummary);
}

/**
 * Gets full details for a single place by its Google place ID.
 * @param {string} placeId
 */
export async function getCafeDetails(placeId) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new PlacesApiError("Server is missing GOOGLE_PLACES_API_KEY", 500);
  }

  const response = await fetch(`${PLACES_BASE_URL}/${placeId}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": DETAILS_FIELD_MASK,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new PlacesApiError(
      `Places API details request failed: ${response.status} ${errorBody}`,
      response.status >= 400 && response.status < 500 ? 400 : 502
    );
  }

  const place = await response.json();
  return formatCafeDetails(place);
}

function buildPhotoUrl(photoName, maxWidthPx = 400) {
  if (!photoName) return null;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  return `${PLACES_BASE_URL}/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${apiKey}`;
}

function formatCafeSummary(place) {
  return {
    placeId: place.id,
    name: place.displayName?.text || "Unnamed Cafe",
    address: place.formattedAddress || "Address unavailable",
    location: place.location,
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? 0,
    openNow: place.currentOpeningHours?.openNow ?? null,
    priceLevel: place.priceLevel ?? null,
    photoUrl: buildPhotoUrl(place.photos?.[0]?.name),
  };
}

function formatCafeDetails(place) {
  return {
    placeId: place.id,
    name: place.displayName?.text || "Unnamed Cafe",
    address: place.formattedAddress || "Address unavailable",
    location: place.location,
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? 0,
    openNow: place.currentOpeningHours?.openNow ?? null,
    weekdayDescriptions: place.currentOpeningHours?.weekdayDescriptions || [],
    phoneNumber: place.nationalPhoneNumber || null,
    website: place.websiteUri || null,
    priceLevel: place.priceLevel ?? null,
    googleMapsUri: place.googleMapsUri || null,
    photoUrl: buildPhotoUrl(place.photos?.[0]?.name, 800),
  };
}

export { PlacesApiError };
