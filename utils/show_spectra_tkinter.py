import os
import numpy as np
from pyASDReader import ASDFile
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import Tk, Listbox, Button, Label, END, Frame

# Directory containing the .asd files
spektren_dir = r"C:\Users\kor83562\Desktop\asd_corthum\spektren"

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

class ASDViewer:
    def __init__(self, root):
        self.root = root
        self.root.title("ASD Viewer")

        # Frame für Material-Auswahl
        self.menu_frame = Frame(root)
        self.menu_frame.pack(side="top", fill="x", padx=10, pady=10)

        self.label = Label(self.menu_frame, text="Wähle ein Material:")
        self.label.pack(side="left")

        self.listbox = Listbox(self.menu_frame, height=10, width=40)
        self.listbox.pack(side="left", padx=5)
        for material in materials.keys():
            self.listbox.insert(END, material)

        self.plot_button = Button(self.menu_frame, text="Plotten", command=self.plot_material)
        self.plot_button.pack(side="left", padx=10)

        # Frame für die beiden nebeneinanderliegenden Plots
        self.plots_frame = Frame(root)
        self.plots_frame.pack(side="top", fill="both", expand=True)

        # Gemeinsamer Plot
        self.combined_fig, self.combined_ax = plt.subplots(figsize=(6, 4))
        self.combined_canvas = FigureCanvasTkAgg(self.combined_fig, master=self.plots_frame)
        self.combined_canvas.get_tk_widget().pack(side="left", fill="both", expand=True)

        # Mittelwert + Standardabweichung Plot
        self.mean_fig, self.mean_ax = plt.subplots(figsize=(6, 4))
        self.mean_canvas = FigureCanvasTkAgg(self.mean_fig, master=self.plots_frame)
        self.mean_canvas.get_tk_widget().pack(side="left", fill="both", expand=True)

        # Frame für die 8 Einzelplots unter den beiden Plots
        self.individual_frame = Frame(root)
        self.individual_frame.pack(side="top", fill="both", expand=True)

        self.fig, self.axes = plt.subplots(2, 4, figsize=(16, 6), sharey=True)
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.individual_frame)
        self.canvas.get_tk_widget().pack(fill="both", expand=True)

    def plot_material(self):
        # Clear axes
        self.combined_ax.clear()
        self.mean_ax.clear()
        for ax in self.axes.flat:
            ax.clear()

        # Get selected material
        selected = self.listbox.get(self.listbox.curselection())
        files = materials[selected]

        colors = plt.cm.get_cmap("tab10", len(files[:8]))

        all_reflectance = []

        for i, file in enumerate(files[:8]):  # Only plot up to 8 files
            file_path = os.path.join(spektren_dir, file)
            asd_file = ASDFile(file_path)

            wavelengths = asd_file.wavelengths
            reflectance = asd_file.reflectance
            all_reflectance.append(reflectance)

            # Individual plots
            row, col = divmod(i, 4)
            ax = self.axes[row, col]
            ax.plot(wavelengths, reflectance, color=colors(i))
            ax.set_title(file)
            ax.set_xlabel("Wavelength (nm)")
            ax.set_ylim(0, 1)

            # Combined plot
            self.combined_ax.plot(
                wavelengths, reflectance, 
                label=file.split('corthum')[-1].split('.asd')[0], 
                color=colors(i)
            )

        self.axes[0, 0].set_ylabel("Reflectance")
        self.axes[1, 0].set_ylabel("Reflectance")
        self.fig.tight_layout()
        self.canvas.draw()

        # Combined plot settings
        self.combined_ax.set_title(f"Gemeinsame Spektren -- {selected}")
        self.combined_ax.set_xlabel("Wavelength (nm)")
        self.combined_ax.set_ylabel("Reflectance")
        self.combined_ax.set_ylim(0, 1)
        self.combined_ax.legend()
        self.combined_fig.tight_layout()
        self.combined_canvas.draw()

        # Mittelwert + Standardabweichung Plot
        all_reflectance = np.array(all_reflectance)
        mean_reflectance = np.mean(all_reflectance, axis=0)
        std_reflectance = np.std(all_reflectance, axis=0)

        self.mean_ax.plot(wavelengths, mean_reflectance, color='blue', label='Mittelwert')
        self.mean_ax.fill_between(
            wavelengths,
            mean_reflectance - std_reflectance,
            mean_reflectance + std_reflectance,
            color='blue',
            alpha=0.3,
            label='± Standardabweichung'
        )
        self.mean_ax.set_title(f"Mittel + Std -- {selected}")
        self.mean_ax.set_xlabel("Wavelength (nm)")
        self.mean_ax.set_ylabel("Reflectance")
        self.mean_ax.set_ylim(0, 1)
        self.mean_ax.legend()
        self.mean_fig.tight_layout()
        self.mean_canvas.draw()

# Run the GUI
if __name__ == "__main__":
    root = Tk()
    viewer = ASDViewer(root)
    root.mainloop()
