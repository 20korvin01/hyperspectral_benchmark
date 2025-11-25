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
// map.on('click', function(e) {
//     console.log('Angeklickte Koordinate:', e.latlng.lat, e.latlng.lng);
// });

// Define base maps
const baseMaps = {
    'Satellite': satellite,
    'Streets': streets,
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
        button.innerHTML = '<i class="bi bi-aspect-ratio"></i>';
        button.title = 'Zur Ausgangsansicht zurücksetzen';
        
        button.addEventListener('click', () => {
            map.setView([48.853492979702956, 8.485241719982184], 18);
        });
        
        return container;
    }
});

map.addControl(new resetControl());

// Add measurement tool with Leaflet Draw
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Create SVG defs with hatch patterns
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('width', '0');
svg.setAttribute('height', '0');
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

// Create hatch patterns for each color
const hatchColors = [
    { id: 'hatch0', color: '#2980b9' },
    { id: 'hatch1', color: '#3498db' },
    { id: 'hatch2', color: '#5dade2' },
    { id: 'hatch3', color: '#85c1e2' },
    { id: 'hatch4', color: '#1b4965' },
    { id: 'hatch5', color: '#0d47a1' }
];

hatchColors.forEach(hatch => {
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', hatch.id);
    pattern.setAttribute('x', '0');
    pattern.setAttribute('y', '0');
    pattern.setAttribute('width', '8');
    pattern.setAttribute('height', '8');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '8');
    line.setAttribute('y2', '8');
    line.setAttribute('stroke', hatch.color);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('opacity', '0.3');
    
    pattern.appendChild(line);
    defs.appendChild(pattern);
});

svg.appendChild(defs);
document.body.appendChild(svg);

const drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
        polygon: true,
        polyline: true,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems,
        edit: true,
        remove: true
    }
});
map.addControl(drawControl);

// Handle drawn shapes for measurement
map.on('draw:created', function(e) {
    const layer = e.layer;
    drawnItems.addLayer(layer);
    updateMeasurements(layer);
});

map.on('draw:edited', function(e) {
    e.layers.eachLayer(function(layer) {
        updateMeasurements(layer);
    });
});

map.on('draw:deleted', function(e) {
    e.layers.eachLayer(function(layer) {
        // Remove distance labels
        if (layer.distanceLabels) {
            layer.distanceLabels.forEach(label => map.removeLayer(label));
            layer.distanceLabels = [];
        }
        // Remove area label
        if (layer.areaLabel) {
            map.removeLayer(layer.areaLabel);
            layer.areaLabel = null;
        }
    });
});

// Function to calculate and display measurements
function updateMeasurements(layer) {
    let measurement = '';
    
    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        // Polyline - calculate distance
        const distance = calculatePolylineDistance(layer);
        measurement = `Strecke: ${formatDistance(distance)}`;
        addDistanceLabels(layer, distance);
    } else if (layer instanceof L.Polygon) {
        // Polygon - calculate area and perimeter
        const area = calculatePolygonArea(layer);
        const perimeter = calculatePolylineDistance(layer);
        measurement = `Fläche: ${formatArea(area)} | Umfang: ${formatDistance(perimeter)}`;
        addDistanceLabels(layer, perimeter);
        addAreaLabel(layer, area, perimeter);
    }
}

