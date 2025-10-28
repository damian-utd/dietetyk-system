import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ message: "Brak tokenu autoryzacji" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch {
        res.status(401).json({ message: "Nieprawidłowy lub wygasły token" });
    }
}
