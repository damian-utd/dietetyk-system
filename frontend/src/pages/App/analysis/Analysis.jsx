//Analysis

import React from "react"
import { requireAuth } from "../../../api/utils.js";

export async function loader( { request }){
    await requireAuth(request)
    return null
}

export default function Analysis() {

    return (
        <>
            <h1>Analysis</h1>
        </>
    )
}