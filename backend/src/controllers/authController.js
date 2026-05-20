import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appDb } from "../config/db.js";
import { validateEmail, validatePassword } from "../utils/validators.js";

export async function register(req, res) {
    const { email, password } = req.body;

    if (!validateEmail(email)) return res.status(400).json({ message: "Nieprawidłowy email" });
    if (!validatePassword(password)) return res.status(400).json({ message: "Hasło musi mieć min. 8 znaków, 1 literę i 1 cyfrę" });

    try {
        const existing = await appDb.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rowCount > 0) return res.status(409).json({ message: "Użytkownik już istnieje" });

        const hash = await bcrypt.hash(password, 10);
        const role = "dietetyk"

        const result = await appDb.query(
            "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
            [email, hash, role]
        );

        const user = result.rows[0];

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        if (role === "dietetyk") {
            await appDb.query(
                `INSERT INTO dieticians (user_id) VALUES ($1)`, [user.id]
            )
        }

        res.status(201).json({ message: "Rejestracja zakończona sukcesem", user });
    } catch (err) {
        console.error("Błąd rejestracji:", err);
        res.status(500).json({ message: "Błąd serwera" });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const result = await appDb.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if (!user) return res.status(400).json({ message: "Błędny email lub hasło" });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(400).json({ message: "Błędny email lub hasło" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.json({ message: "Zalogowano", user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Błąd logowania:", err);
        res.status(500).json({ message: "Błąd serwera" });
    }
}

export async function logout(req, res) {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });
    res.json({ message: "Wylogowano" });
}

export async function getProfile(req, res) {
    try {
        const { id, role } = req.user;
        const q = await appDb.query(
            "SELECT id, email, role, created_at FROM users WHERE id = $1",
            [id]
        );

        if (!q.rows[0]) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }

        if(q.rows[0]?.role !== "dietetyk" && q.rows[0]?.role === role ) {
            return res.status(401).json({ message: "Użytkownik nie ma uprawnień" });
        }

        res.status(200).json(q.rows[0]);
    } catch (err) {
        console.error("Błąd pobierania profilu:", err);
        res.status(500).json({ message: "Błąd serwera" });
    }
}
