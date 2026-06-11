import express from "express";
import {
    getFoodById,
    searchFoods
} from "../controllers/foodDataCentralController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/foods/search", searchFoods);
router.get("/food/:fdcId", getFoodById);

export default router;
