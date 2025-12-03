(function () {
    // Get existing checkbox elements from HTML
    const orthophotoCheckbox = document.getElementById('dji-orthophoto-checkbox');
    const dsmCheckbox = document.getElementById('dji-dsm-checkbox');
    const dtmCheckbox = document.getElementById('dji-dtm-checkbox');
    const djiPointsCheckbox = document.getElementById('dji-points-checkbox');
    const djiToggleBtn = document.getElementById('dji-data-toggle-btn');

    // Global variable to store current DJI image data
    let currentDjiImage = null;

    // Toggle DJI data containers visibility
    let isDjiDataExpanded = false; // Default collapsed state
    
    if (djiToggleBtn) {
        djiToggleBtn.addEventListener('click', function() {
            isDjiDataExpanded = !isDjiDataExpanded;
            const containers = document.querySelectorAll('.dji-layer-checkbox-container');
            const wrapper = document.getElementById('dji-data-wrapper');
            const chevron = djiToggleBtn.querySelector('.dji-badge-chevron');
            
            containers.forEach(container => {
                container.classList.toggle('collapsed', !isDjiDataExpanded);
            });
            
            if (wrapper) {
                wrapper.classList.toggle('expanded', isDjiDataExpanded);
            }
            
            if (chevron) {
                chevron.classList.toggle('rotated', isDjiDataExpanded);
            }
        });
        
        // Initialize with collapsed state
        const containers = document.querySelectorAll('.dji-layer-checkbox-container');
        containers.forEach(container => {
            container.classList.add('collapsed');
        });
    }

    // Create the orthophoto layer using XYZ tiles
    const orthophotoLayer = L.tileLayer('img/ortho_tiles/20251105/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 16,
        tms: false,
        attribution: 'DJI Orthophoto',
        // Use zoomOffset to keep displaying zoom level 20 tiles when zooming beyond level 20
        zoomOffset: 0,
        maxNativeZoom: 20
    });

    // Add event listener to toggle orthophoto visibility
    if (orthophotoCheckbox) {
        orthophotoCheckbox.addEventListener('change', () => {
            if (orthophotoCheckbox.checked) {
                orthophotoLayer.addTo(map);
            } else {
                map.removeLayer(orthophotoLayer);
            }
        });
    }

    // Create the DSM layer using XYZ tiles
    const dsmLayer = L.tileLayer('img/dsm_tiles/20251105/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 15,
        tms: false,
        attribution: 'DJI DSM',
        zoomOffset: 0,
        maxNativeZoom: 20
    });

    // Add event listener to toggle DSM visibility
    if (dsmCheckbox) {
        dsmCheckbox.addEventListener('change', () => {
            if (dsmCheckbox.checked) {
                dsmLayer.addTo(map);
            } else {
                map.removeLayer(dsmLayer);
            }
        });
    }

    // Create the DTM layer using XYZ tiles
    const dtmLayer = L.tileLayer('img/dtm_tiles/20251105/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 15,
        tms: false,
        attribution: 'DJI DTM',
        zoomOffset: 0,
        maxNativeZoom: 20
    });

    // Add event listener to toggle DTM visibility
    if (dtmCheckbox) {
        dtmCheckbox.addEventListener('change', () => {
            if (dtmCheckbox.checked) {
                dtmLayer.addTo(map);
            } else {
                map.removeLayer(dtmLayer);
            }
        });
    }

    // Create a layer group for DJI image metadata points
    let djiPointsLayer = L.layerGroup();
    
    // Function to get color based on UTC time
    function getColorByTime(utcTime, allTimes) {
        if (!utcTime || !allTimes || allTimes.length === 0) {
            return { fill: '#808080', stroke: '#505050' }; // Gray default
        }
        
        // Find min and max times to normalize
        const minTime = Math.min(...allTimes);
        const maxTime = Math.max(...allTimes);
        const timeRange = maxTime - minTime;
        
        // Normalize time to 0-1
        const normalized = timeRange === 0 ? 0.5 : (utcTime - minTime) / timeRange;
        
        // Color gradient: Blue (0) -> Cyan -> Green -> Yellow -> Red (1)
        let r, g, b;
        
        if (normalized < 0.25) {
            // Blue to Cyan
            const t = normalized / 0.25;
            r = 0;
            g = Math.round(255 * t);
            b = 255;
        } else if (normalized < 0.5) {
            // Cyan to Green
            const t = (normalized - 0.25) / 0.25;
            r = 0;
            g = 255;
            b = Math.round(255 * (1 - t));
        } else if (normalized < 0.75) {
            // Green to Yellow
            const t = (normalized - 0.5) / 0.25;
            r = Math.round(255 * t);
            g = 255;
            b = 0;
        } else {
            // Yellow to Red
            const t = (normalized - 0.75) / 0.25;
            r = 255;
            g = Math.round(255 * (1 - t));
            b = 0;
        }
        
        const fill = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        const darkerR = Math.max(0, r - 80);
        const darkerG = Math.max(0, g - 80);
        const darkerB = Math.max(0, b - 80);
        const stroke = '#' + [darkerR, darkerG, darkerB].map(x => x.toString(16).padStart(2, '0')).join('');
        
        return { fill, stroke };
    }
    
    // Load and parse DJI image metadata GeoJSON
    let djiPointsData = null;
    fetch('data/geojson/20251105/dji_imgs_metadata.geojson')
        .then(response => response.json())
        .then(data => {
            djiPointsData = data;
            
            // Extract all UTC times for normalization
            const allTimes = data.features
                .map(f => f.properties.utc_time)
                .filter(t => t !== null && t !== undefined);
            
            // Add GeoJSON layer with styling
            L.geoJSON(data, {
                pointToLayer: function(feature, latlng) {
                    const props = feature.properties;
                    const colors = getColorByTime(props.utc_time, allTimes);
                    
                    // Create circle markers for each image point
                    const marker = L.circleMarker(latlng, {
                        radius: 4,
                        fillColor: colors.fill,
                        color: colors.stroke,
                        weight: 1.5,
                        opacity: 0.9,
                        fillOpacity: 0.7
                    });
                    
                    // Store original style for reset
                    marker.originalStyle = {
                        radius: 4,
                        fillColor: colors.fill,
                        color: colors.stroke,
                        weight: 1.5,
                        opacity: 0.9,
                        fillOpacity: 0.7
                    };
                    
                    // Add click event to open modal
                    marker.on('click', function() {
                        openDjiImageModal(props);
                    });
                    
                    // Add tooltip for filename
                    marker.bindTooltip(props.filename || 'Image Point', {
                        permanent: false,
                        direction: 'top'
                    });
                    
                    // Add hover effects
                    marker.on('mouseover', function() {
                        this.setStyle({
                            radius: 7,
                            weight: 2.5,
                            opacity: 1,
                            fillOpacity: 0.85
                        });
                        this.bringToFront();
                    });
                    
                    marker.on('mouseout', function() {
                        this.setStyle(this.originalStyle);
                    });
                    
                    return marker;
                }
            }).addTo(djiPointsLayer);
        })
        .catch(error => console.error('Error loading DJI image metadata:', error));
    
    // Function to open DJI image modal
    function openDjiImageModal(props) {
        currentDjiImage = props;
        
        // Set title
        document.getElementById('dji-image-modal-title').textContent = props.filename || 'DJI Bild Details';
        
        // Populate body with the popup content
        const modalBody = document.getElementById('dji-image-modal-body');
        modalBody.innerHTML = createImagePopup(props);
        
        // Show modal
        const modal = document.getElementById('dji-image-modal');
        modal.classList.add('active');
    }

    // Function to create formatted popup content
    function createImagePopup(props) {
        const formatValue = (value, unit = '') => {
            if (value === null || value === undefined) return 'N/A';
            if (typeof value === 'number') return value.toFixed(2) + unit;
            return value + unit;
        };

        return `
            <div class="dji-image-popup-content">
                <div class="popup-sections-grid">
                    <div class="popup-section">
                        <div class="section-title">Kamera</div>
                        <table class="popup-table">
                            <tr>
                                <td class="label">Modell:</td>
                                <td class="value">${props.camera_model || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td class="label">Band:</td>
                                <td class="value">${props.band_name || 'N/A'}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="popup-section">
                        <div class="section-title">Lage- & Höhengenauigkeit</div>
                        <table class="popup-table">
                            <tr>
                                <td class="label">XY Std.abw.:</td>
                                <td class="value">${formatValue(props.gps_xy_stddev, ' m')}</td>
                            </tr>
                            <tr>
                                <td class="label">Z Std.abw.:</td>
                                <td class="value">${formatValue(props.gps_z_stddev, ' m')}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="popup-section">
                        <div class="section-title">Höhe & Orientierung</div>
                        <table class="popup-table">
                            <tr>
                                <td class="label">Höhe:</td>
                                <td class="value">${formatValue(props.altitude)} m</td>
                            </tr>
                            <tr>
                                <td class="label">Gier:</td>
                                <td class="value">${formatValue(props.yaw)}°</td>
                            </tr>
                            <tr>
                                <td class="label">Neigung:</td>
                                <td class="value">${formatValue(props.pitch)}°</td>
                            </tr>
                            <tr>
                                <td class="label">Rolle:</td>
                                <td class="value">${formatValue(props.roll)}°</td>
                            </tr>
                        </table>
                    </div>
                    <div class="popup-section">
                        <div class="section-title">Belichtungsparameter</div>
                        <table class="popup-table">
                            <tr>
                                <td class="label">Blende:</td>
                                <td class="value">f/${formatValue(props.fnumber)}</td>
                            </tr>
                            <tr>
                                <td class="label">ISO:</td>
                                <td class="value">${formatValue(props.iso_speed)}</td>
                            </tr>
                            <tr>
                                <td class="label">Belichtungs-<br>zeit:</td>
                                <td class="value">${formatValue(props.exposure_time)} s</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Add event listener to toggle DJI points visibility
    if (djiPointsCheckbox) {
        djiPointsCheckbox.addEventListener('change', () => {
            if (djiPointsCheckbox.checked) {
                djiPointsLayer.addTo(map);
            } else {
                map.removeLayer(djiPointsLayer);
            }
        });
    }

    // Ensure the menu elements are accessible even when collapsed
    const djiMenuEl = document.getElementById('dji-menu');
    if (!djiMenuEl) {
        console.error('DJI menu element not found');
    }

    // Initialize modal close button
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('dji-image-modal');
        const closeButton = document.querySelector('.dji-image-modal-close');
        
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

})();
