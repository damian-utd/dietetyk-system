//PlanCreator

import React, { useReducer, useEffect, useMemo } from "react"
import {useLoaderData, Form, redirect} from "react-router-dom";

import styles from "./Plans.module.css"
import {getPatients} from "../../../api/app/patients.js";
import {planReducer, initPlanState} from "./planReducer.js";
import PlanSidebar from "./components/PlanSidebar.jsx";
import PlanMetaSection from "./components/PlanMetaSection.jsx";
import PlanDaysSection from "./components/PlanDaysSection.jsx";
import {editPlan, getPlanById, savePlan} from "../../../api/app/diet.js";
import {calcMacrosForWeight} from "../../../utils/calcs.js";
import {roundDec} from "../../../utils/utils.js";

export async function loader({ params }){
    try {
        if (params?.id) {
            let plan = await getPlanById(params.id)
            plan = {
                ...plan.plan,
                __meta: "db"
            }
            return {
                patients: await getPatients(),
                planDb: plan
            }
        }
        return {
            patients: await getPatients()
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function action( {request, params} ) {
    const formData = await request.formData()
    const data = JSON.parse(formData.get("planState"))
    const intent = formData.get("intent")

    if(intent === "create") {
        try {
            await savePlan(data)
            return redirect("/plans")
        } catch (err) {
            return {error: err.message}
        }
    } else {
        try {
            await editPlan(data, params.id)
            return redirect(`/plans/${params.id}`)
        } catch (err) {
            return {error: err.message}
        }
    }

}



export default function PlanCreator() {
    const loaderData = useLoaderData()

    const [planState, planDispatch] = useReducer(planReducer,  loaderData?.planDb ?? {
        patient_id: null,
        title: "",
        description: "",
        days: [{
            day_number: 1,
            meals: []
        }],
        currentDayNumber: 1
    }, initPlanState)

    useEffect(() => {
        planState.__meta !== "db" && localStorage.setItem("planData", JSON.stringify(planState));
    }, [planState]);

    function clearPlan() {
        planDispatch({type: 'setDefault'})
        localStorage.clear();
    }

    const patients = loaderData?.patients.patients || []

    const patient = patients.find(p => p.id === Number(planState.patient_id)) || null
    const currentDay = planState.days.find(day => day.day_number === planState.currentDayNumber)
    const dayMacros = useMemo(() => {
        const totals = currentDay?.meals.reduce((dayAcc, meal) => {
            meal.meal_products.forEach(product => {
                dayAcc.energy += calcMacrosForWeight(product.energy, product.quantity)
                dayAcc.protein += calcMacrosForWeight(product.protein, product.quantity)
                dayAcc.carbs += calcMacrosForWeight(product.carbs, product.quantity)
                dayAcc.fats += calcMacrosForWeight(product.fats, product.quantity)
            })
            return dayAcc
        }, {energy: 0, protein: 0, carbs: 0, fats: 0})

        return Object.fromEntries(
            Object.entries(totals ?? {}).map(([key, value]) => [key, roundDec(value, 2)])
        )
    }, [currentDay])

    return (
        <div className={styles.planCreatorBody}>
            <Form method="post" className={styles.main} id="planForm">
                <PlanMetaSection
                    patients={patients}
                    planDispatch={planDispatch}
                    patientId={planState.patient_id}
                    title={planState.title}
                    description={planState.description}
                />
                <PlanDaysSection
                    days={planState.days}
                    currentDayNumber={planState.currentDayNumber}
                    planDispatch={planDispatch}
                    patient={patient}
                />
                <input name="planState" value={JSON.stringify(planState)} readOnly hidden/>
            </Form>
            <PlanSidebar
                clearPlan={clearPlan}
                patient={patient}
                patientId={loaderData?.planDb?.patient_id}
                currentDayNumber={planState.currentDayNumber}
                dayMacros={dayMacros}
            />
        </div>
    )
}
