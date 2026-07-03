import { Router } from "express";
import { getNearbyCafes, getCafeById } from "../controllers/placesController.js";

const router = Router();

router.get("/", getNearbyCafes);
router.get("/:placeId", getCafeById);

export default router;
