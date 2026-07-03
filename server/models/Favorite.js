import mongoose from "mongoose";

/**
 * A saved/favorited cafe. Kept intentionally simple for v1 (no user auth yet -
 * see README "Future Improvements" for the planned per-user version using JWT).
 */
const favoriteSchema = new mongoose.Schema(
  {
    placeId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: null,
    },
    photoUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
