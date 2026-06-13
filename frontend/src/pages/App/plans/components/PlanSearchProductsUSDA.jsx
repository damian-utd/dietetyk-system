import React, { useEffect, useState } from "react";
import { searchFoodDataCentral } from "../../../../api/app/foodDataCentral.js";
import productsStyles from "../styles/Products.module.css";
import daysStyles from "../styles/Days.module.css";
import PlanMacros from "./PlanMacros.jsx";

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DELAY_MS = 400;
const USDA_DATA_TYPES = ["Foundation", "SR Legacy", "Survey (FNDDS)"];
export default function PlanSearchProductsUSDA({ planDispatch, meal }) {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const query = search.trim();

        if (query.length < MIN_SEARCH_LENGTH) {
            return;
        }

        let ignoreResult = false;
        const timeout = setTimeout(async () => {
            setIsLoading(true);
            setError("");

            try {
                const data = await searchFoodDataCentral(query, {
                    pageSize: 10,
                    dataType: USDA_DATA_TYPES
                });

                if (!ignoreResult) {
                    setSearchResult(data.products ?? []);
                }
            } catch (err) {
                if (!ignoreResult) {
                    setSearchResult([]);
                    setError(err.message);
                }
            } finally {
                if (!ignoreResult) {
                    setIsLoading(false);
                }
            }
        }, SEARCH_DELAY_MS);

        return () => {
            ignoreResult = true;
            clearTimeout(timeout);
        };
    }, [search]);

    function handleSearchChange(event) {
        const value = event.target.value;

        setSearch(value);

        if (value.trim().length < MIN_SEARCH_LENGTH) {
            setSearchResult([]);
            setError("");
            setIsLoading(false);
        } else {
            setError("");
            setIsLoading(true);
        }
    }

    function handleAddProduct(product) {
        const hasAllMacros = ["energy", "protein", "carbs", "fats"]
            .every(field => product[field] !== null);

        if (!hasAllMacros) {
            setError("Produkt nie zawiera kompletu podstawowych wartości odżywczych.");
            return;
        }

        planDispatch({
            type: "addProduct",
            order: meal.order_number,
            ...product
        });
        setSearch("");
        setSearchResult([]);
    }

    const resultList = searchResult.map(product => (
            <div key={product.fdcId} className={productsStyles.searchResultElement}>
                <div className={productsStyles.searchResultInfo}>
                    <p className={productsStyles.productName}>
                        {product.name}
                    </p>
                    <PlanMacros
                        energy={product.energy}
                        protein={product.protein}
                        carbs={product.carbs}
                        fats={product.fats}
                    />
                </div>
                <button
                    type="button"
                    className={daysStyles.addMealButton}
                    onClick={() => handleAddProduct(product)}
                >
                    <i className="ri-add-large-line"></i>
                </button>
            </div>
    ));

    const hasSearchQuery = search.trim().length >= MIN_SEARCH_LENGTH;

    return (
        <section className={productsStyles.searchSection}>
            <div className={productsStyles.searchWrapper}>
                <i className="ri-search-2-line"></i>
                <input
                    type="search"
                    name="search-usda"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Wyszukaj produkty - USDA (wyszukiwanie tylko w języku angielskim)"
                />
            </div>
            {isLoading && (
                <p className={productsStyles.searchMessage}>Wyszukiwanie produktów...</p>
            )}
            {!isLoading && error && (
                <p className={productsStyles.searchError}>{error}</p>
            )}
            {!isLoading && !error && hasSearchQuery && resultList.length === 0 && (
                <p className={productsStyles.searchMessage}>Nie znaleziono produktów</p>
            )}
            {!isLoading && !error && resultList.length > 0 && (
                <div className={productsStyles.searchResultsList}>
                    {resultList}
                </div>
            )}
        </section>
    );
}
