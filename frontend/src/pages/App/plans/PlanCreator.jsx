//PlanCreator

import React, { useReducer, useEffect } from "react"
import {useLoaderData, Form} from "react-router-dom";

import styles from "./styles/Plans.module.css"
import {getPatients} from "../../../api/app/patients.js";
import {planReducer, initPlanState} from "./planReducer.js";
import PlanSidebar from "./components/PlanSidebar.jsx";
import PlanMetaSection from "./components/PlanMetaSection.jsx";
import PlanDaysSection from "./components/PlanDaysSection.jsx";

export async function loader(){
    try {
        return await getPatients()
    } catch (error) {
        throw new Error(error.message);
    }

}

export async function action( {request} ) {
    const formData = await request.formData()
    const data = JSON.parse(formData.get("planState"))

    console.log(data)
}



export default function PlanCreator() {
    const loaderData = useLoaderData()

    const [planState, planDispatch] = useReducer(planReducer,  {
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
        localStorage.setItem("planData", JSON.stringify(planState));
    }, [planState]);

    function clearPlan() {
        planDispatch({type: 'setDefault'})
        localStorage.clear();
    }

    const patients = loaderData?.patients || []

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
                />
                <input name="planState" defaultValue={JSON.stringify(planState)} hidden/>
            </Form>
            <PlanSidebar
                clearPlan={clearPlan}
            />
        </div>
    )
}