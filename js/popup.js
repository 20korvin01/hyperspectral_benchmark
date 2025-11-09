// Function to format the date and time
function formatDateTime(dateTime) {
    if (!dateTime) return 'Invalid Date';

    // Replace colons in the date part with dashes and ensure proper ISO format
    const isoDateTime = dateTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    const dateObj = new Date(isoDateTime);

    if (isNaN(dateObj)) return 'Invalid Date';

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return dateObj.toLocaleDateString('de-DE', options).replace(',', ' um');
}

// Function to create a popup for a material with spectrum button
function createPopup(material) {
    // Support both old JSON format (material.name) and new GeoJSON format (material.material)
    const materialName = material.material || material.name;
    const dateTime = material['EXIF DateTimeOriginal'];
    const note = material.note || '';
    const imageName = materialName + '.jpg';
    const imagePath = `img/materials/${imageName}`;

    let popupContent = `
        <div class="popup-header">
            <b>${materialName}</b>
            <button class="spectrum-details-button" onclick="openSpectrumModal(this)" title="Spektren anzeigen">📊</button>
        </div>
        <img src="${imagePath}" alt="${materialName}" style="max-width: 100%; height: auto;"><br>
        <span class="date">Aufgenommen am ${formatDateTime(dateTime)} Uhr</span>`;
    
    // Füge Notiz hinzu, wenn vorhanden
    if (note) {
        popupContent += `<br><span class="note" style="font-size: 12px; color: #666; margin-top: 8px; display: block;"><strong>Anmerkung:</strong> ${note}</span>`;
    }
    
    popupContent += `</div>`;
    
    return popupContent;
}

// Global variable to store current material
let currentMaterial = null;

// Global variable to cache available spectrum files
let spectraFilesCache = null;

// Function to load and cache spectrum files list
async function loadSpectraFilesList() {
    if (spectraFilesCache !== null) {
        return spectraFilesCache;
    }
    
    try {
        const response = await fetch('data/spectra_files.json');
        spectraFilesCache = await response.json();
        return spectraFilesCache;
    } catch (e) {
        console.error('Error loading spectra files list:', e);
        return [];
    }
}

// Function to get spectrum files for a material
async function getSpectraFilesForMaterial(materialName) {
    const allFiles = await loadSpectraFilesList();
    
    // Filter files where the material name is the prefix before ___corthum
    const matchingFiles = allFiles.filter(filename => {
        const prefix = filename.split('___corthum')[0];
        return prefix === materialName;
    });
    
    return matchingFiles;
}

// Function to open spectrum modal
function openSpectrumModal(button) {
    // Find the popup container
    const popup = button.closest('.leaflet-popup-content');
    if (!popup) return;
    
    const materialName = popup.querySelector('b').textContent;
    
    // Find material data in GeoJSON features
    let feature = materialsData.features.find(f => f.properties.material === materialName);
    
    if (!feature) {
        console.error('Material not found:', materialName);
        return;
    }
    
    currentMaterial = feature.properties;
    
    // Populate modal content
    populateSpectrumModal(feature.properties);
    
    // Show modal
    const modal = document.getElementById('spectrum-modal');
    modal.classList.add('active');
}

// Function to populate spectrum modal with data
async function populateSpectrumModal(material) {
    // Get material name from GeoJSON structure
    const materialName = material.material || material.name;
    
    // Set title in modal header
    document.getElementById('spectrum-modal-title').textContent = materialName;
    
    // Set image
    const imageName = materialName + '.jpg';
    const imagePath = `img/materials/${imageName}`;
    document.getElementById('spectrum-modal-img').src = imagePath;
    
    // Load and plot spectra
    await loadAndPlotSpectra(materialName);
    await loadAndPlotMeanSpectra(materialName);
}

// Function to load and plot all 8 spectra
async function loadAndPlotSpectra(materialName) {
    try {
        // Get all matching spectrum files for this material
        const matchingFiles = await getSpectraFilesForMaterial(materialName);
        
        if (matchingFiles.length === 0) {
            console.warn(`No spectrum files found for material: ${materialName}`);
            return;
        }
        
        // console.log(`Found ${matchingFiles.length} spectrum files for ${materialName}`);
        
        const traces = [];
        const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'];
        
        // Load up to 8 spectrum files
        for (let i = 0; i < matchingFiles.length && i < 8; i++) {
            const filename = matchingFiles[i];
            
            try {
                const response = await fetch(`data/spectra_ascii/${filename}`);
                
                if (!response.ok) {
                    console.warn(`Could not load ${filename}`);
                    continue;
                }
                
                const data = await response.text();
                const lines = data.trim().split('\n').slice(1); // Skip header
                
                const wavelengths = [];
                const reflectance = [];
                
                lines.forEach(line => {
                    const [wl, ref] = line.split(',').map(x => parseFloat(x));
                    if (!isNaN(wl) && !isNaN(ref)) {
                        wavelengths.push(wl);
                        reflectance.push(ref);
                    }
                });
                
                if (wavelengths.length > 0) {
                    traces.push({
                        x: wavelengths,
                        y: reflectance,
                        name: `Messung ${traces.length + 1}`,
                        line: { color: colors[traces.length % colors.length], width: 1 },
                        mode: 'lines'
                    });
                }
                
            } catch (e) {
                console.warn(`Error loading spectrum ${filename}:`, e);
            }
        }
        
        if (traces.length > 0) {
            const layout = {
                title: `Alle Spektren für ${materialName}`,
                xaxis: { title: 'Wellenlänge (nm)' },
                yaxis: { title: 'Reflektanz' },
                hovermode: 'x unified',
                margin: { l: 50, r: 50, t: 50, b: 50 }
            };
            
            Plotly.newPlot('spectra-plot', traces, layout, { responsive: true });
        } else {
            console.warn(`No traces created for material: ${materialName}`);
        }
        
    } catch (e) {
        console.error('Error plotting spectra:', e);
    }
}

