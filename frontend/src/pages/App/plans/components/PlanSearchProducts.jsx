import React, {useState, useEffect} from "react"
import productsStyles from "../styles/Products.module.css";
import {searchProducts} from "../../../../api/app/diet.js";
import daysStyles from "../styles/Days.module.css";
import PlanMacros from "./PlanMacros.jsx";

export default function PlanSearchProducts({ planDispatch, meal }) {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])

    useEffect( () => {
        async function fetchData() {
            try {
                return await searchProducts(search)
            } catch (err) {
                return err.message
            }
        }

        if (search.length >= 3) {
            fetchData()
                .then(res => setSearchResult(res.products))
                .catch(err => console.error(err))
        } else {
            setSearchResult([])
        }
    }, [search]);

    function handleAddProduct(lp, name, energy, protein, carbs, fats) {
        planDispatch({
            type: 'addProduct',
            order: meal.order_number,
            product: lp,
            name: name,
            energy: energy,
            protein: protein,
            carbs: carbs,
            fats: fats
        })

        setSearch("")
    }


    const resultList = searchResult.map((product) => {
        return (
            <div key={product.lp} className={productsStyles.searchResultElement}>
                <div style={{width: "100%"}}>
                    <p className={productsStyles.productName}>
                        {product.nazwa_polska}
                    </p>
                    <PlanMacros
                        energy = {product.energia_1169_2012_kcal}
                        protein = {product.bialko_ogolem_g}
                        carbs = {product.weglowodany_ogolem_g}
                        fats = {product.tluszcz_g}
                    />
                </div>
                <button
                    type="button"
                    className={daysStyles.addMealButton}
                    onClick={() =>
                        handleAddProduct(
                            product.lp,
                            product.nazwa_polska,
                            product.energia_1169_2012_kcal.replace(",", "."),
                            product.bialko_ogolem_g.replace(",", "."),
                            product.weglowodany_ogolem_g.replace(",", "."),
                            product.tluszcz_g.replace(",", ".")
                        )
                }>
                    <i className="ri-add-large-line"></i>
                </button>
            </div>
        )
    })

    return (
        <section className={productsStyles.searchSection}>
            <div className={productsStyles.searchWrapper}>
                <i className="ri-search-2-line"></i>
                <input type="search"
                       name="search"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Wyszukaj produkty"
                />
            </div>
            {resultList.length > 0 && <div className={productsStyles.searchResultsList}>
                {resultList}
            </div>}
        </section>
    )
}