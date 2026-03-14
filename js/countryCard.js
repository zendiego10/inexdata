// ==========================================================
// INEXDATA - Módulo de país
// Este archivo se encarga de:
// 1. Renderizar el resumen general del país
// 2. Renderizar la tabla histórica
// ==========================================================

// ----------------------------------------------------------
// Función para renderizar el resumen del país seleccionado
// ----------------------------------------------------------
function renderCountrySummary(countryCode) {
    // Obtenemos los metadatos del país
    const meta = getCountryMeta(countryCode);

    // Obtenemos el último registro del país
    const latestRecord = getLatestCountryRecord(countryCode);

    // Referencias a los elementos del HTML
    const countryFlag = document.getElementById("country-flag");
    const countryName = document.getElementById("country-name");
    const countryContinent = document.getElementById("country-continent");
    const currentScore = document.getElementById("current-score");
    const currentRank = document.getElementById("current-rank");
    const currentYear = document.getElementById("current-year");

    // Insertamos los metadatos del país
    countryFlag.innerHTML = `<img src="${meta.flag}" alt="Bandera de ${meta.name}" class="flag-img">`;
    countryName.textContent = meta.name;
    countryContinent.textContent = meta.continent;

    // Si existe un último registro válido, lo mostramos
    if (latestRecord) {
        currentScore.textContent = latestRecord.score.toFixed(2);
        currentRank.textContent = latestRecord.rank;
        currentYear.textContent = latestRecord.year;
    } else {
        currentScore.textContent = "--";
        currentRank.textContent = "--";
        currentYear.textContent = "--";
    }
}

// ----------------------------------------------------------
// Función para renderizar la tabla histórica del país
// ----------------------------------------------------------
function renderCountryTable(countryCode) {
    // Obtenemos el historial del país
    const countryData = getCountryData(countryCode);

    // Referencia al cuerpo de la tabla
    const tableBody = document.querySelector("#country-data-table tbody");

    // Limpiamos la tabla antes de volver a llenarla
    tableBody.innerHTML = "";

    // Recorremos cada registro del país
    countryData.forEach(record => {
        // Creamos una fila nueva
        const row = document.createElement("tr");

        // Insertamos las columnas
        row.innerHTML = `
            <td>${record.year}</td>
            <td>${record.score.toFixed(2)}</td>
            <td>${record.rank}</td>
        `;

        // Añadimos la fila a la tabla
        tableBody.appendChild(row);
    });
}