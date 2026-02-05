// progressRoutes

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    createProgress,
    deleteProgress,
    getProgress
} from "../controllers/progressController.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/", createProgress)
router.get("/:id", getProgress)
router.delete("/:id", deleteProgress)

export default router