// Add distance labels for each segment of a polyline or polygon
function addDistanceLabels(layer, totalDistance) {
    let latlngs = layer.getLatLngs();
    
    // For polygons, get the first array
    if (layer instanceof L.Polygon) {
        latlngs = latlngs[0];
    }
    
    // Determine color based on layer type and index
    let layerColor = getLayerColor(layer);
    
    // Remove existing labels if any
    if (layer.distanceLabels) {
        layer.distanceLabels.forEach(label => map.removeLayer(label));
    }
    layer.distanceLabels = [];
    
    // Set unified style for the layer
    if (layer.setStyle) {
        const allLayers = drawnItems.getLayers();
        const layerIndex = allLayers.indexOf(layer);
        const hatchId = `url(#hatch${layerIndex % 6})`;
        
        if (layer instanceof L.Polygon) {
            // For polygons: strong lines, hatched fill with pattern
            layer.setStyle({
                color: layerColor.main,
                weight: 3,
                opacity: 0.9,
                fill: true,
                fillColor: hatchId,
                fillOpacity: 0.3,
                lineCap: 'round',
                lineJoin: 'round'
            });
            
            // Apply hatch pattern to the SVG element
            setTimeout(() => {
                if (layer._path) {
                    layer._path.setAttribute('fill', hatchId);
                    layer._path.style.fillOpacity = '0.3';
                }
            }, 10);
        } else {
            // For polylines: solid lines
            layer.setStyle({
                color: layerColor.main,
                weight: 3,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
            });
        }
    }
    
    // Add labels for each segment
    for (let i = 0; i < latlngs.length - 1; i++) {
        const segmentDistance = latlngs[i].distanceTo(latlngs[i + 1]);
        const midpoint = L.latLng(
            (latlngs[i].lat + latlngs[i + 1].lat) / 2,
            (latlngs[i].lng + latlngs[i + 1].lng) / 2
        );
        
        const label = L.marker(midpoint, {
            icon: L.divIcon({
                className: 'distance-label',
                html: `<div class="distance-label-box" style="background: ${layerColor.label}; transform: translate(-50%, -50%);">${formatDistance(segmentDistance)}</div>`,
                iconSize: [null, null],
                iconAnchor: [0, 0]
            })
        }).addTo(map);
        
        layer.distanceLabels.push(label);
    }
    
    // For polygons, add label for the closing segment
    if (layer instanceof L.Polygon && latlngs.length > 0) {
        const lastSegmentDistance = latlngs[latlngs.length - 1].distanceTo(latlngs[0]);
        const midpoint = L.latLng(
            (latlngs[latlngs.length - 1].lat + latlngs[0].lat) / 2,
            (latlngs[latlngs.length - 1].lng + latlngs[0].lng) / 2
        );
        
        const label = L.marker(midpoint, {
            icon: L.divIcon({
                className: 'distance-label',
                html: `<div class="distance-label-box" style="background: ${layerColor.label}; transform: translate(-50%, -50%);">${formatDistance(lastSegmentDistance)}</div>`,
                iconSize: [null, null],
                iconAnchor: [0, 0]
            })
        }).addTo(map);
        
        layer.distanceLabels.push(label);
    }
}

// Get color based on layer index for visual distinction
function getLayerColor(layer) {
    const allLayers = drawnItems.getLayers();
    const layerIndex = allLayers.indexOf(layer);
    
    // Define a palette of blue tones
    const colors = [
        { main: '#2980b9', fill: 'rgba(41, 128, 185, 0.1)', label: 'rgba(41, 128, 185, 0.95)' },      // Dark blue
        { main: '#3498db', fill: 'rgba(52, 152, 219, 0.1)', label: 'rgba(52, 152, 219, 0.95)' },      // Bright blue
        { main: '#5dade2', fill: 'rgba(93, 173, 226, 0.1)', label: 'rgba(93, 173, 226, 0.95)' },      // Medium blue
        { main: '#85c1e2', fill: 'rgba(133, 193, 226, 0.1)', label: 'rgba(133, 193, 226, 0.95)' },    // Light blue
        { main: '#1b4965', fill: 'rgba(27, 73, 101, 0.1)', label: 'rgba(27, 73, 101, 0.95)' },        // Navy blue
        { main: '#0d47a1', fill: 'rgba(13, 71, 161, 0.1)', label: 'rgba(13, 71, 161, 0.95)' }         // Deep blue
    ];
    
    return colors[layerIndex % colors.length];
}

// Add area label in the center of a polygon
function addAreaLabel(layer, area, perimeter) {
    const latlngs = layer.getLatLngs()[0];
    
    // Calculate centroid (center) of the polygon
    const centroid = calculateCentroid(latlngs);
    
    // Remove existing area label if any
    if (layer.areaLabel) {
        map.removeLayer(layer.areaLabel);
    }
    
    const layerColor = getLayerColor(layer);
    const areaText = formatArea(area);
    const perimeterText = formatDistance(perimeter);
    
    // Create area label marker with centered icon
    const areaLabel = L.marker(centroid, {
        icon: L.divIcon({
            className: 'area-label',
            html: `<div class="area-label-box" style="background: ${layerColor.label}; font-size: 11px; padding: 2px 4px; transform: translate(-50%, -50%);">A: ${areaText} | U: ${perimeterText}</div>`,
            iconSize: [null, null],
            iconAnchor: [0, 0]
        })
    }).addTo(map);
    
    layer.areaLabel = areaLabel;
}

// Calculate the centroid (center point) of a polygon
function calculateCentroid(latlngs) {
    let sumLat = 0;
    let sumLng = 0;
    
    for (let i = 0; i < latlngs.length; i++) {
        sumLat += latlngs[i].lat;
        sumLng += latlngs[i].lng;
    }
    
    return L.latLng(sumLat / latlngs.length, sumLng / latlngs.length);
}

// Calculate polyline distance using Haversine formula
function calculatePolylineDistance(layer) {
    let latlngs = layer.getLatLngs();
    
    // For polygons, getLatLngs() returns an array of arrays
    if (layer instanceof L.Polygon) {
        latlngs = latlngs[0];
    }
    
    let distance = 0;
    
    for (let i = 0; i < latlngs.length - 1; i++) {
        distance += latlngs[i].distanceTo(latlngs[i + 1]);
    }
    
    // For polygons, add distance from last point back to first point to close the loop
    if (layer instanceof L.Polygon && latlngs.length > 0) {
        distance += latlngs[latlngs.length - 1].distanceTo(latlngs[0]);
    }
    
    return distance;
}

