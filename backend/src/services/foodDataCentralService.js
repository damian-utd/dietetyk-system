const FOOD_DATA_CENTRAL_API_URL = "https://api.nal.usda.gov/fdc/v1";
const REQUEST_TIMEOUT_MS = 10000;

export class FoodDataCentralError extends Error {
    constructor(message, status = 502, details = null) {
        super(message);
        this.name = "FoodDataCentralError";
        this.status = status;
        this.details = details;
    }
}

export async function requestFoodDataCentral(path, options = {}) {
    const apiKey = process.env.USDA_API_KEY;

    if (!apiKey) {
        throw new FoodDataCentralError(
            "Brak konfiguracji klucza Food Data Central API",
            500
        );
    }

    const url = new URL(`${FOOD_DATA_CENTRAL_API_URL}${path}`);
    url.searchParams.set("api_key", apiKey);

    for (const [key, value] of Object.entries(options.query ?? {})) {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            method: options.method ?? "GET",
            headers: options.body ? { "Content-Type": "application/json" } : undefined,
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controller.signal
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new FoodDataCentralError(
                "Food Data Central API odrzuciło żądanie",
                response.status,
                data
            );
        }

        return data;
    } catch (err) {
        if (err instanceof FoodDataCentralError) {
            throw err;
        }

        if (err.name === "AbortError") {
            throw new FoodDataCentralError(
                "Przekroczono czas oczekiwania na Food Data Central API",
                504
            );
        }

        throw new FoodDataCentralError(
            "Nie udało się połączyć z Food Data Central API"
        );
    } finally {
        clearTimeout(timeout);
    }
}
