import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    deletePlan,
    getPlanById,
    getPlans,
    getPlansCount,
    savePlan,
    searchProducts
} from "../controllers/dietController.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/search", searchProducts)
router.post("/save", savePlan)
router.get("/get", getPlans)
router.get("/count", getPlansCount)
router.get("/get/:id", getPlanById)
router.delete("/delete/:id", deletePlan)

export default router
