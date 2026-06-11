import React, { useEffect, useState } from "react";
import { searchFoodDataCentral } from "../../../../api/app/foodDataCentral.js";
import productsStyles from "../styles/Products.module.css";
import PlanMacros from "./PlanMacros.jsx";

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DELAY_MS = 400;
const USDA_DATA_TYPES = ["Foundation", "SR Legacy", "Survey (FNDDS)"];
const MACRO_NUTRIENT_IDS = {
    protein: 1003,
    fats: 1004,
    carbs: 1005,
    energy: 1008
};

function getNutrientValue(foodNutrients, nutrientId) {
    return foodNutrients.find(nutrient => nutrient.nutrientId === nutrientId)?.value ?? 0;
}

export default function PlanSearchProductsUSDA() {
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
                    setSearchResult(data.foods ?? []);
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

    const resultList = searchResult.map(product => {
        const nutrients = product.foodNutrients ?? [];

        return (
            <div key={product.fdcId} className={productsStyles.searchResultElement}>
                <div className={productsStyles.searchResultInfo}>
                    <p className={productsStyles.productName}>
                        {product.description}
                    </p>
                    <PlanMacros
                        energy={getNutrientValue(nutrients, MACRO_NUTRIENT_IDS.energy)}
                        protein={getNutrientValue(nutrients, MACRO_NUTRIENT_IDS.protein)}
                        carbs={getNutrientValue(nutrients, MACRO_NUTRIENT_IDS.carbs)}
                        fats={getNutrientValue(nutrients, MACRO_NUTRIENT_IDS.fats)}
                    />
                </div>
            </div>
        );
    });

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
