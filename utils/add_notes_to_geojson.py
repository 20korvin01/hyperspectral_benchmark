#!/usr/bin/env python3
"""
Fügt Notizen und Kategorien aus der CSV-Dokumentation zur GeoJSON-Datei hinzu
"""

import json
import csv
from pathlib import Path

def load_documentation_from_csv(csv_file):
    """Lädt Notizen und Kategorien aus der CSV-Datei in ein Dictionary"""
    documentation = {}
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        # CSV mit Semikolon als Trennzeichen lesen
        reader = csv.DictReader(f, delimiter=';')
        print(f"CSV Header: {reader.fieldnames}")
        for row in reader:
            material = row.get('material', '').strip()
            note = row.get('note', '').strip()
            category = row.get('category', '').strip()
            if material:
                documentation[material] = {
                    'note': note,
                    'category': category
                }
                print(f"  {material}: note='{note}', category='{category}'")
    
    return documentation

def add_documentation_to_geojson(geojson_file, documentation_dict, output_file=None):
    """Fügt Notizen und Kategorien zur GeoJSON-Datei hinzu"""
    
    if output_file is None:
        output_file = geojson_file
    
    # GeoJSON laden
    with open(geojson_file, 'r', encoding='utf-8') as f:
        geojson = json.load(f)
    
    # Notizen und Kategorien zu jedem Feature hinzufügen
    updated_count = 0
    not_found = set()
    
    for feature in geojson.get('features', []):
        material_name = feature.get('properties', {}).get('material')
        
        if material_name:
            if material_name in documentation_dict:
                doc = documentation_dict[material_name]
                feature['properties']['note'] = doc['note']
                feature['properties']['category'] = doc['category']
                updated_count += 1
            else:
                not_found.add(material_name)
        
        # Fallback: Falls 'note' noch nicht vorhanden ist, setze leeren String
        if 'note' not in feature['properties']:
            feature['properties']['note'] = ''
        if 'category' not in feature['properties']:
            feature['properties']['category'] = ''
    
        # Fallback: Falls 'note' oder 'category' noch nicht vorhanden ist, setze leeren String
        if 'note' not in feature['properties']:
            feature['properties']['note'] = ''
        if 'category' not in feature['properties']:
            feature['properties']['category'] = ''
    
    # Aktualisierte GeoJSON speichern
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Dokumentation hinzugefügt!")
    print(f"  Eingabe-CSV: {geojson_file}")
    print(f"  Eingabe-GeoJSON: {geojson_file}")
    print(f"  Ausgabe-GeoJSON: {output_file}")
    print(f"  Anzahl aktualisierter Features: {updated_count}")
    
    if not_found:
        print(f"\nWarnung: Materialien nicht in CSV gefunden:")
        for mat in sorted(not_found):
            print(f"    - {mat}")

if __name__ == "__main__":
    # Pfade definieren
    base_path = Path(__file__).parent.parent / "data"
    csv_file = base_path / "materials_documentation.csv"
    geojson_file = base_path / "geojson" / "materials_img_metadata.geojson"
    
    # Dokumentation aus CSV laden
    documentation = load_documentation_from_csv(csv_file)
    print(f"✓ Geladen: {len(documentation)} Einträge aus CSV\n")
    
    # Dokumentation zur GeoJSON hinzufügen
    add_documentation_to_geojson(geojson_file, documentation)

