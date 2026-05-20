import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN_X = 50
const MARGIN_TOP = 50
const MARGIN_BOTTOM = 50
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2

function round2(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

function formatNumber(value) {
    return round2(value).toFixed(2)
}

function getProductMacros(product) {
    const multiplier = Number(product.quantity || 0) / 100

    return {
        carbs: round2((Number(product.carbs) || 0) * multiplier),
        energy: round2((Number(product.energy) || 0) * multiplier),
        fats: round2((Number(product.fats) || 0) * multiplier),
        protein: round2((Number(product.protein) || 0) * multiplier),
    }
}

function getMealSummary(meal) {
    const totals = {
        carbs: 0,
        energy: 0,
        fats: 0,
        protein: 0,
    }

    for (const product of meal.meal_products || []) {
        const macros = getProductMacros(product)
        totals.carbs += macros.carbs
        totals.energy += macros.energy
        totals.fats += macros.fats
        totals.protein += macros.protein
    }

    return {
        carbs: round2(totals.carbs),
        energy: round2(totals.energy),
        fats: round2(totals.fats),
        protein: round2(totals.protein),
    }
}

function getDaySummary(day) {
    const totals = {
        carbs: 0,
        energy: 0,
        fats: 0,
        protein: 0,
    }

    for (const meal of day.meals || []) {
        const mealSummary = getMealSummary(meal)
        totals.carbs += mealSummary.carbs
        totals.energy += mealSummary.energy
        totals.fats += mealSummary.fats
        totals.protein += mealSummary.protein
    }

    return {
        carbs: round2(totals.carbs),
        energy: round2(totals.energy),
        fats: round2(totals.fats),
        protein: round2(totals.protein),
    }
}

function wrapText(text, font, size, maxWidth) {
    if (!text) return []

    const words = String(text).split(/\s+/)
    const lines = []
    let currentLine = words[0] || ""

    for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const testLine = `${currentLine} ${word}`
        const testWidth = font.widthOfTextAtSize(testLine, size)

        if (testWidth <= maxWidth) {
            currentLine = testLine
        } else {
            lines.push(currentLine)
            currentLine = word
        }
    }

    if (currentLine) {
        lines.push(currentLine)
    }

    return lines
}

