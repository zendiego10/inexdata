// ==========================================================
// INEXDATA - Script principal
// Este archivo:
// 1. Inicializa AOS
// 2. Carga los datos
// 3. Llena los selectores de países
// 4. Renderiza el país inicial
// ==========================================================

// ----------------------------------------------------------
// Inicializamos la librería AOS para animaciones al scroll
// ----------------------------------------------------------
AOS.init({
    duration: 900,
    once: true
});

// ----------------------------------------------------------
// Función para llenar un select con la lista de países
// ----------------------------------------------------------
function populateCountrySelect(selectElement, selectedCode = "COL") {
    // Limpiamos el contenido actual del select
    selectElement.innerHTML = "";

    // Obtenemos los códigos de países y los ordenamos por nombre
    const sortedCountries = getCountryCodes()
        .map(code => ({
            code,
            name: getCountryMeta(code).name
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "es"));

    // Creamos las opciones del select
    sortedCountries.forEach(country => {
        const option = document.createElement("option");
        option.value = country.code;
        option.textContent = country.name;

        // Marcamos el país seleccionado por defecto
        if (country.code === selectedCode) {
            option.selected = true;
        }

        selectElement.appendChild(option);
    });
}

// ----------------------------------------------------------
// Función para llenar todos los selects del proyecto
// ----------------------------------------------------------
function populateAllCountrySelects() {
    const heroSelect = document.getElementById("country-select-hero");
    const mainSelect = document.getElementById("country-select-main");
    const compareSelectA = document.getElementById("compare-country-a");
    const compareSelectB = document.getElementById("compare-country-b");

    populateCountrySelect(heroSelect, "COL");
    populateCountrySelect(mainSelect, "COL");
    populateCountrySelect(compareSelectA, "COL");
    populateCountrySelect(compareSelectB, "ARG");
}

// ----------------------------------------------------------
// Función para sincronizar el selector del hero con el principal
// ----------------------------------------------------------
function syncHeroWithMainSelector() {
    const heroSelect = document.getElementById("country-select-hero");
    const mainSelect = document.getElementById("country-select-main");

    heroSelect.addEventListener("change", () => {
        mainSelect.value = heroSelect.value;
        updateCountryView(heroSelect.value);
    });
}

// ----------------------------------------------------------
// Función para actualizar la vista principal de un país
// ----------------------------------------------------------
function updateCountryView(countryCode) {
    renderCountrySummary(countryCode);
    renderCountryTable(countryCode);
    renderAllCountryCharts(countryCode);
    renderCountryConclusions(countryCode);

    // Sincronizamos el selector del hero con el principal
    const heroSelect = document.getElementById("country-select-hero");
    heroSelect.value = countryCode;
}

// ----------------------------------------------------------
// Evento principal cuando carga el documento
// ----------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    // Cargamos los datos
    const dataLoaded = await loadAllData();

    // Si los datos no cargan, detenemos la inicialización
    if (!dataLoaded) {
        alert("No se pudieron cargar los datos del proyecto.");
        return;
    }

    // Llenamos todos los selects
    populateAllCountrySelects();

    // Sincronizamos el selector del hero
    syncHeroWithMainSelector();

    // Referencia al selector principal
    const mainSelect = document.getElementById("country-select-main");

    // Render inicial con Colombia
    updateCountryView("COL");

    // Render inicial de la comparación
    renderComparisonSection("COL", "ARG");

    // Configuramos eventos de comparación
    setupComparisonEvents();

    // Cuando cambie el país principal, actualizamos la vista
    mainSelect.addEventListener("change", () => {
        updateCountryView(mainSelect.value);
    });

    // Lógica para toggle de menú móvil
    const menuToggle = document.getElementById("menu-toggle");
    const navLinksList = document.getElementById("nav-links");
    if (menuToggle && navLinksList) {
        menuToggle.addEventListener("click", () => {
            navLinksList.classList.toggle("active");
        });
        navLinksList.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinksList.classList.remove("active");
            });
        });
    }
});