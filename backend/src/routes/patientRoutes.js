//dietRoutes
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    addPatient,
    getPatients,
    getPatientsCount,
    getPatientById,
    updatePatient
} from "../controllers/patientController.js";

const router = express.Router()

router.use(authMiddleware)

router.get("/", getPatients)
router.get("/count", getPatientsCount)
router.post("/add", addPatient)
router.get("/:id", getPatientById)
router.post("/:id/update", updatePatient)

export default router