//server
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js"
import dietRoutes from "./src/routes/dietRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";
import notesRoutes from "./src/routes/notesRoutes.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/progress", progressRoutes)
app.use("/api/notes", notesRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend działa :${PORT}`);
});

