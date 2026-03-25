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
    const mainSelect = document.getElementById("country-select-main");
    const compareSelectA = document.getElementById("compare-country-a");
    const compareSelectB = document.getElementById("compare-country-b");

    if (mainSelect) populateCountrySelect(mainSelect, "COL");
    if (compareSelectA) populateCountrySelect(compareSelectA, "COL");
    if (compareSelectB) populateCountrySelect(compareSelectB, "ARG");
}

// ----------------------------------------------------------
// Función para inicializar el video de la portada
// ----------------------------------------------------------
function setupHeroVideo() {
    const video = document.getElementById("hero-video");
    const glassCard = document.getElementById("hero-glass-card");

    if (video && glassCard) {
        video.addEventListener("ended", () => {
            glassCard.classList.add("show");
        });
    }
}

// ----------------------------------------------------------
// Función para actualizar la vista principal de un país
// ----------------------------------------------------------
function updateCountryView(countryCode) {
    renderCountrySummary(countryCode);
    renderCountryTable(countryCode);
    renderAllCountryCharts(countryCode);
    renderCountryConclusions(countryCode);
}

// ----------------------------------------------------------
// Evento principal cuando carga el documento
// ----------------------------------------------------------

// Forzamos el scroll al inicio en diferentes fases de carga
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", async () => {
    // Si quedó un rastro en la URL del ancla antigua (#explorar), la borramos sin recargar
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname + window.location.search);
    }
    
    window.scrollTo(0, 0);

    // Reaseguramos tras el renderizado asíncrono
    window.addEventListener("load", () => {
        setTimeout(() => window.scrollTo(0, 0), 10);
    });

    // Cargamos los datos
    const dataLoaded = await loadAllData();

    // Si los datos no cargan, detenemos la inicialización
    if (!dataLoaded) {
        alert("No se pudieron cargar los datos del proyecto.");
        return;
    }

    // Llenamos todos los selects
    populateAllCountrySelects();

    // Inicializamos el comportamiento de la tarjeta de video
    setupHeroVideo();

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