// Function to load and plot mean spectrum with standard deviation
async function loadAndPlotMeanSpectra(materialName) {
    try {
        // Load mean spectrum - use .asd extension
        const meanFilename = `${materialName}_mean.asd`;
        const meanResponse = await fetch(`data/mean_spectra_ascii/${meanFilename}`);
        
        if (!meanResponse.ok) {
            console.warn(`Could not load mean spectrum for ${materialName}`);
            return;
        }
        
        const meanData = await meanResponse.text();
        const meanLines = meanData.trim().split('\n').slice(1);
        
        const wavelengths = [];
        const reflectance = [];
        
        meanLines.forEach(line => {
            const [wl, ref] = line.split(',').map(x => parseFloat(x));
            if (!isNaN(wl) && !isNaN(ref)) {
                wavelengths.push(wl);
                reflectance.push(ref);
            }
        });
        
        // Load all individual spectra to calculate std dev
        const allSpectra = [];
        const matchingFiles = await getSpectraFilesForMaterial(materialName);
        
        for (let i = 0; i < matchingFiles.length && i < 8; i++) {
            const filename = matchingFiles[i];
            
            try {
                const response = await fetch(`data/spectra_ascii/${filename}`);
                if (response.ok) {
                    const data = await response.text();
                    const lines = data.trim().split('\n').slice(1);
                    
                    const spectra = [];
                    lines.forEach(line => {
                        const [wl, ref] = line.split(',').map(x => parseFloat(x));
                        if (!isNaN(ref)) spectra.push(ref);
                    });
                    
                    if (spectra.length > 0) {
                        allSpectra.push(spectra);
                    }
                }
            } catch (e) {
                console.warn('Error loading spectrum for std dev:', e);
            }
        }
        
        // Calculate standard deviation
        const stdDev = [];
        if (allSpectra.length > 0) {
            for (let j = 0; j < reflectance.length; j++) {
                const values = allSpectra.map(spec => spec[j] || 0);
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
                stdDev.push(Math.sqrt(variance));
            }
        }
        
        // Create traces
        const traces = [
            {
                x: wavelengths,
                y: reflectance,
                name: 'Gemitteltes Spektrum',
                line: { color: '#1f77b4', width: 1.5 },
                mode: 'lines'
            }
        ];
        
        // Add standard deviation as fill
        if (stdDev.length > 0) {
            traces.push({
                x: wavelengths,
                y: reflectance.map((val, i) => val + stdDev[i]),
                fill: null,
                showlegend: false,
                hoverinfo: 'skip',
                line: { color: 'transparent' }
            });
            
            traces.push({
                x: wavelengths,
                y: reflectance.map((val, i) => val - stdDev[i]),
                fill: 'tonexty',
                name: '± Standardabweichung',
                fillcolor: 'rgba(31, 119, 180, 0.2)',
                line: { color: 'transparent' },
                showlegend: true,
                hoverinfo: 'skip'
            });
        }
        
        const layout = {
            title: `Gemitteltes Spektrum mit Standardabweichung für ${materialName}`,
            xaxis: { title: 'Wellenlänge (nm)' },
            yaxis: { title: 'Reflektanz' },
            hovermode: 'x unified',
            margin: { l: 50, r: 50, t: 50, b: 50 }
        };
        
        Plotly.newPlot('mean-plot', traces, layout, { responsive: true });
        
    } catch (e) {
        console.error('Error plotting mean spectrum:', e);
    }
}

// Initialize modal close button
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('spectrum-modal');
    const closeButton = document.querySelector('.spectrum-modal-close');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.spectrum-tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.spectrum-tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const paneId = tabName === 'image' ? 'image-tab' : tabName === 'spectra' ? 'spectra-tab' : 'mean-tab';
            document.getElementById(paneId).classList.add('active');
            
            // Trigger Plotly resize when tab is activated
            setTimeout(() => {
                if (tabName === 'spectra') {
                    Plotly.Plots.resize('spectra-plot');
                } else if (tabName === 'mean') {
                    Plotly.Plots.resize('mean-plot');
                }
            }, 100);
        });
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});