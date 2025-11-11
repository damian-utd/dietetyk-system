//server
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js"
import dietRoutes from "./src/routes/dietRoutes.js";

const app = express();

// Ustawienia
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

// Trasy
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/diet", dietRoutes);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend działa :${PORT}`);
});


// TEST WYŚWIETLANIA TABELI users
// app.get("/api/test", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM users");
//         res.json(result.rows);
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).json({ error: "Database query failed" });
//     }
// });
//TEST COOKIE (OBAWY ZE NIE ZADZIALA Z PROXY OD VITE)
// app.get("/api/set-cookie", (req, res) => {
//     res.cookie("testCookie", "OK", { httpOnly: true });
//     res.json({ message: "Cookie ustawione!" });
// });
