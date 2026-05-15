# INEXDATA

Aplicación web interactiva para explorar, visualizar y comparar el desempeño histórico de 149 países en el **Índice Global de Innovación (GII)** entre los años 2011 y 2024.

Proyecto académico desarrollado para el programa **Talento Tech** — Colombia.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Datos](#datos)
- [Preprocesamiento con Python](#preprocesamiento-con-python)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [Autores](#autores)
- [Referencias](#referencias)

---

## Descripción general

INEXDATA permite consultar el historial de índice y ranking de cualquiera de los 149 países incluidos en el Global Innovation Index desde 2011 hasta 2024. La aplicación genera automáticamente gráficos interactivos y conclusiones textuales basadas en los datos de cada país, y ofrece una herramienta de comparación directa entre dos naciones.

La interfaz está construida en HTML, CSS y JavaScript vanilla (sin frameworks frontend), con un video de portada, animaciones al desplazarse y un diseño responsivo adaptado a dispositivos móviles y de escritorio.

---

## Funcionalidades

### Explorador por país
- Selector con los 149 países del dataset, ordenados alfabéticamente.
- Tarjeta de resumen con bandera (via flagcdn.com), nombre del país, continente, índice actual, ranking actual y año del último registro disponible.
- **Gráfico de línea** — evolución del índice de innovación año a año.
- **Gráfico de barras** — ranking global por año (eje Y invertido: menor valor = mejor posición).
- **Gráfico comparativo** — índice del país seleccionado frente al país A del comparador.
- **Tabla histórica** — registros completos de año, índice y ranking.
- **Resumen estadístico** — mejor año, peor año, promedio del índice y variación total.

### Conclusiones automáticas
Cinco conclusiones generadas dinámicamente con JavaScript a partir del historial del país:
1. Tendencia general (creciente, estable o decreciente) con variación en puntos.
2. Mejor año de desempeño con índice y ranking.
3. Peor año de desempeño con índice y ranking.
4. Cambio neto en posición del ranking entre el primer y último año.
5. Análisis de estabilidad según el rango entre el mayor y menor índice histórico.

### Comparador de países
- Selección independiente de País A y País B.
- Tarjetas de resumen para cada país con sus datos más recientes.
- Gráfico de línea comparativo con los años comunes a ambos países.

### Diseño y experiencia
- Video de portada con tarjeta glass que aparece al finalizar la reproducción.
- Animaciones de entrada al hacer scroll (librería AOS).
- Navegación fija con menú hamburguesa para móviles.
- Diseño responsivo (mobile-first).

---

## Estructura del proyecto

```
inexdata/
├── index.html                  # Documento principal y única página HTML
│
├── css/
│   ├── styles.css              # Estilos generales, componentes y layout
│   └── animations.css          # Estilos de animaciones y transiciones
│
├── js/
│   ├── dataLoader.js           # Carga de JSON y funciones de acceso a datos
│   ├── countryCard.js          # Renderizado del resumen y tabla por país
│   ├── charts.js               # Creación y actualización de gráficos Chart.js
│   ├── compare.js              # Lógica del comparador de países
│   ├── conclusions.js          # Generación de conclusiones automáticas
│   └── main.js                 # Punto de entrada: inicialización y eventos
│
├── data/
│   ├── global_innovation_index.tsv   # Dataset original (fuente: Kaggle / WIPO)
│   ├── innovation_data.json          # Histórico de score y rank por país y año
│   └── countries_meta.json           # Nombre, continente y URL de bandera por país
│
├── img/
│   └── portada_video_iniexdata.mp4   # Video de fondo para la sección hero
│
└── python/
    └── preprocess_data.py      # Script de preprocesamiento del dataset TSV
```

---

## Tecnologías utilizadas

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Estructura | HTML5 | Marcado semántico de la interfaz |
| Estilos | CSS3 + Custom Properties | Diseño, layout, tokens de color y tipografía |
| Lógica | JavaScript (ES6+) | Carga de datos, renderizado, eventos y cálculos |
| Gráficos | [Chart.js](https://www.chartjs.org/) | Gráficos de línea y barras interactivos |
| Animaciones | [AOS](https://michaeleskin.com/aos/) | Animaciones al hacer scroll |
| Iconos | [Font Awesome 6](https://fontawesome.com/) | Iconografía de la interfaz |
| Tipografía | [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter) | Fuente principal |
| Banderas | [flagcdn.com](https://flagcdn.com/) | Imágenes de banderas por código ISO-2 |
| Preprocesamiento | Python 3 + pandas + pycountry | Transformación del dataset TSV a JSON |

---

## Datos

El dataset contiene información de **149 países** con registros anuales entre **2011 y 2024** (hasta 14 años por país). Cada registro incluye:

| Campo | Descripción |
|-------|-------------|
| `year` | Año del registro |
| `score` | Índice de innovación (valor numérico) |
| `rank` | Posición en el ranking global |

Los metadatos por país incluyen nombre completo (en inglés), continente (en español) y URL de bandera.

**Fuente original:** Global Innovation Index — WIPO / Kaggle.

---

## Preprocesamiento con Python

El script `python/preprocess_data.py` transforma el archivo TSV original en los dos JSON que consume la aplicación:

```bash
cd python
pip install pandas pycountry pycountry-convert
python preprocess_data.py
```

**Lo que hace el script:**
1. Lee `data/global_innovation_index.tsv` con `pandas`.
2. Extrae el historial anual (score y rank) de cada país, ignorando valores `-1` (datos no disponibles).
3. Resuelve nombre completo del país a partir del código ISO-3 con `pycountry`.
4. Determina el continente convirtiendo ISO-3 → ISO-2 → código de continente con `pycountry_convert`.
5. Construye la URL de bandera usando `flagcdn.com` con el código ISO-2 en minúsculas.
6. Genera `innovation_data.json` y `countries_meta.json` en `data/`.

> **Nota:** El script solo necesita ejecutarse si se actualiza el dataset TSV. Los JSON ya están incluidos en el repositorio y la aplicación los consume directamente.

---

## Cómo ejecutar el proyecto

El proyecto es una aplicación estática (sin servidor backend). Solo necesita servirse desde un servidor HTTP local para que el `fetch()` de los archivos JSON funcione correctamente.

### Opción 1 — VS Code Live Server

1. Instala la extensión **Live Server** en VS Code.
2. Abre la carpeta del proyecto.
3. Clic derecho sobre `index.html` → **Open with Live Server**.

### Opción 2 — Python

```bash
cd inexdata
python3 -m http.server 8080
# Abre http://localhost:8080 en el navegador
```

### Opción 3 — Node.js (npx)

```bash
cd inexdata
npx serve .
# Abre la URL que indique la terminal
```

> **Nota:** No abrir `index.html` directamente como archivo (`file://`), ya que los navegadores bloquean el `fetch()` local por CORS.

---

## Autores

Desarrollado por:

- **Diego Robles**
- **Johan Ospina**
- **Guillermo Guillén**

Proyecto académico — **Talento Tech**, Colombia.

---

## Referencias

- World Intellectual Property Organization (WIPO). (2024). *Global Innovation Index 2024*. https://www.wipo.int/
- Global Innovation Index. (2024). *Global Innovation Index Database*. https://www.globalinnovationindex.org/
- Kaggle. (2024). *Global Innovation Index Dataset*. https://www.kaggle.com/
