import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import placesRoutes from "./routes/places.js";
import favoritesRoutes from "./routes/favorites.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import photosRoutes from "./routes/photos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());



// --- Routes ---

app.get("/", (req, res) => {
  res.json({
    message: "Cafe Finder API is running.",
    endpoints: ["/api/health", "/api/cafes?lat=&lng=&radius=", "/api/cafes/:placeId", "/api/favorites"],
  });
});


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/cafes", placesRoutes);
app.use("/api/favorites", favoritesRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);
app.use("/api/photos", photosRoutes);

// --- Startup ---
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Cafe Finder API running on http://localhost:${PORT}`);
  });
}

start();
