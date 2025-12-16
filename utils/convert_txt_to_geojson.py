"""Convert HySpex trajectory TXT exports into GeoJSON files.

This script reads the four TXT files in ``data/geojson/20251203`` and writes
GeoJSON equivalents that mirror the structure found in the 20251105 folder.
For the *_all files, only every 100th point is retained.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence


DEFAULT_PROPERTIES = {
	"name": "Flight trajectory",
	"description": "Flugbahn der HySpex Mission",
	"source_format": "swir_vnir",
}


@dataclass(frozen=True)
class ConversionJob:
	"""Describe how a TXT file should be converted."""

	input_name: str
	output_name: str
	geometry_type: str  # "LineString" or "Point"
	every: int = 1


def load_coordinates(txt_path: Path, every: int) -> List[List[float]]:
	"""Load longitude/latitude pairs from the HySpex TXT export.

	The TXT files are tab-separated; relevant columns are lon (index 1) and lat (index 2).
	"""

	coords: List[List[float]] = []
	data_index = 0

	with txt_path.open("r", encoding="utf-8") as handle:
		for line in handle:
			stripped = line.strip()
			if not stripped:
				continue

			parts = stripped.split()
			if len(parts) < 3:
				continue

			if data_index % every == 0:
				lon = float(parts[1])
				lat = float(parts[2])
				coords.append([lon, lat])

			data_index += 1

	return coords


def linestring_feature(coords: Sequence[Sequence[float]]) -> dict:
	return {
		"type": "Feature",
		"geometry": {"type": "LineString", "coordinates": [list(pair) for pair in coords]},
		"properties": DEFAULT_PROPERTIES,
	}


def point_features(coords: Iterable[Sequence[float]]) -> List[dict]:
	features: List[dict] = []
	for idx, (lon, lat) in enumerate(coords):
		features.append(
			{
				"type": "Feature",
				"geometry": {"type": "Point", "coordinates": [lon, lat]},
				"properties": {
					**DEFAULT_PROPERTIES,
					"point_index": idx,
					"longitude": lon,
					"latitude": lat,
				},
			}
		)
	return features


def write_geojson(features: List[dict], output_path: Path) -> None:
	output = {"type": "FeatureCollection", "features": features}
	output_path.parent.mkdir(parents=True, exist_ok=True)
	output_path.write_text(json.dumps(output, indent=2), encoding="utf-8")


def convert_folder(folder: Path) -> None:
	jobs = [
		ConversionJob("SWIR_all.txt", "SWIR_all_downsampled100.geojson", "LineString", every=100),
		ConversionJob("VNIR_all.txt", "VNIR_all_downsampled100.geojson", "LineString", every=100),
		ConversionJob("SWIR_event.txt", "SWIR_event_points.geojson", "Point"),
		ConversionJob("VNIR_event.txt", "VNIR_event_points.geojson", "Point"),
	]

	for job in jobs:
		txt_path = folder / job.input_name
		coords = load_coordinates(txt_path, every=job.every)

		if job.geometry_type == "LineString":
			features = [linestring_feature(coords)]
		elif job.geometry_type == "Point":
			features = point_features(coords)
		else:
			raise ValueError(f"Unsupported geometry type: {job.geometry_type}")

		write_geojson(features, folder / job.output_name)


def main() -> None:
	base_folder = Path(__file__).resolve().parent.parent / "data" / "geojson" / "20251203"
	convert_folder(base_folder)


if __name__ == "__main__":
	main()
