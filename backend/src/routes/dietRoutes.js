import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import {getPlanById, getPlans, getPlansCount, savePlan, searchProducts} from "../controllers/dietController.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/search", searchProducts)
router.post("/save", savePlan)
router.get("/get", getPlans)
router.get("/count", getPlansCount)
router.get("/get/:id", getPlanById)

export default router
