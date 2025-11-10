// Initialize the map
const map = L.map('map', {
    center: [48.853492979702956, 8.485241719982184],
    zoom: 18,
    zoomControl: false
});

// Define base maps
const satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Map data ©2025 Google'
});

const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
});

const terrain = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors, © CyclOSM'
});

const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '© CartoDB contributors'
});

const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '© CartoDB contributors'
});

// Define a layer group for materials
const materialsLayer = L.layerGroup();

// Add the default base map (satellite)
satellite.addTo(map);

// Log clicked coordinates to console
map.on('click', function(e) {
    console.log('Angeklickte Koordinate:', e.latlng.lat, e.latlng.lng);
});

// Define base maps
const baseMaps = {
    'Satellite': satellite,
    'Streets': streets,
    'Terrain': terrain,
    'Dark': dark,
    'Light': light
};

const overlays = {};

// Do NOT add the materials layer by default - it will be added when the checkbox is checked
let currentBasemap = 'Satellite';

// Add a basemaps selector button (top right)
const basemapsControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('button', 'leaflet-control-basemaps', container);
        button.innerHTML = '<i class="fas fa-layer-group"></i>';
        button.title = 'Kartenlayer auswählen';
        
        // Create a dropdown menu
        const menu = L.DomUtil.create('div', 'basemaps-menu', container);
        
        // Add basemap options to the menu
        for (const [name, layer] of Object.entries(baseMaps)) {
            const optionContainer = L.DomUtil.create('div', 'basemap-option-container');
            
            // Add active class if this is the current basemap
            if (name === currentBasemap) {
                optionContainer.classList.add('active');
            }
            
            // Create checkbox
            const checkbox = L.DomUtil.create('input', 'basemap-checkbox');
            checkbox.type = 'radio';
            checkbox.name = 'basemap-select';
            checkbox.value = name;
            checkbox.checked = (name === currentBasemap);
            
            // Create label
            const label = L.DomUtil.create('label', 'basemap-label');
            label.textContent = name;
            if (name === currentBasemap) {
                label.classList.add('active');
            }
            
            optionContainer.addEventListener('mouseover', () => {
                optionContainer.style.backgroundColor = '#f0f0f0';
            });
            
            optionContainer.addEventListener('mouseout', () => {
                // Reset based on whether this is the currently selected basemap
                const isCurrentBasemap = (name === currentBasemap);
                optionContainer.style.backgroundColor = isCurrentBasemap ? '#e8f4f8' : 'white';
            });
            
            optionContainer.addEventListener('click', () => {
                // Remove only the current active base map
                for (const [mapName, mapLayer] of Object.entries(baseMaps)) {
                    if (mapName === currentBasemap && map.hasLayer(mapLayer)) {
                        map.removeLayer(mapLayer);
                        break;
                    }
                }
                
                // Add the selected base map (it will be behind other layers)
                layer.addTo(map);
                // Move basemap to back so it stays behind other layers
                if (layer.setZIndex) {
                    layer.setZIndex(-100);
                }
                
                // Update current basemap
                currentBasemap = name;
                
                // Update all options to reflect the new active state
                Array.from(menu.querySelectorAll('.basemap-option-container')).forEach(opt => {
                    const optLabel = opt.querySelector('.basemap-label');
                    const optCheckbox = opt.querySelector('.basemap-checkbox');
                    
                    // Reset background color for all options
                    opt.style.backgroundColor = 'white';
                    
                    if (optCheckbox.value === name) {
                        opt.classList.add('active');
                        opt.style.backgroundColor = '#e8f4f8';
                        optCheckbox.checked = true;
                        optLabel.classList.add('active');
                    } else {
                        opt.classList.remove('active');
                        optCheckbox.checked = false;
                        optLabel.classList.remove('active');
                    }
                });
                
                L.DomEvent.stopPropagation(event);
            });
            
            optionContainer.appendChild(checkbox);
            optionContainer.appendChild(label);
            menu.appendChild(optionContainer);
        }
        
        container.appendChild(menu);
        
        // Toggle menu on button click
        button.addEventListener('click', (e) => {
            menu.classList.toggle('active');
            L.DomEvent.stopPropagation(e);
        });
        
        return container;
    }
});

map.addControl(new basemapsControl());


// Add a reset view button with magnifying glass icon
const resetControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('button', 'leaflet-control-reset', container);
        button.innerHTML = '<i class="fas fa-search"></i>';
        button.title = 'Zur Ausgangsansicht zurücksetzen';
        
        button.addEventListener('click', () => {
            map.setView([48.853492979702956, 8.485241719982184], 18);
        });
        
        return container;
    }
});

map.addControl(new resetControl());

