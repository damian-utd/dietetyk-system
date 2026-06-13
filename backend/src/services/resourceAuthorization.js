const resourceQueries = {
    patient: `
        SELECT p.id, p.dietician_id
        FROM patients p
        JOIN dieticians d ON p.dietician_id = d.id
        WHERE p.id = $1 AND d.user_id = $2
    `,
    plan: `
        SELECT dp.id, dp.dietician_id
        FROM diet_plans dp
        JOIN dieticians d ON dp.dietician_id = d.id
        WHERE dp.id = $1 AND d.user_id = $2
    `,
    note: `
        SELECT dn.id, dn.dietician_id, dn.patient_id
        FROM dietician_notes dn
        JOIN dieticians d ON dn.dietician_id = d.id
        WHERE dn.id = $1 AND d.user_id = $2
    `,
    progress: `
        SELECT pp.id, pp.patient_id, p.dietician_id
        FROM patient_progress pp
        JOIN patients p ON pp.patient_id = p.id
        JOIN dieticians d ON p.dietician_id = d.id
        WHERE pp.id = $1 AND d.user_id = $2
    `
}

function createAuthorizationError(message, status = 404) {
    const error = new Error(message)
    error.status = status
    return error
}

export async function getDieticianIdForUser(queryable, userId) {
    const result = await queryable.query(
        "SELECT id FROM dieticians WHERE user_id = $1",
        [userId]
    )

    const dieticianId = result.rows[0]?.id
    if (!dieticianId) {
        throw createAuthorizationError("Brak dietetyka przypisanego do konta użytkownika")
    }

    return dieticianId
}

export async function requireResourceOwnership(queryable, userId, resourceType, resourceId) {
    const query = resourceQueries[resourceType]
    if (!query) {
        throw createAuthorizationError("Nieobsługiwany typ zasobu", 500)
    }

    const result = await queryable.query(query, [resourceId, userId])
    const resource = result.rows[0]

    if (!resource) {
        throw createAuthorizationError("Nie znaleziono zasobu lub brak uprawnień")
    }

    return resource
}
