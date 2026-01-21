//PlanCreator

import React, { useReducer, useEffect } from "react"
import {useLoaderData, Form} from "react-router-dom";

import styles from "./styles/Plans.module.css"
import {getPatients} from "../../../api/app/patients.js";
import {planReducer, initPlanState} from "./planReducer.js";
import PlanSidebar from "./components/PlanSidebar.jsx";
import PlanMetaSection from "./components/PlanMetaSection.jsx";
import PlanDaysSection from "./components/PlanDaysSection.jsx";
import {getPlanById, savePlan} from "../../../api/app/diet.js";

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

export async function action( {request} ) {
    const formData = await request.formData()
    const data = JSON.parse(formData.get("planState"))

    try {
        return await savePlan(data)
    } catch (err) {
        return {error: err.message}
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
                days={planState.days}
                planDispatch={planDispatch}
                patient={patient}
            />
        </div>
    )
}