export async function getPDFFromPlan(plan) {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)

    const regularFontPath = path.join(__dirname, "../assets/fonts/Inter_18pt-Regular.ttf")
    const boldFontPath = path.join(__dirname, "../assets/fonts/Inter_18pt-Bold.ttf")

    console.log("regularFontPath:", regularFontPath)
    console.log("boldFontPath:", boldFontPath)

    const regularFontBytes = await fs.readFile(regularFontPath)
    const boldFontBytes = await fs.readFile(boldFontPath)

    const regularFont = await pdfDoc.embedFont(regularFontBytes)
    const boldFont = await pdfDoc.embedFont(boldFontBytes)

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    let y = PAGE_HEIGHT - MARGIN_TOP

    const lineHeights = {
        title: 24,
        h1: 20,
        h2: 18,
        h3: 16,
        text: 13,
        small: 11,
    }

    const fontSizes = {
        title: 18,
        h1: 15,
        h2: 13,
        h3: 12,
        text: 10,
        small: 9,
    }

    function addPage() {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = PAGE_HEIGHT - MARGIN_TOP
    }

    function ensureSpace(requiredHeight = 20) {
        if (y - requiredHeight < MARGIN_BOTTOM) {
            addPage()
        }
    }

    function drawLine({
                          text,
                          x = MARGIN_X,
                          size = fontSizes.text,
                          font = regularFont,
                          color = rgb(0, 0, 0),
                          lineHeight = lineHeights.text,
                      }) {
        ensureSpace(lineHeight)
        page.drawText(String(text), { x, y, size, font, color })
        y -= lineHeight
    }

    function drawWrapped({
                             text,
                             x = MARGIN_X,
                             size = fontSizes.text,
                             font = regularFont,
                             color = rgb(0, 0, 0),
                             maxWidth = CONTENT_WIDTH,
                             lineHeight = lineHeights.text,
                         }) {
        const lines = wrapText(String(text), font, size, maxWidth)
        for (const line of lines) {
            ensureSpace(lineHeight)
            page.drawText(line, { x, y, size, font, color })
            y -= lineHeight
        }
    }

    function drawDivider(spaceBefore = 6, spaceAfter = 10) {
        y -= spaceBefore
        ensureSpace(10)
        page.drawLine({
            start: { x: MARGIN_X, y },
            end: { x: PAGE_WIDTH - MARGIN_X, y },
            thickness: 0.8,
            color: rgb(0.8, 0.8, 0.8),
        })
        y -= spaceAfter
    }

    drawWrapped({
        text: plan.title || "Plan żywieniowy",
        x: MARGIN_X,
        size: fontSizes.title,
        font: boldFont,
        lineHeight: lineHeights.title,
    })

    drawLine({
        text: `Liczba dni: ${plan.days?.length || 0}`,
        size: fontSizes.text,
        font: regularFont,
    })

    drawDivider(8, 12)

    for (const day of plan.days || []) {
        const daySummary = getDaySummary(day)

        drawLine({
            text: `Dzień ${day.day_number}`,
            size: fontSizes.h1,
            font: boldFont,
            lineHeight: lineHeights.h1,
        })

        y -= 4

        for (const meal of day.meals || []) {
            const mealSummary = getMealSummary(meal)

            drawLine({
                text: `${meal.order_number}. ${meal.name}`,
                x: MARGIN_X + 10,
                size: fontSizes.h2,
                font: boldFont,
                lineHeight: lineHeights.h2,
            })

            if (meal.notes) {
                drawWrapped({
                    text: `Notatka: ${meal.notes}`,
                    x: MARGIN_X + 20,
                    size: fontSizes.text,
                    font: regularFont,
                    maxWidth: CONTENT_WIDTH - 20,
                    lineHeight: lineHeights.text,
                })
            }

            drawLine({
                text: "Produkty:",
                x: MARGIN_X + 20,
                size: fontSizes.h3,
                font: boldFont,
                lineHeight: lineHeights.h3,
            })

            for (const product of meal.meal_products || []) {
                const macros = getProductMacros(product)

                drawWrapped({
                    text: `• ${product.name} - ${product.quantity}${product.unit}`,
                    x: MARGIN_X + 30,
                    size: fontSizes.text,
                    font: regularFont,
                    maxWidth: CONTENT_WIDTH - 30,
                    lineHeight: lineHeights.text,
                })

                drawLine({
                    text: `B: ${formatNumber(macros.protein)} g | T: ${formatNumber(macros.fats)} g | W: ${formatNumber(macros.carbs)} g | kcal: ${formatNumber(macros.energy)}`,
                    x: MARGIN_X + 35,
                    size: fontSizes.small,
                    font: regularFont,
                    color: rgb(0.25, 0.25, 0.25),
                    lineHeight: lineHeights.small,
                })
            }

            y -= 2

            drawLine({
                text: `Suma posiłku -> B: ${formatNumber(mealSummary.protein)} g | T: ${formatNumber(mealSummary.fats)} g | W: ${formatNumber(mealSummary.carbs)} g | kcal: ${formatNumber(mealSummary.energy)}`,
                x: MARGIN_X + 20,
                size: fontSizes.text,
                font: boldFont,
                lineHeight: lineHeights.text,
            })

            y -= 8
        }

        drawLine({
            text: `Suma dnia -> B: ${formatNumber(daySummary.protein)} g | T: ${formatNumber(daySummary.fats)} g | W: ${formatNumber(daySummary.carbs)} g | kcal: ${formatNumber(daySummary.energy)}`,
            x: MARGIN_X,
            size: fontSizes.h2,
            font: boldFont,
            lineHeight: lineHeights.h2,
        })

        drawDivider(8, 14)
    }

    return await pdfDoc.save()
}