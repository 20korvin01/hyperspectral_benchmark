#!/usr/bin/env python3
"""
Convert XYZ tiles from EPSG:32632 (UTM32N) to EPSG:3857 (Web Mercator)

This script reads tiles from img/ortho_tiles (in UTM32N format) and converts them
to Web Mercator format that Leaflet can understand.

Usage:
    python convert_tiles_32632_to_3857.py
"""

import os
import sys
from pathlib import Path
import numpy as np
from rasterio.io import MemoryFile
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from rasterio.crs import CRS
import shutil

# Get the base directory
base_dir = Path(__file__).parent.parent
input_tiles_dir = base_dir / "img" / "ortho_tiles"
output_tiles_dir = base_dir / "img" / "ortho_tiles_3857"

print(f"Input directory: {input_tiles_dir}")
print(f"Output directory: {output_tiles_dir}")

# Create output directory structure
output_tiles_dir.mkdir(parents=True, exist_ok=True)

# Source and target CRS
src_crs = CRS.from_epsg(32632)  # UTM32N
dst_crs = CRS.from_epsg(3857)   # Web Mercator

# Count statistics
total_tiles = 0
converted_tiles = 0
failed_tiles = 0

print("\nScanning tiles structure...")
# Find all zoom levels
zoom_levels = [d for d in input_tiles_dir.iterdir() if d.is_dir() and d.name.isdigit()]
zoom_levels.sort(key=lambda x: int(x.name))

for zoom_dir in zoom_levels:
    zoom_level = int(zoom_dir.name)
    print(f"\nProcessing Zoom Level {zoom_level}...")
    
    # Create output zoom directory
    output_zoom_dir = output_tiles_dir / zoom_dir.name
    output_zoom_dir.mkdir(exist_ok=True)
    
    # Find all x directories
    x_dirs = [d for d in zoom_dir.iterdir() if d.is_dir()]
    
    for x_dir in x_dirs:
        x_coord = x_dir.name
        output_x_dir = output_zoom_dir / x_coord
        output_x_dir.mkdir(exist_ok=True)
        
        # Find all tile files (support both .png and .jpg)
        tile_files = list(x_dir.glob("*.png")) + list(x_dir.glob("*.jpg"))
        
        if not tile_files:
            print(f"  ⚠ No tiles found in {x_coord}")
        
        for tile_file in tile_files:
            total_tiles += 1
            y_coord = tile_file.stem
            file_ext = tile_file.suffix  # Get the file extension (.png or .jpg)
            output_tile_file = output_x_dir / f"{y_coord}{file_ext}"
            
            try:
                # Read the source tile
                with rasterio.open(tile_file) as src:
                    # Calculate the output transform
                    transform, width, height = calculate_default_transform(
                        src_crs, dst_crs, src.width, src.height, 
                        *src.bounds
                    )
                    
                    # Read the data
                    data = src.read()
                    
                    # Create output profile
                    out_profile = src.profile.copy()
                    out_profile.update({
                        "crs": dst_crs,
                        "transform": transform,
                        "width": width,
                        "height": height,
                        # Keep the original format (PNG or JPEG)
                        "driver": "PNG" if file_ext.lower() == ".png" else "JPEG",
                    })
                    
                    # Write the reprojected tile
                    with rasterio.open(output_tile_file, "w", **out_profile) as dst:
                        # Create empty output array
                        out_data = np.zeros((src.count, height, width), dtype=data.dtype)
                        
                        # Reproject the data
                        reproject(
                            data,
                            out_data,
                            src_transform=src.transform,
                            src_crs=src_crs,
                            dst_transform=transform,
                            dst_crs=dst_crs,
                            resampling=Resampling.bilinear,
                        )
                        
                        # Write the reprojected data
                        dst.write(out_data)
                
                converted_tiles += 1
                print(f"  ✓ {zoom_level}/{x_coord}/{y_coord}.jpg", end="\r")
                
            except Exception as e:
                failed_tiles += 1
                print(f"  ✗ {zoom_level}/{x_coord}/{y_coord}.jpg - Error: {e}")

print(f"\n\n{'='*60}")
print(f"Conversion Complete!")
print(f"{'='*60}")
print(f"Total tiles processed: {total_tiles}")
print(f"Successfully converted: {converted_tiles}")
print(f"Failed: {failed_tiles}")
print(f"Output directory: {output_tiles_dir}")
print(f"\nNext steps:")
print(f"1. Backup your original tiles: rename 'ortho_tiles' to 'ortho_tiles_utm32n'")
print(f"2. Rename 'ortho_tiles_3857' to 'ortho_tiles'")
print(f"3. Reload your web application")