// Calculate polygon area using Shoelace formula with coordinate projection
function calculatePolygonArea(layer) {
    const latlngs = layer.getLatLngs()[0];
    const radius = 6371000; // Earth radius in meters
    let area = 0;
    
    for (let i = 0; i < latlngs.length; i++) {
        const j = (i + 1) % latlngs.length;
        const lat1 = (latlngs[i].lat * Math.PI) / 180;
        const lat2 = (latlngs[j].lat * Math.PI) / 180;
        const lng1 = (latlngs[i].lng * Math.PI) / 180;
        const lng2 = (latlngs[j].lng * Math.PI) / 180;
        
        area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    
    area = Math.abs((area * radius * radius) / 2);
    return area;
}

// Format distance for display
function formatDistance(meters) {
    if (meters >= 1000) {
        return (meters / 1000).toFixed(2) + ' km';
    }
    return meters.toFixed(2) + ' m';
}

// Format area for display
function formatArea(squareMeters) {
    if (squareMeters >= 1000000) {
        return (squareMeters / 1000000).toFixed(2) + ' km²';
    } else if (squareMeters >= 10000) {
        return (squareMeters / 10000).toFixed(2) + ' ha';
    }
    return squareMeters.toFixed(2) + ' m²';
}

// Set up sidebar button controls
document.addEventListener('DOMContentLoaded', () => {
    const djiBtn = document.getElementById('sidebar-dji-btn');
    const materialsBtn = document.getElementById('sidebar-materials-btn');
    const hyspexBtn = document.getElementById('sidebar-hyspex-btn');
    const djiMenu = document.getElementById('dji-menu');
    const materialsMenu = document.getElementById('materials-menu');
    const hyspexMenu = document.getElementById('hyspex-menu');
    
    // Close buttons
    const materialsCloseBtn = document.getElementById('materials-menu-close');
    const djiCloseBtn = document.getElementById('dji-menu-close');
    const hyspexCloseBtn = document.getElementById('hyspex-menu-close');

    // Helper function to close all menus
    function closeAllMenus() {
        djiMenu.classList.add('collapsed');
        materialsMenu.classList.add('collapsed');
        hyspexMenu.classList.add('collapsed');
        djiBtn.classList.remove('active');
        materialsBtn.classList.remove('active');
        hyspexBtn.classList.remove('active');
    }

    // Helper function to trigger map resize
    function resizeMap() {
        setTimeout(() => {
            map.invalidateSize();
        }, 310);
    }

    djiBtn.addEventListener('click', () => {
        const isDjiOpen = !djiMenu.classList.contains('collapsed');
        
        if (isDjiOpen) {
            // Close DJI menu
            djiMenu.classList.add('collapsed');
            djiBtn.classList.remove('active');
        } else {
            // Close all menus first
            closeAllMenus();
            // Open DJI menu
            djiMenu.classList.remove('collapsed');
            djiBtn.classList.add('active');
        }
        
        resizeMap();
    });

    materialsBtn.addEventListener('click', () => {
        const isMaterialsOpen = !materialsMenu.classList.contains('collapsed');
        
        if (isMaterialsOpen) {
            // Close materials menu
            materialsMenu.classList.add('collapsed');
            materialsBtn.classList.remove('active');
        } else {
            // Close all menus first
            closeAllMenus();
            // Open materials menu
            materialsMenu.classList.remove('collapsed');
            materialsBtn.classList.add('active');
        }
        
        resizeMap();
    });

    hyspexBtn.addEventListener('click', () => {
        const isHyspexOpen = !hyspexMenu.classList.contains('collapsed');
        
        if (isHyspexOpen) {
            // Close HySpex menu
            hyspexMenu.classList.add('collapsed');
            hyspexBtn.classList.remove('active');
        } else {
            // Close all menus first
            closeAllMenus();
            // Open HySpex menu
            hyspexMenu.classList.remove('collapsed');
            hyspexBtn.classList.add('active');
        }
        
        resizeMap();
    });
    
    // Close button event listeners
    if (materialsCloseBtn) {
        materialsCloseBtn.addEventListener('click', () => {
            materialsMenu.classList.add('collapsed');
            materialsBtn.classList.remove('active');
            resizeMap();
        });
    }
    
    if (djiCloseBtn) {
        djiCloseBtn.addEventListener('click', () => {
            djiMenu.classList.add('collapsed');
            djiBtn.classList.remove('active');
            resizeMap();
        });
    }
    
    if (hyspexCloseBtn) {
        hyspexCloseBtn.addEventListener('click', () => {
            hyspexMenu.classList.add('collapsed');
            hyspexBtn.classList.remove('active');
            resizeMap();
        });
    }
});