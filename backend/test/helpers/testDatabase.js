const expectedMarker = "dietetyk-system-integration-tests"
const expectedUser = "test_user"

export async function assertTestDatabaseSafety(queryable, env = process.env) {
    if (env.NODE_ENV !== "test" || env.ALLOW_TEST_DB_RESET !== "true") {
        throw new Error(
            "Odmowa resetu bazy: wymagane są NODE_ENV=test i ALLOW_TEST_DB_RESET=true"
        )
    }

    const identity = await queryable.query(
        "SELECT current_database() AS database_name, current_user AS user_name"
    )
    const {database_name, user_name} = identity.rows[0] ?? {}

    if (user_name !== expectedUser) {
        throw new Error(
            `Odmowa resetu bazy: połączono jako ${user_name ?? "nieznany użytkownik"}, oczekiwano ${expectedUser}`
        )
    }

    const marker = await queryable.query(
        "SELECT marker FROM test_environment_marker WHERE marker = $1",
        [expectedMarker]
    )

    if (marker.rowCount !== 1) {
        throw new Error(
            `Odmowa resetu bazy ${database_name ?? "nieznana baza"}: brak markera środowiska testowego`
        )
    }
}

export async function resetIntegrationDatabase(queryable, env = process.env) {
    await assertTestDatabaseSafety(queryable, env)

    await queryable.query(
        "TRUNCATE users, dieticians, patients, patient_progress, diet_plans, " +
        "diet_days, patient_diet_plan, meals, meal_products, dietician_notes " +
        "RESTART IDENTITY CASCADE"
    )
}
