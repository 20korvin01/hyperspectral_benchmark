// Initialize the map
const map = L.map('map', {
    center: [48.853492979702956, 8.485241719982184],
    zoom: 18
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

// Define a layer group for materials
const materialsLayer = L.layerGroup();

// Add the default base map (satellite)
satellite.addTo(map);

// Add layer control to switch between base maps
const baseMaps = {
    'Satellite': satellite,
    'Streets': streets
};

const overlays = {
    'Materials': materialsLayer
};

// Add the default layer control
const layerControl = L.control.layers(baseMaps, overlays).addTo(map);

// Ensure the materials layer is added to the map by default
materialsLayer.addTo(map);

// Add a reset view button with magnifying glass icon
const resetControl = L.Control.extend({
    options: {
        position: 'topleft'
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

// Add a fullscreen button
const fullscreenControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('button', 'leaflet-control-fullscreen', container);
        button.innerHTML = '<i class="fas fa-expand"></i>';
        button.title = 'Vollbildmodus';
        
        button.addEventListener('click', () => {
            const mapContainer = document.getElementById('map-container');
            if (!document.fullscreenElement) {
                mapContainer.requestFullscreen().catch(err => {
                    console.error('Fehler beim Aktivieren des Vollbildmodus:', err);
                });
                button.innerHTML = '<i class="fas fa-compress"></i>';
                button.title = 'Vollbildmodus beenden';
            } else {
                document.exitFullscreen();
                button.innerHTML = '<i class="fas fa-expand"></i>';
                button.title = 'Vollbildmodus';
            }
        });
        
        // Update button when fullscreen state changes
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                button.innerHTML = '<i class="fas fa-compress"></i>';
                button.title = 'Vollbildmodus beenden';
            } else {
                button.innerHTML = '<i class="fas fa-expand"></i>';
                button.title = 'Vollbildmodus';
            }
        });
        
        return container;
    }
});

map.addControl(new fullscreenControl());

// Function to update markers based on visible sidebar items
function updateMarkers() {
    materialsLayer.clearLayers(); // Clear existing markers

    const visibleItems = Array.from(document.querySelectorAll('#list li'))
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

// Wait for sidebar.js to load and populate the list, then initialize map markers
document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('list');
    
    // Small delay to ensure sidebar.js has finished loading
    setTimeout(() => {
        // Get materials data from sidebar items (already loaded by sidebar.js)
        const sidebarItems = listEl.querySelectorAll('li');
        
        if (sidebarItems.length > 0) {
            // Fetch materials GeoJSON data once more to populate materialsData for the map
            fetch('data/geojson/materials_img_metadata.geojson')
                .then(response => response.json())
                .then(data => {
                    materialsData = data;
                    updateMarkers(); // Initialize markers after sidebar is ready
                })
                .catch(error => console.error('Error loading materials GeoJSON data:', error));
        } else {
            // If sidebar items are empty, try again after a delay
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

// Update markers whenever the sidebar filter changes
const filterEl = document.getElementById('filter');
filterEl.addEventListener('input', updateMarkers);

// Remove GPX integration and add GeoJSON as a line
fetch('data/geojson/spectrometer_traj.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        const geojsonLayer = L.geoJSON(geojsonData, {
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

        // Add GeoJSON line to the existing layer control
        layerControl.addOverlay(geojsonLayer, 'Spectrometermessungen Track');
    })
    .catch(error => console.error('Error loading GeoJSON data:', error));

// Load materials polygons GeoJSON
fetch('data/geojson/materials_polygons.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        const polygonsLayer = L.geoJSON(geojsonData, {
            style: {
                color: 'purple',
                weight: 2,
                opacity: 0.6,
                fillOpacity: 0.2
            },
            onEachFeature: function(feature, layer) {
                // Add tooltip for each polygon
                const properties = feature.properties;
                let tooltipContent = 'Materialbereich';
                if (properties && properties.name) {
                    tooltipContent = properties.name;
                } else if (properties && Object.keys(properties).length > 0) {
                    tooltipContent = Object.entries(properties)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('<br>');
                }
                layer.bindTooltip(tooltipContent);

                // Change style on hover
                layer.on('mouseover', () => {
                    layer.setStyle({
                        color: 'orange',
                        weight: 3,
                        opacity: 0.9,
                        fillOpacity: 0.4
                    });
                });

                layer.on('mouseout', () => {
                    layer.setStyle({
                        color: 'purple',
                        weight: 2,
                        opacity: 0.6,
                        fillOpacity: 0.2
                    });
                });
            }
        });

        // Add materials polygons to the layer control (not added to map by default)
        layerControl.addOverlay(polygonsLayer, 'Materialbereich Polygone');
    })
    .catch(error => console.error('Error loading materials polygons GeoJSON data:', error));