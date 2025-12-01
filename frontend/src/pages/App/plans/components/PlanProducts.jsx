import React from "react"
import PlanSearchProducts from "./PlanSearchProducts.jsx";

import productsStyles from "../styles/Products.module.css"
import mealsStyles from "../styles/Meals.module.css";

import {calcMacrosForWeight} from "../../../../utils/calcs.js";

export default function PlanProducts({ meal, showSearchProducts, planDispatch }) {

    function handleDeleteProduct(lp) {
        planDispatch({
            type: 'deleteProduct',
            order: meal.order_number,
            product: lp
        })
    }

    function handleUpdateProduct(lp, newQuantity) {
        if(newQuantity < 0 || newQuantity > 10000) {
            return
        }

        planDispatch({
            type: 'updateProduct',
            order: meal.order_number,
            product: lp,
            quantity: newQuantity
        })
    }

    const productsList = meal.meal_products.map((product, index) => {

        return (
            <div key={index} className={productsStyles.productContainer}>
                <div className={productsStyles.productInfo}>
                    <p className={productsStyles.productName}>
                        {product.name}
                    </p>
                    <div className={productsStyles.productDesc}>
                        <span className={mealsStyles.mealNotes}>
                            Energia: {calcMacrosForWeight(product.energy, product.quantity)} kcal
                        </span>
                        <span className={mealsStyles.mealNotes}>
                            Białko: {calcMacrosForWeight(product.protein, product.quantity)} g
                        </span>
                        <span className={mealsStyles.mealNotes}>
                            Węglowodany: {calcMacrosForWeight(product.carbs, product.quantity)} g
                        </span>
                        <span className={mealsStyles.mealNotes}>
                            Tłuszcz: {calcMacrosForWeight(product.fats, product.quantity)} g
                        </span>
                    </div>
                </div>
                <div className={productsStyles.productAction}>
                    <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleUpdateProduct(product.product, e.target.value)}
                        max={1000}
                    />
                    <span>g</span>
                    <i className={`ri-delete-bin-6-line`} style={{fontSize: "1.5rem", cursor: "pointer"}}
                       onDoubleClick={() => handleDeleteProduct(product.product)}>
                    </i>
                </div>
            </div>
        )
    })

    return (
        <section
            className={`${(meal.meal_products.length > 0 || showSearchProducts) && productsStyles.productsSection}`}>
            {showSearchProducts && <PlanSearchProducts planDispatch={planDispatch} meal={meal}/>}
            {productsList}
        </section>
    )
}