import {
    FoodDataCentralError,
    normalizeFoodDataCentralFood,
    requestFoodDataCentral
} from "../services/foodDataCentralService.js";

const SEARCH_FIELDS = [
    "query",
    "dataType",
    "pageSize",
    "pageNumber",
    "sortBy",
    "sortOrder",
    "brandOwner"
];

function handleFoodDataCentralError(err, res) {
    if (err instanceof FoodDataCentralError) {
        return res.status(err.status).json({
            message: err.message,
            ...(err.details && { details: err.details })
        });
    }

    console.error("Błąd podczas obsługi Food Data Central API", err);
    return res.status(500).json({ message: "Błąd serwera" });
}

export async function searchFoods(req, res) {
    const query = req.body?.query?.trim();

    if (!query) {
        return res.status(400).json({ message: "Brak zapytania wyszukiwania" });
    }

    const searchParams = Object.fromEntries(
        SEARCH_FIELDS
            .filter(field => req.body[field] !== undefined)
            .map(field => [field, req.body[field]])
    );
    searchParams.query = query;

    try {
        const data = await requestFoodDataCentral("/foods/search", {
            method: "POST",
            body: searchParams
        });

        return res.status(200).json({
            products: (data.foods ?? []).map(normalizeFoodDataCentralFood),
            totalHits: data.totalHits ?? 0,
            currentPage: data.currentPage ?? searchParams.pageNumber ?? 1,
            totalPages: data.totalPages ?? 0
        });
    } catch (err) {
        return handleFoodDataCentralError(err, res);
    }
}

export async function getFoodById(req, res) {
    const fdcId = Number(req.params.fdcId);

    if (!Number.isInteger(fdcId) || fdcId <= 0) {
        return res.status(400).json({ message: "Nieprawidłowy identyfikator fdcId" });
    }

    const query = {
        format: req.query.format,
        nutrients: req.query.nutrients
    };

    try {
        const data = await requestFoodDataCentral(`/food/${fdcId}`, { query });
        return res.status(200).json(normalizeFoodDataCentralFood(data));
    } catch (err) {
        return handleFoodDataCentralError(err, res);
    }
}
