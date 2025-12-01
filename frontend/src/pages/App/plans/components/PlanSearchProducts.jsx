import React, {useState, useEffect} from "react"
import productsStyles from "../styles/Products.module.css";
import {searchProducts} from "../../../../api/app/diet.js";
import mealsStyles from "../styles/Meals.module.css";
import daysStyles from "../styles/Days.module.css";

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
                    <div className={productsStyles.productDesc}>
                        <span className={mealsStyles.mealNotes}>
                            Energia: {product.energia_1169_2012_kcal} kcal
                        </span>
                        <span className={mealsStyles.mealNotes}>
                            Białko: {product.bialko_ogolem_g} g
                        </span>
                        <span className={mealsStyles.mealNotes}>
                            Węglowodany: {product.weglowodany_ogolem_g} g
                        </span>
                        <span className={mealsStyles.mealNotes}>
                            Tłuszcz: {product.tluszcz_g} g
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    className={daysStyles.addMealButton}
                    onClick={() =>
                        handleAddProduct(
                            product.lp,
                            product.nazwa_polska,
                            product.energia_1169_2012_kcal,
                            product.bialko_ogolem_g,
                            product.weglowodany_ogolem_g,
                            product.tluszcz_g
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