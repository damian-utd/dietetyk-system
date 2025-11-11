import { appDb, productsDb } from "../config/db.js";

export async function searchProducts(req, res) {
    try {
        if (req.user.role !== "dietetyk") return res.status(403).json("Brak uprawnień do wykonania operacji")

        const search = req.body.search

        if(!search || search.length < 3) return res.status(400).json("Zbyt krótkie lub brak zapytania")

        const searchArray = search.split(" ").filter(word => word !== "").map((s, index) => {
            if (s !== "") {
                return `%${s}%`
            }
        })

        const ilikes = searchArray.map((s, index) => {
            if (index === 0) {
                return `nazwa_polska ILIKE $${index+1} `
            } else {
                return `AND nazwa_polska ILIKE $${index+1} `
            }
        })

        const query =
            "SELECT lp, nazwa_polska, nazwa_angielska " +
            "FROM products " +
            "WHERE " +
            ilikes.join("") +
            "LIMIT 10 "

        const result = await productsDb.query(query, searchArray)

        res.status(200).json({message: "Pomyślnie wyszukano produkty", result})

    } catch (err) {
        console.error("Błąd przy wyszukiwaniu produktów", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}