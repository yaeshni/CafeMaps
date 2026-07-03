import { searchNearbyCafes, getCafeDetails } from "../services/placesApi.js";

/**
 * GET /api/cafes?lat=&lng=&radius=
 * Returns a list of nearby cafes for the given coordinates.
 */
export async function getNearbyCafes(req, res, next) {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: "Both 'lat' and 'lng' query parameters are required.",
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = radius ? parseFloat(radius) : 1500;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({ error: "'lat' and 'lng' must be valid numbers." });
    }

    if (searchRadius <= 0 || searchRadius > 50000) {
      return res.status(400).json({ error: "'radius' must be between 1 and 50000 meters." });
    }

    const cafes = await searchNearbyCafes({ lat: latitude, lng: longitude, radius: searchRadius });
    res.json({ count: cafes.length, cafes });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/cafes/:placeId
 * Returns full details for a single cafe.
 */
export async function getCafeById(req, res, next) {
  try {
    const { placeId } = req.params;
    if (!placeId) {
      return res.status(400).json({ error: "placeId is required." });
    }

    const cafe = await getCafeDetails(placeId);
    res.json(cafe);
  } catch (error) {
    next(error);
  }
}
