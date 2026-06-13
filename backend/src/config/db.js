import pg from "pg";
import { localNow } from "../utils/time.js";

const { Pool } = pg;

const appDb = new Pool({
    connectionString: process.env.APP_DATABASE_URL
});

(async () => {
    try {
        await appDb.query("SELECT NOW()");
        console.log(`✅ Połączono z bazą aplikacji: ${localNow()}`);
    } catch (err) {
        console.error("❌ Błąd połączenia z bazą aplikacji:", err.message);
    }
})();


export {appDb};
