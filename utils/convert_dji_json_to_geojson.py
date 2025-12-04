#!/usr/bin/env python3
"""
Converts DJI image metadata JSON to GeoJSON format.
"""

import json
from pathlib import Path


def convert_json_to_geojson(input_json_path, output_geojson_path):
    """
    Convert JSON metadata to GeoJSON format.
    
    Args:
        input_json_path: Path to the input JSON file
        output_geojson_path: Path to the output GeoJSON file
    """
    
    # Read the input JSON file
    with open(input_json_path, 'r') as f:
        data = json.load(f)
    
    # Create GeoJSON FeatureCollection
    features = []
    
    for item in data:
        # Extract coordinates
        longitude = item.get('longitude')
        latitude = item.get('latitude')
        
        # Only create feature if coordinates exist
        if latitude is not None and longitude is not None:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "properties": item
            }
            features.append(feature)
    
    # Create GeoJSON FeatureCollection
    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }
    
    # Write the output GeoJSON file
    with open(output_geojson_path, 'w') as f:
        json.dump(geojson_data, f, indent=2)
    
    print(f"✓ Successfully converted {len(features)} features to GeoJSON")
    print(f"✓ Output saved to: {output_geojson_path}")


if __name__ == "__main__":
    # Define paths
    base_dir = Path(__file__).parent.parent
    input_file = base_dir / "data" / "geojson" / "20251203" / "dji_imgs_metadata.json"
    output_file = base_dir / "data" / "geojson" / "20251203" / "dji_imgs_metadata.geojson"
    
    # Run conversion
    if input_file.exists():
        convert_json_to_geojson(input_file, output_file)
    else:
        print(f"Error: Input file not found: {input_file}")
