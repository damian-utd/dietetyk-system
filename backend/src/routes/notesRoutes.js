// notesRoutes

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {createNote, deleteNotes, getNotes, updateNote} from "../controllers/notesController.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/", createNote)
router.get("/:id", getNotes)
router.delete("/:id", deleteNotes)
router.put("/:id", updateNote)



export default router