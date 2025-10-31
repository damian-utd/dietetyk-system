//dietRoutes
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {addPatient, getPatients, getPatientsCount, getPatientById} from "../controllers/dietController.js";

const router = express.Router()

router.use(authMiddleware)

router.get("/patients-count", getPatientsCount)
router.get("/patients", getPatients)
router.get("/patients/:id", getPatientById)
router.post("/patient-add", addPatient)


export default router

