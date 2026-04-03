import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    deletePlan, editPlan, getLoggedDietician,
    getPlanById,
    getPlans,
    getPlansCount,
    savePlan,
    searchProducts,
    updateLoggedDietician,
    getPatientsPlans,
    getBannedProducts
} from "../controllers/dietController.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/search", searchProducts)
router.get("/search/:condition", getBannedProducts)
router.get("/count", getPlansCount)
router.get("/dietician", getLoggedDietician)
router.put("/dietician", updateLoggedDietician)
router.get("/patient/:id", getPatientsPlans)
router.post("/", savePlan)
router.get("/", getPlans)
router.put("/:id", editPlan)
router.get("/:id", getPlanById)
router.delete("/:id", deletePlan)

export default router
