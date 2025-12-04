#!/usr/bin/env python3
"""
Konvertiert materials_img_metadata.json zu GeoJSON Format
"""

import json
from pathlib import Path

def json_to_geojson(input_file, output_file):
    """
    Konvertiert JSON mit GPS-Koordinaten zu GeoJSON FeatureCollection
    
    Args:
        input_file: Pfad zur Eingabe-JSON-Datei
        output_file: Pfad zur Ausgabe-GeoJSON-Datei
    """
    
    # JSON-Datei laden
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # GeoJSON FeatureCollection erstellen
    features = []
    
    for item in data:
        # "name" zu "material" umbenennen
        if 'name' in item:
            item['material'] = item.pop('name')
        
        # Koordinaten extrahieren
        lat = item.get('GPS Latitude (Decimal)')
        lon = item.get('GPS Longitude (Decimal)')
        
        # Nur Items mit gültigen Koordinaten verarbeiten
        if lat is not None and lon is not None:
            # GeoJSON Feature erstellen
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]  # GeoJSON nutzt [Longitude, Latitude]
                },
                "properties": item  # Alle Eigenschaften als Properties
            }
            features.append(feature)
    
    # GeoJSON FeatureCollection erstellen
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    # Als GeoJSON speichern
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Konvertierung abgeschlossen!")
    print(f"  Eingabedatei: {input_file}")
    print(f"  Ausgabedatei: {output_file}")
    print(f"  Anzahl Features: {len(features)}")

if __name__ == "__main__":
    # Pfade definieren
    base_path = Path(__file__).parent.parent / "data"
    input_file = base_path / "materials_img_metadata.json"
    output_file = base_path / "materials_img_metadata.geojson"
    
    # Konvertierung durchführen
    json_to_geojson(input_file, output_file)