// Set up sidebar button controls
document.addEventListener('DOMContentLoaded', () => {
    const djiBtn = document.getElementById('sidebar-dji-btn');
    const materialsBtn = document.getElementById('sidebar-materials-btn');
    const djiMenu = document.getElementById('dji-menu');
    const materialsMenu = document.getElementById('materials-menu');

    djiBtn.addEventListener('click', () => {
        const isDjiOpen = !djiMenu.classList.contains('collapsed');
        
        if (isDjiOpen) {
            // Close DJI menu
            djiMenu.classList.add('collapsed');
            djiBtn.classList.remove('active');
        } else {
            // Open DJI menu and close materials menu
            djiMenu.classList.remove('collapsed');
            materialsMenu.classList.add('collapsed');
            djiBtn.classList.add('active');
            materialsBtn.classList.remove('active');
        }
        
        // Trigger map resize to recalculate layout
        setTimeout(() => {
            map.invalidateSize();
        }, 310);
    });

    materialsBtn.addEventListener('click', () => {
        const isMaterialsOpen = !materialsMenu.classList.contains('collapsed');
        
        if (isMaterialsOpen) {
            // Close materials menu
            materialsMenu.classList.add('collapsed');
            materialsBtn.classList.remove('active');
        } else {
            // Open materials menu and close DJI menu
            materialsMenu.classList.remove('collapsed');
            djiMenu.classList.add('collapsed');
            materialsBtn.classList.add('active');
            djiBtn.classList.remove('active');
        }
        
        // Trigger map resize to recalculate layout
        setTimeout(() => {
            map.invalidateSize();
        }, 310);
    });
});

// Function to update markers based on visible materials menu items
function updateMarkers() {
    materialsLayer.clearLayers(); // Clear existing markers

    const visibleItems = Array.from(document.querySelectorAll('#materials-list li'))
        .filter(item => item.style.display !== 'none');

    visibleItems.forEach(item => {
        const materialName = item.getAttribute('data-name');
        const feature = materialsData.features.find(f => f.properties.material === materialName);

        if (feature && feature.geometry && feature.geometry.coordinates) {
            const [lng, lat] = feature.geometry.coordinates; // GeoJSON uses [longitude, latitude]

            // Add a blue circle marker for each visible material
            const marker = L.circleMarker([lat, lng], {
                color: 'blue',
                radius: 5
            }).addTo(materialsLayer).bindPopup(createPopup(feature.properties));

            // Add a tooltip to show the material name on hover
            marker.bindTooltip(feature.properties.material, {
                permanent: false,
                direction: 'top'
            });

            // Change color on hover
            marker.on('mouseover', () => {
                marker.setStyle({
                    color: 'orange',
                    radius: 7
                });
            });

            marker.on('mouseout', () => {
                // Only reset if not in a popup
                if (!marker.isPopupOpen()) {
                    marker.setStyle({
                        color: 'blue',
                        radius: 5
                    });
                }
            });

            // Highlight marker on click
            marker.on('click', () => {
                marker.setStyle({
                    color: 'red',
                    radius: 8
                });
            });

            // Reset marker style when popup closes
            marker.on('popupclose', () => {
                marker.setStyle({
                    color: 'blue',
                    radius: 5
                });
            });
        }
    });
}

let materialsData = [];

// Wait for materials_menu.js to load and populate the list, then initialize map markers
document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('materials-list');
    
    // Small delay to ensure materials_menu.js has finished loading
    setTimeout(() => {
        // Get materials data from materials menu items (already loaded by materials_menu.js)
        const materialsItems = listEl.querySelectorAll('li');
        
        if (materialsItems.length > 0) {
            // Fetch materials GeoJSON data once more to populate materialsData for the map
            fetch('data/geojson/materials_img_metadata.geojson')
                .then(response => response.json())
                .then(data => {
                    materialsData = data;
                    updateMarkers(); // Initialize markers after materials menu is ready
                })
                .catch(error => console.error('Error loading materials GeoJSON data:', error));
        } else {
            // If materials menu items are empty, try again after a delay
            setTimeout(() => {
                fetch('data/geojson/materials_img_metadata.geojson')
                    .then(response => response.json())
                    .then(data => {
                        materialsData = data;
                        updateMarkers();
                    })
                    .catch(error => console.error('Error loading materials GeoJSON data:', error));
            }, 500);
        }
    }, 100);
});

// Update markers whenever the materials menu filter changes
const filterEl = document.getElementById('materials-filter');
filterEl.addEventListener('input', updateMarkers);

// Initialize layer variables for GeoJSON data
let spectrometerTrackLayer = null;

// Remove GPX integration and add GeoJSON as a line
fetch('data/geojson/spectrometer_traj.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        spectrometerTrackLayer = L.geoJSON(geojsonData, {
            style: {
                color: 'green',
                weight: 4,
                opacity: 0.7
            },
            onEachFeature: function(feature, layer) {
                // Add tooltip for the track
                const properties = feature.properties;
                let tooltipContent = 'Spectrometermessungen Track';
                if (properties && Object.keys(properties).length > 0) {
                    tooltipContent = Object.entries(properties)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('<br>');
                }
                layer.bindTooltip(tooltipContent);
            }
        });

        // Dispatch custom event to notify materials_menu.js
        window.dispatchEvent(new Event('spectrometerTrackLoaded'));
    })
    .catch(error => console.error('Error loading GeoJSON data:', error));