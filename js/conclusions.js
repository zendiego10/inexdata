// ==========================================================
// INEXDATA - Conclusiones automáticas
// Este archivo se encarga de:
// 1. Analizar los datos del país seleccionado
// 2. Generar 5 conclusiones automáticas
// 3. Mostrarlas en la interfaz
// ==========================================================

// ----------------------------------------------------------
// Función para determinar la tendencia general del índice
// ----------------------------------------------------------
function getTrendConclusion(countryCode) {
    const data = getCountryData(countryCode);

    // Si no hay suficientes datos, devolvemos una conclusión genérica
    if (data.length < 2) {
        return "No hay suficientes datos para determinar una tendencia general.";
    }

    const firstScore = data[0].score;
    const lastScore = data[data.length - 1].score;
    const difference = lastScore - firstScore;

    if (difference > 1) {
        return `El país presenta una tendencia general creciente en su índice de innovación, con una variación de ${difference.toFixed(2)} puntos entre ${data[0].year} y ${data[data.length - 1].year}.`;
    }

    if (difference < -1) {
        return `El país presenta una tendencia general decreciente en su índice de innovación, con una variación de ${difference.toFixed(2)} puntos entre ${data[0].year} y ${data[data.length - 1].year}.`;
    }

    return `El país presenta un comportamiento relativamente estable en su índice de innovación entre ${data[0].year} y ${data[data.length - 1].year}.`;
}

// ----------------------------------------------------------
// Función para obtener la conclusión del mejor año
// ----------------------------------------------------------
function getBestYearConclusion(countryCode) {
    const data = getCountryData(countryCode);

    if (!data.length) {
        return "No hay datos suficientes para identificar el mejor año.";
    }

    const bestRecord = data.reduce((best, current) =>
        current.score > best.score ? current : best
    );

    return `El mejor desempeño del país se registró en ${bestRecord.year}, cuando alcanzó un índice de ${bestRecord.score.toFixed(2)} y un ranking de ${bestRecord.rank}.`;
}

// ----------------------------------------------------------
// Función para obtener la conclusión del peor año
// ----------------------------------------------------------
function getWorstYearConclusion(countryCode) {
    const data = getCountryData(countryCode);

    if (!data.length) {
        return "No hay datos suficientes para identificar el peor año.";
    }

    const worstRecord = data.reduce((worst, current) =>
        current.score < worst.score ? current : worst
    );

    return `El peor desempeño del país se observó en ${worstRecord.year}, con un índice de ${worstRecord.score.toFixed(2)} y un ranking de ${worstRecord.rank}.`;
}

// ----------------------------------------------------------
// Función para analizar el cambio del ranking en el tiempo
// Recordatorio: un ranking menor significa mejor posición
// ----------------------------------------------------------
function getRankingChangeConclusion(countryCode) {
    const data = getCountryData(countryCode);

    if (data.length < 2) {
        return "No hay suficientes datos para comparar la evolución del ranking.";
    }

    const firstRank = data[0].rank;
    const lastRank = data[data.length - 1].rank;
    const difference = firstRank - lastRank;

    if (difference > 0) {
        return `En el período analizado, el país mejoró ${difference} posiciones en el ranking global de innovación.`;
    }

    if (difference < 0) {
        return `En el período analizado, el país empeoró ${Math.abs(difference)} posiciones en el ranking global de innovación.`;
    }

    return "En el período analizado, el país mantuvo la misma posición global en el ranking de innovación.";
}

// ----------------------------------------------------------
// Función para medir la estabilidad del desempeño del país
// Se calcula según el rango entre el score más alto y más bajo
// ----------------------------------------------------------
function getStabilityConclusion(countryCode) {
    const data = getCountryData(countryCode);

    if (data.length < 2) {
        return "No hay suficientes datos para analizar la estabilidad del desempeño.";
    }

    const scores = data.map(record => record.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const range = maxScore - minScore;

    if (range <= 3) {
        return `El comportamiento del país ha sido bastante estable, ya que la variación total de su índice ha sido de ${range.toFixed(2)} puntos.`;
    }

    if (range <= 8) {
        return `El país ha mostrado una variación moderada en su desempeño histórico, con una diferencia de ${range.toFixed(2)} puntos entre su mejor y peor índice.`;
    }

    return `El país ha mostrado cambios importantes en su desempeño, con una diferencia de ${range.toFixed(2)} puntos entre su mejor y peor índice histórico.`;
}

// ----------------------------------------------------------
// Función para generar el arreglo completo de conclusiones
// ----------------------------------------------------------
function generateCountryConclusions(countryCode) {
    return [
        getTrendConclusion(countryCode),
        getBestYearConclusion(countryCode),
        getWorstYearConclusion(countryCode),
        getRankingChangeConclusion(countryCode),
        getStabilityConclusion(countryCode)
    ];
}

// ----------------------------------------------------------
// Función para renderizar las 5 conclusiones en la interfaz
// ----------------------------------------------------------
function renderCountryConclusions(countryCode) {
    const conclusions = generateCountryConclusions(countryCode);
    const conclusionsContainer = document.getElementById("conclusions-list");

    // Limpiamos el contenido anterior
    conclusionsContainer.innerHTML = "";

    // Insertamos cada conclusión como un bloque independiente
    conclusions.forEach((conclusion, index) => {
        const item = document.createElement("div");
        item.className = "conclusion-item";
        item.textContent = `${index + 1}. ${conclusion}`;
        conclusionsContainer.appendChild(item);
    });
}