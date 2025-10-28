//PlanCreator

import React from "react"
import { requireAuth } from "../../../api/utils.js";

export async function loader( { request }){
    await requireAuth(request)
    return null
}

export default function PlanCreator() {

    return (
        <>
            <h1>PlanCreator</h1>
        </>
    )
}