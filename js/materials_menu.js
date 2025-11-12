(function () {
    const listEl = document.getElementById('materials-list');
    const filterEl = document.getElementById('materials-filter');
    let currentSort = 'name-asc';

    // Get existing checkbox elements from HTML
    const markersCheckbox = document.getElementById('materials-markers-checkbox');
    const spectrometerCheckbox = document.getElementById('materials-spectrometer-checkbox');

    // Function to update markers based on visible materials menu items
    function updateMarkers() {
        materialsLayer.clearLayers(); // Clear existing markers

        // Use the globally available materialsData
        if (!window.materialsData || !window.materialsData.features) {
            return; // Data not yet loaded
        }

        const visibleItems = Array.from(listEl.querySelectorAll('li'))
            .filter(item => item.style.display !== 'none');

        visibleItems.forEach(item => {
            const materialName = item.getAttribute('data-name');
            const feature = window.materialsData.features.find(f => f.properties.material === materialName);

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

    // Add event listener to toggle markers visibility
    if (markersCheckbox) {
        markersCheckbox.addEventListener('change', () => {
            if (markersCheckbox.checked) {
                materialsLayer.addTo(map);
            } else {
                map.removeLayer(materialsLayer);
            }
        });
    }

    // Add event listener to toggle spectrometer track visibility
    if (spectrometerCheckbox) {
        spectrometerCheckbox.addEventListener('change', () => {
            if (window.spectrometerTrackLayer) {
                if (spectrometerCheckbox.checked) {
                    window.spectrometerTrackLayer.addTo(map);
                } else {
                    map.removeLayer(window.spectrometerTrackLayer);
                }
            }
        });
    }

    // Listen for spectrometer track layer to be loaded
    window.addEventListener('spectrometerTrackLoaded', () => {
        window.spectrometerTrackLayer = window.spectrometerTrackLayer || spectrometerTrackLayer;
    });

    // Load Spectrometer Track GeoJSON
    let spectrometerTrackLayer = null;
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

            // Dispatch custom event to notify that track is loaded
            window.dispatchEvent(new Event('spectrometerTrackLoaded'));
        })
        .catch(error => console.error('Error loading spectrometer track GeoJSON data:', error));

    // Ensure the menu elements are accessible even when collapsed
    const materialsMenuEl = document.getElementById('materials-menu');
    if (!materialsMenuEl) {
        console.error('Materials menu element not found');
    }

    // Update material count label in the sort section
    const countLabel = document.getElementById('materials-count');

    function updateMaterialCount() {
        const visibleItems = Array.from(listEl.querySelectorAll('li')).filter(item => item.style.display !== 'none');
        countLabel.textContent = `${visibleItems.length} Material${visibleItems.length !== 1 ? 'ien' : ''}`;
    }

    filterEl.addEventListener('input', () => {
        const filterValue = filterEl.value.toLowerCase();
        const items = listEl.querySelectorAll('li');

        // Ensure no duplicates are added
        const uniqueItems = new Set();

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(filterValue)) {
                if (!uniqueItems.has(text)) {
                    item.style.display = '';
                    uniqueItems.add(text);
                } else {
                    item.style.display = 'none';
                }
            } else {
                item.style.display = 'none';
            }
        });
        updateMaterialCount();
        updateMarkers(); // Update markers when filter changes
    });

    const sortButtons = {
        'name-asc': document.getElementById('materials-sort-name-asc'),
        'name-desc': document.getElementById('materials-sort-name-desc')
    };

    Object.keys(sortButtons).forEach(sortKey => {
        sortButtons[sortKey].addEventListener('click', () => {
            currentSort = sortKey;
            sortList();
        });
    });

    function sortList() {
        const items = Array.from(listEl.querySelectorAll('li'));
        items.sort((a, b) => {
            const aValue = a.getAttribute('data-name');
            const bValue = b.getAttribute('data-name');
            if (currentSort === 'name-asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        items.forEach(item => listEl.appendChild(item));
    }

    // Clear the materials list before populating it
    listEl.innerHTML = '';

    // Load materials into the materials menu and populate materialsData for map markers
    let materialsData = {};
    fetch('data/geojson/materials_img_metadata.geojson')
        .then(response => response.json())
        .then(data => {
            // Store the complete GeoJSON data for use in map marker creation
            materialsData = data;
            
            // Make materialsData globally accessible for map.js
            window.materialsData = data;

            // Extract features from GeoJSON and get properties
            const items = data.features.map(feature => feature.properties);

            // 🔹 Namen vereinheitlichen (nutze 'material' feld)
            items.forEach(item => {
                item.cleanName = item.material || item.name || '';
            });

            // 🔹 Duplikate entfernen
            const uniqueData = [];
            const seen = new Set();
            items.forEach(item => {
                if (!seen.has(item.cleanName)) {
                    seen.add(item.cleanName);
                    uniqueData.push(item);
                }
            });

            // 🔹 Liste erstellen
            uniqueData.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item.cleanName;
                listItem.setAttribute('data-name', item.cleanName);
                listItem.addEventListener('click', () => {
                    // Find marker by material name instead of coordinates
                    const materialName = item.cleanName;
                    
                    materialsLayer.eachLayer(layer => {
                        // Get the material name from the popup if available
                        const markerPopup = layer.getPopup();
                        if (markerPopup) {
                            const popupContent = markerPopup.getContent();
                            // Extract material name from popup content (it's in the <b> tag)
                            const match = popupContent.match(/<b>([^<]+)<\/b>/);
                            const markerMaterialName = match ? match[1] : null;
                            
                            if (markerMaterialName === materialName) {
                                layer.setStyle({
                                    color: 'red',
                                    radius: 8
                                });
                                layer.openPopup();
                                layer.on('popupclose', () => {
                                    layer.setStyle({
                                        color: 'blue',
                                        radius: 5
                                    });
                                });
                            }
                        }
                    });
                });
                listEl.appendChild(listItem);
            });

            sortList();
            updateMaterialCount();
            updateMarkers(); // Initialize markers after materials data is loaded
            
            // Notify that materials data is loaded
            window.dispatchEvent(new Event('materialsDataLoaded'));
        })
        .catch(err => console.error('Fehler beim Laden der Materialdaten:', err));

})();
