import React from "react"
import PlanSearchProductsUSDA from "./PlanSearchProductsUSDA.jsx";

import productsStyles from "../styles/Products.module.css"

import {calcMacrosForWeight} from "../../../../utils/calcs.js";
import PlanMacros from "./PlanMacros.jsx";

export default function PlanProducts({ meal, showSearchProducts, planDispatch }) {

    function handleDeleteProduct(fdcId) {
        planDispatch({
            type: 'deleteProduct',
            order: meal.order_number,
            fdcId
        })
    }

    function handleUpdateProduct(fdcId, newQuantity) {
        if(newQuantity <= 0 || newQuantity > 10000) {
            return
        }

        planDispatch({
            type: 'updateProduct',
            order: meal.order_number,
            fdcId,
            quantity: newQuantity
        })
    }

    const productsList = meal.meal_products.map((product, index) => {
        const energy = calcMacrosForWeight(product.energy, product.quantity)
        const protein = calcMacrosForWeight(product.protein, product.quantity)
        const carbs = calcMacrosForWeight(product.carbs, product.quantity)
        const fats = calcMacrosForWeight(product.fats, product.quantity)

        const isLast = index + 1 === meal.meal_products.length

        return (
            <div key={index} className={productsStyles.productWrapper}>
                <div  className={productsStyles.productContainer}>
                    <div className={productsStyles.productInfo}>
                        <p className={productsStyles.productName}>
                            {product.name}
                        </p>
                        <PlanMacros
                            energy={energy}
                            protein={protein}
                            carbs={carbs}
                            fats={fats}
                        />
                    </div>
                    <div className={productsStyles.productAction}>
                        <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleUpdateProduct(product.fdcId, e.target.value)}
                            min={1}
                            max={1000}
                        />
                        <span>g</span>
                        <i className={`ri-delete-bin-6-line ${productsStyles.deleteProductIcon}`}
                           onDoubleClick={() => handleDeleteProduct(product.fdcId)}>
                        </i>
                    </div>
                </div>
                <div className={isLast ? productsStyles.separatorBarLast : productsStyles.separatorBar}></div>
            </div>
        )
    })

    return (
        <section
            className={`${(meal.meal_products.length > 0 || showSearchProducts) && productsStyles.productsSection}`}
        >
            {showSearchProducts && (
                <PlanSearchProductsUSDA meal={meal} planDispatch={planDispatch} />
            )}
            {productsList}
        </section>
    )
}
