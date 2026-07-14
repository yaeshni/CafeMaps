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
  "places.primaryType",
  "places.types",
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

export async function searchNearbyCafes({ lat, lng, radius = 1500 }) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new PlacesApiError("Server is missing GOOGLE_PLACES_API_KEY", 500);
  }

  const body = {
    includedPrimaryTypes: ["cafe"],
    excludedTypes: ["restaurant", "fast_food_restaurant", "meal_takeaway"],
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
  const places = (data.places || [])
    .filter(isActualCafe)
    .map((place) => {
      const summary = formatCafeSummary(place);
      const distanceMeters = getDistanceMeters(
        lat,
        lng,
        place.location.latitude,
        place.location.longitude
      );
      return { ...summary, distanceMeters: Math.round(distanceMeters) };
    })
    .filter((cafe) => cafe.distanceMeters <= radius)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return places;
}

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

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isActualCafe(place) {
  const primary = place.primaryType;
  const types = place.types || [];

  const excluded = new Set([
    "restaurant",
    "meal_takeaway",
    "fast_food_restaurant",
    "bar",
    "night_club",
  ]);

  if (primary && excluded.has(primary)) return false;
  if (primary === "cafe") return true;

  return types.includes("cafe") && !types.some((t) => excluded.has(t));
}

function buildPhotoUrl(photoName, maxWidthPx = 400) {
  if (!photoName) return null;
  return `/api/photos?name=${encodeURIComponent(photoName)}&maxWidth=${maxWidthPx}`;
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