import os
import json
import exifread
from typing import Any, Dict


# === Pfade anpassen ===
INPUT_DIR = r"C:\Users\korvi\Documents\Universitaet\Masterarbeit\VisualisierungApp\application\img\materials"
OUTPUT_PATH = r"C:\Users\korvi\Documents\Universitaet\Masterarbeit\VisualisierungApp\application\data\materials_img_metadata_raw.json"


def dms_to_decimal(dms, ref: str) -> float:
    """Wandelt Grad/Minuten/Sekunden in Dezimalgrad um."""
    def to_float(x):
        return float(x.num) / float(x.den) if hasattr(x, "num") else float(x)
    deg, minute, sec = [to_float(x) for x in dms]
    dec = deg + minute / 60 + sec / 3600
    if ref in ("S", "W"):
        dec = -dec
    return dec


def extract_exif(path: str) -> Dict[str, Any]:
    """Liest EXIF-Tags eines Bildes und gibt sie als Dict zurück."""
    data = {
        "name": os.path.basename(path)  # <-- Neuer Key mit Dateiname
    }
    try:
        with open(path, "rb") as f:
            tags = exifread.process_file(f, details=True)

        # Alle Tags aufnehmen
        for tag, value in tags.items():
            data[tag] = str(value)

        # GPS separat dekodieren
        lat_tag = tags.get("GPS GPSLatitude")
        lat_ref = tags.get("GPS GPSLatitudeRef")
        lon_tag = tags.get("GPS GPSLongitude")
        lon_ref = tags.get("GPS GPSLongitudeRef")

        if lat_tag and lat_ref and lon_tag and lon_ref:
            lat = dms_to_decimal(lat_tag.values, str(lat_ref.values))
            lon = dms_to_decimal(lon_tag.values, str(lon_ref.values))
            data["GPS Latitude (Decimal)"] = lat
            data["GPS Longitude (Decimal)"] = lon

    except Exception as e:
        data["error"] = str(e)
    return data


def find_images(directory: str):
    """Findet unterstützte Bilddateien im Verzeichnis (rekursiv)."""
    exts = {".jpg", ".jpeg", ".tif", ".tiff", ".png"}
    out = []
    for root, _, files in os.walk(directory):
        for fn in files:
            if os.path.splitext(fn)[1].lower() in exts:
                out.append(os.path.join(root, fn))
    return out


def main():
    indir = os.path.abspath(INPUT_DIR)
    if not os.path.isdir(indir):
        raise SystemExit(f"❌ Verzeichnis nicht gefunden: {indir}")

    images = find_images(indir)
    print(f"📸 Gefundene Bilder: {len(images)}")

    all_meta = []
    for i, img in enumerate(images, start=1):
        print(f"[{i}/{len(images)}] {img}")
        meta = extract_exif(img)
        all_meta.append(meta)

    # JSON schreiben
    out_path = os.path.abspath(OUTPUT_PATH)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_meta, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Metadaten gespeichert in: {out_path}")


if __name__ == "__main__":
    main()
