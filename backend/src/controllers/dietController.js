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

        if(!searchArray) return res.status(400).json("Zbyt krótkie lub brak zapytania")

        const ilikes = searchArray.map((s, index) => {
            if (index === 0) {
                return `nazwa_polska ILIKE $${index+1} `
            } else {
                return `AND nazwa_polska ILIKE $${index+1} `
            }
        })

        const query =
            "SELECT p.lp, p.nazwa_polska, p.nazwa_angielska, m.bialko_ogolem_g, m.tluszcz_g, m.weglowodany_ogolem_g, w.energia_1169_2012_kcal " +
            "FROM products p " +
            "JOIN makroskladniki m ON p.lp = m.produkt_id " +
            "JOIN wartosci_energetyczne w ON p.lp = w.produkt_id " +
            "WHERE " +
            ilikes.join("")

        const result = await productsDb.query(query, searchArray)

        res.status(200).json({message: "Pomyślnie wyszukano produkty", products: result.rows})

    } catch (err) {
        console.error("Błąd przy wyszukiwaniu produktów", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}