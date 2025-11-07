import os
import numpy as np
from pyASDReader import ASDFile

# Directory containing the .asd files
spektren_dir = r"C:\Users\korvi\Documents\Universitaet\Masterarbeit\VisualisierungApp\application\data\spectra"
# Directory to save the mean spectra
output_dir = r"C:\Users\korvi\Documents\Universitaet\Masterarbeit\VisualisierungApp\application\data\mean_spectra"

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Get sorted list of .asd files
asd_files = sorted(
    [f for f in os.listdir(spektren_dir) if f.endswith(".asd")],
    key=lambda x: int(''.join(filter(str.isdigit, x.split('corthum')[-1].split('.asd')[0])))
)

# Group files by prefix or assign "UnbenanntX" if no prefix
materials = {}
unnamed_counter = 1
for file in asd_files:
    if '___' in file:
        prefix = file.split('___')[0]
    else:
        prefix = f"Unbenannt{unnamed_counter}"
        if len(materials.get(prefix, [])) == 8:
            unnamed_counter += 1
            prefix = f"Unbenannt{unnamed_counter}"
    materials.setdefault(prefix, []).append(file)

# Calculate and save mean spectra
for material, files in materials.items():
    all_reflectance = []
    wavelengths = None

    for file in files:
        file_path = os.path.join(spektren_dir, file)
        asd_file = ASDFile(file_path)

        if wavelengths is None:
            wavelengths = asd_file.wavelengths

        reflectance = np.clip(asd_file.reflectance, 0, 1)  # Clip values between 0 and 1
        all_reflectance.append(reflectance)

    # Calculate mean reflectance
    all_reflectance = np.array(all_reflectance)
    mean_reflectance = np.mean(all_reflectance, axis=0)

    # Save the mean spectrum
    output_file = os.path.join(output_dir, f"{material}_mean.asd")
    with open(output_file, 'w') as f:
        f.write("Wavelength (nm),Reflectance\n")
        for wl, refl in zip(wavelengths, mean_reflectance):
            f.write(f"{wl},{refl}\n")

print("Mean spectra calculation and saving completed.")