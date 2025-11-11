import { appDb, productsDb } from "../config/db.js";

export async function searchProducts(req, res) {
    try {
        const search = req.body.search

        if(!search || search.length < 3) res.status(400).json("Zbyt krótkie lub brak zapytania")

        const values = []

        const searchArray = search.split(" ").filter(word => word !== "").map((s, index) => {
            if (s !== "") {
                values.push(`%${s}%`)
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

        console.log("values: ", values)
        console.log("searchArray: ", searchArray)
        console.log("ilikes: ", ilikes)

        const query =
            "SELECT lp, nazwa_polska, nazwa_angielska " +
            "FROM products " +
            "WHERE " +
            ilikes.join("") +
            "LIMIT 10 "

        console.log(query)

        const result = await productsDb.query(query, searchArray)

        console.log(result.rows)


        res.status(201).json({message: "Pomyślnie wyszukano produkty", result})

    } catch (err) {
        console.error("Błąd przy wyszukiwaniu produktów", err)
        res.status(500).json({message: "Błąd serwera"})
    }
}