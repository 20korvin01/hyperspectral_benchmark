# Hyperspectral Benchmark - Visualization

**Live Demo:** [https://20korvin01.github.io/hyperspectral_benchmark/](https://20korvin01.github.io/hyperspectral_benchmark/)

Interaktive Webanwendung zur Visualisierung und Analyse von hyperspektralen Messdaten und Materialproben. Teil einer Masterarbeit zur Entwicklung eines Benchmarks für die Auswertung multi-temporaler hyperspektraler Daten.

## Über das Projekt

Diese Anwendung ist Teil eines größeren Benchmarking-Projekts für hyperspektrale Daten. Die Daten wurden bei der corthum Nordschwarzwald GmbH - corthum Erdenwerk (Fertigbeton BETON2GO) aufgenommen.

### Ziele des Benchmarks
- Bereitstellung standardisierter Datensätze für die Entwicklung und Evaluierung von Algorithmen
- Fokus auf multi-temporale hyperspektrale Datenauswertung
- Unterstützung von Machine Learning Anwendungen durch umfangreiche, gelabelte Trainingsdaten
- Bewertung der Modellrobustheit über verschiedene Zeitpunkte

## Dateneigenschaften

- **Spektrale Vielfalt** durch verschiedene Materialproben und Messbedingungen
- **Temporale Abdeckung** für Robustheitsprüfungen
- **Qualitätssicherung** durch Referenzmessungen mit Feldspektrometer
- **Vollständige Annotation** aller Pixel mit Ground Truth Information
- **Georeferenzierung** der Daten (Radiance und Ground Reflectance)

## Features der Visualisierung

- **Interaktive Karte** mit Positionen der Materialproben
- **Materialfilter** und Sortierung (A-Z, Z-A)
- **Detailansicht** für jedes Material mit:
  - Fotografien
  - Spektrendaten
  - Gemittelte Spektren
- **GeoJSON-basierte Metadaten** mit EXIF-Daten und Materialinformationen

## Datenstruktur

- `data/geojson/` - Räumliche Daten und Metadaten (GeoJSON)
- `data/mean_spectra_ascii/` - Gemittelte Spektren
- `data/spectra_ascii/` - Einzelne Spektrenmessungen
- `data/spectra_binary/` - Binäre Spektrendaten (ASD-Format)
- `img/materials/` - Materialfotos
- `utils/` - Python-Scripts zur Datenverarbeitung

## Technologie

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Kartendarstellung:** Leaflet
- **Datenformate:** GeoJSON, ASD (Spektrometer), CSV

## Datenverarbeitung (Noch in Entwicklung)

1. Aufnahme der Rohdaten (Digital Numbers)
2. Konvertierung zu Radiance
3. Geometrische Korrektur für georeferenzierte Radiance
4. Atmosphärische Korrektur für georeferenzierte Ground Reflectance
5. Annotation und Ground Truth Erstellung

---

*Masterarbeit - Development of a benchmark for multi-temporal hyperspectral data exploitation*
