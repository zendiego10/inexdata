// ==========================================================
// INEXDATA - Gráficas y resumen estadístico
// Este archivo se encarga de:
// 1. Crear y actualizar las gráficas del país seleccionado
// 2. Generar el resumen automático del desempeño
// ==========================================================

// ----------------------------------------------------------
// Variables globales para guardar las instancias de Chart.js
// Esto evita que se creen gráficos duplicados al cambiar país
// ----------------------------------------------------------
let scoreChartInstance = null;
let rankChartInstance = null;
let compareChartInstance = null;
let globalCompareChartInstance = null;

// ----------------------------------------------------------
// Función para obtener los años de un país
// ----------------------------------------------------------
function getCountryYears(countryCode) {
    return getCountryData(countryCode).map(record => record.year);
}

// ----------------------------------------------------------
// Función para obtener los índices de innovación de un país
// ----------------------------------------------------------
function getCountryScores(countryCode) {
    return getCountryData(countryCode).map(record => record.score);
}

// ----------------------------------------------------------
// Función para obtener los rankings de un país
// ----------------------------------------------------------
function getCountryRanks(countryCode) {
    return getCountryData(countryCode).map(record => record.rank);
}

// ----------------------------------------------------------
// Función para crear o actualizar el gráfico de línea del índice
// ----------------------------------------------------------
function renderScoreChart(countryCode) {
    const labels = getCountryYears(countryCode);
    const data = getCountryScores(countryCode);

    const ctx = document.getElementById("scoreChart").getContext("2d");

    // Destruimos el gráfico anterior si ya existe
    if (scoreChartInstance) {
        scoreChartInstance.destroy();
    }

    // Creamos el nuevo gráfico
    scoreChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Índice de innovación",
                data: data,
                borderColor: "#3695E0",
                backgroundColor: "rgba(54, 149, 224, 0.15)",
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// ----------------------------------------------------------
// Función para crear o actualizar el gráfico de barras del ranking
// ----------------------------------------------------------
function renderRankChart(countryCode) {
    const labels = getCountryYears(countryCode);
    const data = getCountryRanks(countryCode);

    const ctx = document.getElementById("rankChart").getContext("2d");

    // Destruimos el gráfico anterior si ya existe
    if (rankChartInstance) {
        rankChartInstance.destroy();
    }

    // Creamos el nuevo gráfico
    rankChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Ranking global",
                data: data,
                backgroundColor: "rgba(54, 149, 224, 0.75)",
                borderColor: "#3695E0",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    reverse: true
                }
            }
        }
    });
}

// ----------------------------------------------------------
// Función para renderizar un gráfico comparativo simple
// En esta fase comparamos el país principal contra el país A
// del comparador si existe; si no, usamos Argentina por defecto
// ----------------------------------------------------------
function renderCompareChart(countryCode, compareCountryCode = "ARG") {
    const countryMeta = getCountryMeta(countryCode);
    const compareMeta = getCountryMeta(compareCountryCode);

    const countryYears = getCountryYears(countryCode);
    const countryScores = getCountryScores(countryCode);
    const compareScores = getCountryScores(compareCountryCode);

    const ctx = document.getElementById("compareChart").getContext("2d");

    if (compareChartInstance) {
        compareChartInstance.destroy();
    }

    compareChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: countryYears,
            datasets: [
                {
                    label: countryMeta.name,
                    data: countryScores,
                    borderColor: "#3695E0",
                    backgroundColor: "rgba(54, 149, 224, 0.12)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.3
                },
                {
                    label: compareMeta.name,
                    data: compareScores,
                    borderColor: "#1c1c1c",
                    backgroundColor: "rgba(28, 28, 28, 0.10)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ----------------------------------------------------------
// Función para calcular el resumen del desempeño de un país
// ----------------------------------------------------------
function calculateCountrySummary(countryCode) {
    const data = getCountryData(countryCode);

    // Si no hay datos, devolvemos valores vacíos
    if (!data.length) {
        return {
            bestYear: "--",
            worstYear: "--",
            averageScore: "--",
            totalVariation: "--"
        };
    }

    // Encontramos el mejor año según el mayor score
    const bestRecord = data.reduce((best, current) =>
        current.score > best.score ? current : best
    );

    // Encontramos el peor año según el menor score
    const worstRecord = data.reduce((worst, current) =>
        current.score < worst.score ? current : worst
    );

    // Calculamos el promedio del índice
    const averageScore = data.reduce((sum, record) => sum + record.score, 0) / data.length;

    // Calculamos la variación total del índice entre el primer y último año
    const firstScore = data[0].score;
    const lastScore = data[data.length - 1].score;
    const totalVariation = lastScore - firstScore;

    return {
        bestYear: bestRecord.year,
        worstYear: worstRecord.year,
        averageScore: averageScore.toFixed(2),
        totalVariation: `${totalVariation >= 0 ? "+" : ""}${totalVariation.toFixed(2)}`
    };
}

// ----------------------------------------------------------
// Función para mostrar el resumen del desempeño en la interfaz
// ----------------------------------------------------------
function renderCountrySummaryStats(countryCode) {
    const summary = calculateCountrySummary(countryCode);

    document.getElementById("best-year").textContent = summary.bestYear;
    document.getElementById("worst-year").textContent = summary.worstYear;
    document.getElementById("average-score").textContent = summary.averageScore;
    document.getElementById("total-variation").textContent = summary.totalVariation;
}

// ----------------------------------------------------------
// Función general para renderizar todas las visualizaciones
// de un país seleccionado
// ----------------------------------------------------------
function renderAllCountryCharts(countryCode) {
    const compareSelectB = document.getElementById("compare-country-b");
    const compareCountryCode = compareSelectB ? compareSelectB.value : "ARG";

    renderScoreChart(countryCode);
    renderRankChart(countryCode);
    renderCompareChart(countryCode, compareCountryCode);
    renderCountrySummaryStats(countryCode);
}