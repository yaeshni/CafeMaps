import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { name, maxWidth = 400 } = req.query;
    if (!name) return res.status(400).json({ error: "Photo name required" });

    const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidth}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Photo fetch failed" });
    }

    res.set("Content-Type", response.headers.get("content-type"));
    res.set("Cache-Control", "public, max-age=86400");
    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

export default router;