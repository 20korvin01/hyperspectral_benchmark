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
// map.on('click', function(e) {
//     console.log('Angeklickte Koordinate:', e.latlng.lat, e.latlng.lng);
// });

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
        button.innerHTML = '<i class="bi bi-aspect-ratio"></i>';
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