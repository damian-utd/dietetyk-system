import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import {searchProducts} from "../controllers/dietController.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/search", searchProducts)

export default router
