(function () {
    const listEl = document.getElementById('materials-list');
    const filterEl = document.getElementById('materials-filter');
    let currentSort = 'name-asc';

    // Add a checkbox to toggle material markers visibility
    const markersCheckboxContainer = document.createElement('div');
    markersCheckboxContainer.id = 'materials-markers-checkbox-container';

    const markersCheckbox = document.createElement('input');
    markersCheckbox.type = 'checkbox';
    markersCheckbox.id = 'materials-markers-checkbox';
    markersCheckbox.checked = true;

    const markersLabel = document.createElement('label');
    markersLabel.htmlFor = 'materials-markers-checkbox';
    markersLabel.textContent = 'Materialmarker anzeigen';

    markersCheckboxContainer.appendChild(markersCheckbox);
    markersCheckboxContainer.appendChild(markersLabel);

    // Get the materials menu element to insert the checkbox after the title
    const materialsMenu = document.getElementById('materials-menu');
    const filterSection = document.querySelector('.materials-filter-section');
    materialsMenu.insertBefore(markersCheckboxContainer, filterSection);

    // Add event listener to toggle markers visibility
    markersCheckbox.addEventListener('change', () => {
        if (markersCheckbox.checked) {
            materialsLayer.addTo(map);
        } else {
            map.removeLayer(materialsLayer);
        }
    });

    // Add a checkbox to toggle spectrometer track visibility
    const spectrometerCheckboxContainer = document.createElement('div');
    spectrometerCheckboxContainer.id = 'materials-spectrometer-checkbox-container';
    spectrometerCheckboxContainer.className = 'materials-layer-checkbox-container';

    const spectrometerCheckbox = document.createElement('input');
    spectrometerCheckbox.type = 'checkbox';
    spectrometerCheckbox.id = 'materials-spectrometer-checkbox';
    spectrometerCheckbox.checked = false;

    const spectrometerLabel = document.createElement('label');
    spectrometerLabel.htmlFor = 'materials-spectrometer-checkbox';
    spectrometerLabel.textContent = 'Spektrometer Track';

    spectrometerCheckboxContainer.appendChild(spectrometerCheckbox);
    spectrometerCheckboxContainer.appendChild(spectrometerLabel);
    materialsMenu.insertBefore(spectrometerCheckboxContainer, filterSection);

    // Add event listener to toggle spectrometer track visibility
    spectrometerCheckbox.addEventListener('change', () => {
        if (window.spectrometerTrackLayer) {
            if (spectrometerCheckbox.checked) {
                window.spectrometerTrackLayer.addTo(map);
            } else {
                map.removeLayer(window.spectrometerTrackLayer);
            }
        }
    });

    // Listen for spectrometer track layer to be loaded
    window.addEventListener('spectrometerTrackLoaded', () => {
        window.spectrometerTrackLayer = window.spectrometerTrackLayer || spectrometerTrackLayer;
    });

    // Add a checkbox to toggle materials polygons visibility
    const polygonsCheckboxContainer = document.createElement('div');
    polygonsCheckboxContainer.id = 'materials-polygons-checkbox-container';
    polygonsCheckboxContainer.className = 'materials-layer-checkbox-container';

    const polygonsCheckbox = document.createElement('input');
    polygonsCheckbox.type = 'checkbox';
    polygonsCheckbox.id = 'materials-polygons-checkbox';
    polygonsCheckbox.checked = false;

    const polygonsLabel = document.createElement('label');
    polygonsLabel.htmlFor = 'materials-polygons-checkbox';
    polygonsLabel.textContent = 'Materialbereich Polygone';

    polygonsCheckboxContainer.appendChild(polygonsCheckbox);
    polygonsCheckboxContainer.appendChild(polygonsLabel);
    materialsMenu.insertBefore(polygonsCheckboxContainer, filterSection);

    // Add event listener to toggle materials polygons visibility
    polygonsCheckbox.addEventListener('change', () => {
        if (window.materialsPolygonsLayer) {
            if (polygonsCheckbox.checked) {
                window.materialsPolygonsLayer.addTo(map);
            } else {
                map.removeLayer(window.materialsPolygonsLayer);
            }
        }
    });

    // Listen for materials polygons layer to be loaded
    window.addEventListener('materialsPolygonsLoaded', () => {
        window.materialsPolygonsLayer = window.materialsPolygonsLayer || materialsPolygonsLayer;
    });

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

    // Load materials into the materials menu
    fetch('data/geojson/materials_img_metadata.geojson')
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(err => console.error('Fehler beim Laden der Materialdaten:', err));

})();
