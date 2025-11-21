//PlanCreator

import React, {useState} from "react"
import {useLoaderData, Form} from "react-router-dom";

import styles from "./Plans.module.css"
import {getPatients} from "../../../api/app/patients.js";
import Day from "./Day.jsx"

export async function loader( { request } ){
    // await requireAuth(request)

    try {
        return await getPatients()
    } catch (error) {
        throw new Error(error.message);
    }

}

export async function action( {request} ) {
    // const formData = await request.formData()
    // const data = Object.fromEntries(formData);

    // console.log(data)
}



export default function PlanCreator() {
    const loaderData = useLoaderData()

    const [planState, planDispatch] = useReducer(planReducer, {
        patient_id: null,
        title: "",
        description: "",
        days: [{
            day_number: 1,
            meals: []
        }],
        currentDayNumber: 1
    })

    const patients = loaderData?.patients || []

    return (
        <div className={styles.planCreatorBody}>
            <Form method="post" className={styles.main}>
                <PlanMetaSection
                    patients={patients}
                    planDispatch={planDispatch}
                />
                <PlanDaysSection
                    days={planState.days}
                    currentDayNumber={planState.currentDayNumber}
                    planDispatch={planDispatch}
                />
            </Form>
            <PlanSidebar />
        </div>
    )
}