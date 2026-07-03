import Favorite from "../models/Favorite.js";

/**
 * GET /api/favorites
 * Returns all saved cafes, most recently saved first.
 */
export async function getFavorites(req, res, next) {
  try {
    const favorites = await Favorite.find().sort({ createdAt: -1 });
    res.json({ count: favorites.length, favorites });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/favorites
 * Body: { placeId, name, address, rating, photoUrl }
 * Saves a cafe. Silently no-ops (returns the existing doc) if already saved,
 * since a duplicate placeId means the user just tried to save the same
 * cafe twice - not an error worth surfacing.
 */
export async function addFavorite(req, res, next) {
  try {
    const { placeId, name, address, rating, photoUrl } = req.body;

    if (!placeId || !name || !address) {
      return res.status(400).json({
        error: "placeId, name, and address are required.",
      });
    }

    const existing = await Favorite.findOne({ placeId });
    if (existing) {
      return res.status(200).json(existing);
    }

    const favorite = await Favorite.create({ placeId, name, address, rating, photoUrl });
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/favorites/:placeId
 * Removes a saved cafe by its Google place ID.
 */
export async function removeFavorite(req, res, next) {
  try {
    const { placeId } = req.params;
    const deleted = await Favorite.findOneAndDelete({ placeId });

    if (!deleted) {
      return res.status(404).json({ error: "Favorite not found." });
    }

    res.json({ message: "Favorite removed.", placeId });
  } catch (error) {
    next(error);
  }
}
