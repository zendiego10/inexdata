// ==========================================================
// INEXDATA - Comparador de países
// Este archivo se encarga de:
// 1. Renderizar las tarjetas del país A y país B
// 2. Crear el gráfico comparativo inferior
// 3. Actualizar la comparación cuando el usuario lo solicite
// ==========================================================

// ----------------------------------------------------------
// Función para renderizar la tarjeta resumen de un país
// dentro de la sección de comparación
// ----------------------------------------------------------
function renderCompareCountryCard(countryCode, suffix) {
    // Obtenemos metadatos y último registro del país
    const meta = getCountryMeta(countryCode);
    const latestRecord = getLatestCountryRecord(countryCode);

    // Referencias a elementos del HTML
    const flagElement = document.getElementById(`compare-flag-${suffix}`);
    const nameElement = document.getElementById(`compare-name-${suffix}`);
    const continentElement = document.getElementById(`compare-continent-${suffix}`);
    const scoreElement = document.getElementById(`compare-score-${suffix}`);
    const rankElement = document.getElementById(`compare-rank-${suffix}`);

    // Insertamos la información general
    flagElement.innerHTML = `<img src="${meta.flag}" alt="Bandera de ${meta.name}" class="flag-img">`;
    nameElement.textContent = meta.name;
    continentElement.textContent = meta.continent;

    // Insertamos el último registro disponible
    if (latestRecord) {
        scoreElement.textContent = latestRecord.score.toFixed(2);
        rankElement.textContent = latestRecord.rank;
    } else {
        scoreElement.textContent = "--";
        rankElement.textContent = "--";
    }
}

// ----------------------------------------------------------
// Función para obtener los años comunes entre dos países
// Esto evita problemas si un país tiene menos registros
// ----------------------------------------------------------
function getSharedYears(countryCodeA, countryCodeB) {
    const yearsA = getCountryYears(countryCodeA);
    const yearsB = getCountryYears(countryCodeB);

    return yearsA.filter(year => yearsB.includes(year));
}

// ----------------------------------------------------------
// Función para obtener los scores alineados por años comunes
// ----------------------------------------------------------
function getSharedScores(countryCode, sharedYears) {
    const data = getCountryData(countryCode);

    return sharedYears.map(year => {
        const record = data.find(item => item.year === year);
        return record ? record.score : null;
    });
}

// ----------------------------------------------------------
// Función para crear o actualizar el gráfico comparativo inferior
// ----------------------------------------------------------
function renderGlobalComparisonChart(countryCodeA, countryCodeB) {
    const metaA = getCountryMeta(countryCodeA);
    const metaB = getCountryMeta(countryCodeB);

    const sharedYears = getSharedYears(countryCodeA, countryCodeB);
    const scoresA = getSharedScores(countryCodeA, sharedYears);
    const scoresB = getSharedScores(countryCodeB, sharedYears);

    const ctx = document.getElementById("globalCompareChart").getContext("2d");

    // Destruimos el gráfico anterior si ya existe
    if (globalCompareChartInstance) {
        globalCompareChartInstance.destroy();
    }

    // Creamos el nuevo gráfico
    globalCompareChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: sharedYears,
            datasets: [
                {
                    label: metaA.name,
                    data: scoresA,
                    borderColor: "#3695E0",
                    backgroundColor: "rgba(54, 149, 224, 0.10)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4
                },
                {
                    label: metaB.name,
                    data: scoresB,
                    borderColor: "#1c1c1c",
                    backgroundColor: "rgba(28, 28, 28, 0.10)",
                    borderWidth: 3,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// ----------------------------------------------------------
// Función principal para renderizar toda la sección
// de comparación entre dos países
// ----------------------------------------------------------
function renderComparisonSection(countryCodeA, countryCodeB) {
    renderCompareCountryCard(countryCodeA, "a");
    renderCompareCountryCard(countryCodeB, "b");
    renderGlobalComparisonChart(countryCodeA, countryCodeB);
}

// ----------------------------------------------------------
// Función para configurar el botón de comparación
// ----------------------------------------------------------
function setupComparisonEvents() {
    const compareButton = document.getElementById("compare-btn");
    const compareSelectA = document.getElementById("compare-country-a");
    const compareSelectB = document.getElementById("compare-country-b");

    compareButton.addEventListener("click", () => {
        const countryCodeA = compareSelectA.value;
        const countryCodeB = compareSelectB.value;

        renderComparisonSection(countryCodeA, countryCodeB);

        // También actualizamos el gráfico comparativo
        // de la sección principal de exploración
        const mainSelect = document.getElementById("country-select-main");
        renderCompareChart(mainSelect.value, countryCodeA);
    });
}