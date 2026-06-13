import assert from "node:assert/strict"
import test from "node:test"
import { assertTestDatabaseSafety } from "../helpers/testDatabase.js"

const validEnv = {
    NODE_ENV: "test",
    ALLOW_TEST_DB_RESET: "true"
}

function testDatabase({user = "test_user", hasMarker = true} = {}) {
    return {
        async query(query) {
            if (query.includes("current_database()")) {
                return {
                    rows: [{database_name: "dietetyk_app", user_name: user}],
                    rowCount: 1
                }
            }

            if (query.includes("test_environment_marker")) {
                return {
                    rows: hasMarker ? [{marker: "dietetyk-system-integration-tests"}] : [],
                    rowCount: hasMarker ? 1 : 0
                }
            }

            throw new Error("Nieoczekiwane zapytanie")
        }
    }
}

test("accepts an explicitly enabled marked test database", async () => {
    await assert.doesNotReject(
        assertTestDatabaseSafety(testDatabase(), validEnv)
    )
})

test("rejects reset without explicit environment flags", async () => {
    await assert.rejects(
        assertTestDatabaseSafety(testDatabase(), {NODE_ENV: "development"}),
        /Odmowa resetu bazy/
    )
})

test("rejects a database connected with a non-test user", async () => {
    await assert.rejects(
        assertTestDatabaseSafety(testDatabase({user: "app_user"}), validEnv),
        /oczekiwano test_user/
    )
})

test("rejects a database without the test environment marker", async () => {
    await assert.rejects(
        assertTestDatabaseSafety(testDatabase({hasMarker: false}), validEnv),
        /brak markera środowiska testowego/
    )
})
