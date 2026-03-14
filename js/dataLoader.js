// ==========================================================
// INEXDATA - Carga de datos
// Este archivo se encarga de:
// 1. Cargar los archivos JSON
// 2. Guardarlos en memoria
// 3. Exponer funciones para consultarlos desde otros archivos
// ==========================================================

// ----------------------------------------------------------
// Variables globales para almacenar los datos cargados
// ----------------------------------------------------------
let innovationData = {};
let countriesMeta = {};

// ----------------------------------------------------------
// Función para cargar ambos archivos JSON
// ----------------------------------------------------------
async function loadAllData() {
    try {
        // Cargamos el histórico de innovación por país
        const innovationResponse = await fetch("data/innovation_data.json");
        innovationData = await innovationResponse.json();

        // Cargamos los metadatos de países
        const metaResponse = await fetch("data/countries_meta.json");
        countriesMeta = await metaResponse.json();

        console.log("Datos cargados correctamente");
        return true;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        return false;
    }
}

// ----------------------------------------------------------
// Función para obtener todos los códigos de países disponibles
// ----------------------------------------------------------
function getCountryCodes() {
    return Object.keys(innovationData);
}

// ----------------------------------------------------------
// Función para obtener el historial de un país por su código
// ----------------------------------------------------------
function getCountryData(countryCode) {
    return innovationData[countryCode] || [];
}

// ----------------------------------------------------------
// Función para obtener los metadatos de un país
// ----------------------------------------------------------
function getCountryMeta(countryCode) {
    return countriesMeta[countryCode] || {
        name: countryCode,
        continent: "Desconocido",
        flag: "🏳️"
    };
}

// ----------------------------------------------------------
// Función para obtener el último registro válido de un país
// Sirve para mostrar índice actual, ranking actual y año actual
// ----------------------------------------------------------
function getLatestCountryRecord(countryCode) {
    const countryData = getCountryData(countryCode);

    if (!countryData.length) {
        return null;
    }

    return countryData[countryData.length - 1];
}