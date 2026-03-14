# ==========================================================
# INEXDATA - Procesamiento completo del dataset TSV
# Este script:
# 1. Lee el archivo TSV original
# 2. Extrae el histórico por país y por año
# 3. Genera innovation_data.json
# 4. Genera countries_meta.json con nombre, continente y bandera
# ==========================================================

# Importamos las librerías necesarias
import pandas as pd
import json
from pathlib import Path
import pycountry
import pycountry_convert as pc

# ----------------------------------------------------------
# Definimos las rutas de entrada y salida
# ----------------------------------------------------------
ruta_entrada = Path("../data/global_innovation_index.tsv")
ruta_salida_datos = Path("../data/innovation_data.json")
ruta_salida_meta = Path("../data/countries_meta.json")

# ----------------------------------------------------------
# Función para convertir código ISO-3 a nombre completo
# ----------------------------------------------------------
def obtener_nombre_pais(codigo_iso3):
    """
    Recibe un código ISO-3 y devuelve el nombre completo del país.
    Si no lo encuentra, devuelve el mismo código.
    """
    try:
        pais = pycountry.countries.get(alpha_3=codigo_iso3)
        return pais.name if pais else codigo_iso3
    except:
        return codigo_iso3

# ----------------------------------------------------------
# Función para convertir código ISO-3 a continente
# ----------------------------------------------------------
def obtener_continente(codigo_iso3):
    """
    Recibe un código ISO-3, lo convierte a ISO-2 y luego obtiene
    el nombre del continente en español.
    """
    try:
        codigo_iso2 = pycountry.countries.get(alpha_3=codigo_iso3).alpha_2
        codigo_continente = pc.country_alpha2_to_continent_code(codigo_iso2)

        mapa_continentes = {
            "AF": "África",
            "AS": "Asia",
            "EU": "Europa",
            "NA": "América del Norte",
            "SA": "América del Sur",
            "OC": "Oceanía"
        }

        return mapa_continentes.get(codigo_continente, "Desconocido")
    except:
        return "Desconocido"

# ----------------------------------------------------------
# Función para convertir código ISO-2 a emoji de bandera
# ----------------------------------------------------------
def iso2_a_bandera(codigo_iso2):
    """
    Convierte un código ISO-2 a emoji de bandera.
    Ejemplo: CO -> 🇨🇴
    """
    try:
        return "".join(chr(127397 + ord(letra)) for letra in codigo_iso2.upper())
    except:
        return "🏳️"

# ----------------------------------------------------------
# Función para obtener la bandera desde ISO-3
# ----------------------------------------------------------
def obtener_bandera(codigo_iso3):
    """
    Devuelve la URL de la bandera usando flagcdn.
    Ejemplo: https://flagcdn.com/w40/co.png
    """
    try:
        pais = pycountry.countries.get(alpha_3=codigo_iso3)

        if pais:
            codigo_iso2 = pais.alpha_2.lower()
            return f"https://flagcdn.com/w40/{codigo_iso2}.png"

        return ""

    except:
        return ""

# ----------------------------------------------------------
# Leemos el archivo TSV
# ----------------------------------------------------------
df = pd.read_csv(ruta_entrada, sep="\t")

# ----------------------------------------------------------
# Diccionarios finales
# ----------------------------------------------------------
datos_limpios = {}
metadatos_paises = {}

# ----------------------------------------------------------
# Recorremos cada fila del dataset
# ----------------------------------------------------------
for _, fila in df.iterrows():
    # Obtenemos el código ISO-3 del país
    codigo_pais = str(fila["Country"]).strip()

    # Lista con el historial del país
    historial = []

    # Recorremos los años disponibles
    for year in range(2011, 2025):
        columna_score = f"Score {year}"
        columna_rank = f"Rank {year}"

        score = fila[columna_score]
        rank = fila[columna_rank]

        # Ignoramos valores inválidos
        if score == -1 or rank == -1:
            continue

        historial.append({
            "year": int(year),
            "score": float(score),
            "rank": int(rank)
        })

    # Guardamos el historial del país
    datos_limpios[codigo_pais] = historial

    # ------------------------------------------------------
    # Generamos los metadatos del país
    # ------------------------------------------------------
    nombre_pais = obtener_nombre_pais(codigo_pais)
    continente = obtener_continente(codigo_pais)
    bandera = obtener_bandera(codigo_pais)

    metadatos_paises[codigo_pais] = {
        "name": nombre_pais,
        "continent": continente,
        "flag": bandera
    }

# ----------------------------------------------------------
# Guardamos innovation_data.json
# ----------------------------------------------------------
with open(ruta_salida_datos, "w", encoding="utf-8") as archivo_json:
    json.dump(datos_limpios, archivo_json, ensure_ascii=False, indent=4)

# ----------------------------------------------------------
# Guardamos countries_meta.json
# ----------------------------------------------------------
with open(ruta_salida_meta, "w", encoding="utf-8") as archivo_meta:
    json.dump(metadatos_paises, archivo_meta, ensure_ascii=False, indent=4)

# ----------------------------------------------------------
# Mensajes de confirmación
# ----------------------------------------------------------
print("=" * 60)
print("PROCESAMIENTO COMPLETADO")
print("=" * 60)
print(f"Archivo generado: {ruta_salida_datos}")
print(f"Archivo generado: {ruta_salida_meta}")
print(f"Cantidad de países procesados: {len(datos_limpios)}")
print("=" * 60)