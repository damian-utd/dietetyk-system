//dietRoutes
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    addPatient,
    getPatients,
    getPatientsCount,
    getPatientById,
    updatePatient
} from "../controllers/dietController.js";

const router = express.Router()

router.use(authMiddleware)

router.get("/patients-count", getPatientsCount)
router.get("/patients", getPatients)
router.get("/patients/:id", getPatientById)
router.post("/patients-add", addPatient)
router.post("/patients/:id/update", updatePatient)


export default router

