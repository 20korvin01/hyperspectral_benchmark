#!/usr/bin/env python3
"""
Fügt Notizen aus der CSV-Dokumentation zur GeoJSON-Datei hinzu
"""

import json
import csv
from pathlib import Path

def load_notes_from_csv(csv_file):
    """Lädt Notizen aus der CSV-Datei in ein Dictionary"""
    notes = {}
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        # CSV mit Semikolon als Trennzeichen lesen
        reader = csv.DictReader(f, delimiter=';')
        print(f"CSV Header: {reader.fieldnames}")
        for row in reader:
            material = row.get('material', '').strip()
            note = row.get('note', '').strip()
            if material:
                notes[material] = note
                print(f"  {material}: '{note}'")
    
    return notes

def add_notes_to_geojson(geojson_file, notes_dict, output_file=None):
    """Fügt Notizen zur GeoJSON-Datei hinzu"""
    
    if output_file is None:
        output_file = geojson_file
    
    # GeoJSON laden
    with open(geojson_file, 'r', encoding='utf-8') as f:
        geojson = json.load(f)
    
    # Notizen zu jedem Feature hinzufügen
    updated_count = 0
    not_found = set()
    
    for feature in geojson.get('features', []):
        material_name = feature.get('properties', {}).get('material')
        
        if material_name:
            if material_name in notes_dict:
                feature['properties']['note'] = notes_dict[material_name]
                updated_count += 1
            else:
                not_found.add(material_name)
        
        # Fallback: Falls 'note' noch nicht vorhanden ist, setze leeren String
        if 'note' not in feature['properties']:
            feature['properties']['note'] = ''
    
    # Aktualisierte GeoJSON speichern
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)
    
    print(f"Notizen hinzugefuegt!")
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
    
    # Notizen aus CSV laden
    notes = load_notes_from_csv(csv_file)
    print(f"Geladen: {len(notes)} Notizen aus CSV")
    
    # Notizen zur GeoJSON hinzufügen
    add_notes_to_geojson(geojson_file, notes)
