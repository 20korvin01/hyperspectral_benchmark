#!/usr/bin/env python3
"""
Script zur Konvertierung von binären ASD-Spektrendateien in ASCII-Format.
Liest ASD-Dateien aus spectra_binary/ und speichert sie als ASCII-Dateien in spectra_ascii/
"""

import os
import numpy as np
from pathlib import Path

try:
    from pyASDReader import ASDFile
    PYASDREADER_AVAILABLE = True
except ImportError:
    PYASDREADER_AVAILABLE = False
    print("⚠️  pyASDReader nicht installiert. Installiere mit: pip install spectral")


def read_asd_binary(file_path):
    """
    Liest eine binäre ASD-Datei und extrahiert die Spektrendaten.
    Nutzt pyASDReader für korrekte ASD-Format-Unterstützung.
    
    Args:
        file_path: Pfad zur ASD-Datei
        
    Returns:
        Tuple (wavelengths, reflectance) oder None bei Fehler
    """
    if not PYASDREADER_AVAILABLE:
        print(f"❌ pyASDReader nicht verfügbar. Kann {file_path} nicht lesen.")
        return None
    
    try:
        asd_file = ASDFile(file_path)
        
        # Extrahiere Wellenlängen und Reflektanzwerte
        wavelengths = asd_file.wavelengths
        reflectance = np.clip(asd_file.reflectance, 0, 1)  # Clippe auf [0, 1]
        
        return wavelengths, reflectance
            
    except Exception as e:
        print(f"❌ Fehler beim Lesen von {file_path}: {e}")
        return None


def write_ascii_spectrum(output_path, wavelengths, reflectance):
    """
    Schreibt Spektrendaten als ASCII-Datei (kommagetrennt wie in compute_means.py).
    
    Args:
        output_path: Pfad zur Ausgabedatei
        wavelengths: Numpy Array der Wellenlängen
        reflectance: Numpy Array der Reflektanzwerte
    """
    try:
        with open(output_path, 'w') as f:
            # Schreibe Header (kommagetrennt wie in compute_means.py)
            f.write("Wavelength (nm),Reflectance\n")
            
            # Schreibe Daten
            for wl, ref in zip(wavelengths, reflectance):
                f.write(f"{wl},{ref}\n")
                
    except Exception as e:
        print(f"❌ Fehler beim Schreiben von {output_path}: {e}")


def convert_all_spectra(binary_dir, ascii_dir):
    """
    Konvertiert alle ASD-Dateien in einem Verzeichnis.
    
    Args:
        binary_dir: Quellverzeichnis mit binären ASD-Dateien
        ascii_dir: Zielverzeichnis für ASCII-Dateien
    """
    binary_path = Path(binary_dir)
    ascii_path = Path(ascii_dir)
    
    # Erstelle ASCII-Verzeichnis falls nicht vorhanden
    ascii_path.mkdir(parents=True, exist_ok=True)
    
    # Finde alle ASD-Dateien (sortiert)
    asd_files = sorted(list(binary_path.glob('*.asd')))
    
    if not asd_files:
        print(f"❌ Keine ASD-Dateien in {binary_dir} gefunden")
        return
    
    print(f"📂 Gefundene ASD-Dateien: {len(asd_files)}")
    print(f"🔄 Beginne Konvertierung...\n")
    
    success_count = 0
    error_count = 0
    
    for idx, asd_file in enumerate(asd_files, 1):
        print(f"[{idx}/{len(asd_files)}] {asd_file.name}...", end=" ", flush=True)
        
        result = read_asd_binary(str(asd_file))
        
        if result:
            wavelengths, reflectance = result
            output_filename = asd_file.stem + '.txt'
            output_path = ascii_path / output_filename
            
            write_ascii_spectrum(str(output_path), wavelengths, reflectance)
            print("✓")
            success_count += 1
        else:
            print("❌")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"✓ Konvertierung abgeschlossen!")
    print(f"  Erfolgreich: {success_count}")
    print(f"  Fehler: {error_count}")
    print(f"  Ausgabeverzeichnis: {ascii_path}")
    print(f"{'='*60}")


if __name__ == '__main__':
    # Definiere Pfade relativ zum Script
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent / 'data'
    
    binary_dir = data_dir / 'spectra_binary'
    ascii_dir = data_dir / 'spectra_ascii'
    
    print("🔬 ASD Binary zu ASCII Konverter")
    print(f"=" * 60)
    print(f"Quelle: {binary_dir}")
    print(f"Ziel: {ascii_dir}")
    print(f"=" * 60 + "\n")
    
    convert_all_spectra(str(binary_dir), str(ascii_dir))
