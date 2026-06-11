const FOOD_DATA_CENTRAL_API_URL = "/api/food-data-central";

export async function searchFoodDataCentral(query, options = {}) {
    const res = await fetch(`${FOOD_DATA_CENTRAL_API_URL}/foods/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...options, query }),
        credentials: "include"
    });

    return handleResponse(res);
}

export async function getFoodDataCentralById(fdcId, options = {}) {
    const params = new URLSearchParams();

    if (options.format) {
        params.set("format", options.format);
    }

    if (options.nutrients?.length) {
        params.set("nutrients", options.nutrients.join(","));
    }

    const queryString = params.toString();
    const url = `${FOOD_DATA_CENTRAL_API_URL}/food/${fdcId}${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
        credentials: "include"
    });

    return handleResponse(res);
}

async function handleResponse(res) {
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message);
    }

    return data;
}
