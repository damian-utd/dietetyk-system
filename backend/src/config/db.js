import pg from "pg";
import { localNow } from "../utils/time.js";

const { Pool } = pg;

const appDb = new Pool({
    connectionString: process.env.APP_DATABASE_URL
});

const productsDb = new Pool({
    connectionString: process.env.PRODUCTS_DATABASE_URL
});

(async () => {
    try {
        console.log(`✅ Połączono z bazą aplikacji: ${localNow()}`);
    } catch (err) {
        console.error("❌ Błąd połączenia z bazą aplikacji:", err.message);
    }
})();

(async () => {
    try {
        console.log(`✅ Połączono z bazą produktów: ${localNow()}`);
    } catch (err) {
        console.error("❌ Błąd połączenia z bazą produktów:", err.message);
    }
})();

export {appDb, productsDb};
