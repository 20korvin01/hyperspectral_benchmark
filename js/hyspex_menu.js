(function () {
    // Toggle HySpex data containers visibility (5.11.2025)
    let isHySpexDataExpanded = false; // Default collapsed state
    const hyspexToggleBtn = document.getElementById('hyspex-data-toggle-btn');
    
    if (hyspexToggleBtn) {
        hyspexToggleBtn.addEventListener('click', function() {
            isHySpexDataExpanded = !isHySpexDataExpanded;
            const containers = document.querySelectorAll('#hyspex-data-wrapper > div');
            const wrapper = document.getElementById('hyspex-data-wrapper');
            const chevron = hyspexToggleBtn.querySelector('.hyspex-badge-chevron');
            
            containers.forEach(container => {
                if (container.classList.contains('hyspex-layer-checkbox-container') || 
                    container.classList.contains('hyspex-spectral-container')) {
                    container.classList.toggle('collapsed', !isHySpexDataExpanded);
                }
            });
            
            if (wrapper) {
                wrapper.classList.toggle('expanded', isHySpexDataExpanded);
            }
            
            if (chevron) {
                chevron.classList.toggle('rotated', isHySpexDataExpanded);
            }
        });
        
        // Initialize with collapsed state
        const containers = document.querySelectorAll('#hyspex-data-wrapper > div');
        containers.forEach(container => {
            if (container.classList.contains('hyspex-layer-checkbox-container') || 
                container.classList.contains('hyspex-spectral-container')) {
                container.classList.add('collapsed');
            }
        });
    }

    // Toggle HySpex data containers visibility (3.12.2025)
    let isHySpexDataExpanded2 = false; // Default collapsed state
    const hyspexToggleBtn2 = document.getElementById('hyspex-data-toggle-btn-2');
    
    if (hyspexToggleBtn2) {
        hyspexToggleBtn2.addEventListener('click', function() {
            isHySpexDataExpanded2 = !isHySpexDataExpanded2;
            const containers2 = document.querySelectorAll('#hyspex-data-wrapper-2 > div');
            const wrapper2 = document.getElementById('hyspex-data-wrapper-2');
            const chevron2 = hyspexToggleBtn2.querySelector('.hyspex-badge-chevron-2');
            
            containers2.forEach(container => {
                if (container.classList.contains('hyspex-layer-checkbox-container') || 
                    container.classList.contains('hyspex-spectral-container')) {
                    container.classList.toggle('collapsed', !isHySpexDataExpanded2);
                }
            });
            
            if (wrapper2) {
                wrapper2.classList.toggle('expanded', isHySpexDataExpanded2);
            }
            
            if (chevron2) {
                chevron2.classList.toggle('rotated', isHySpexDataExpanded2);
            }
        });
        
        // Initialize with collapsed state
        const containers2 = document.querySelectorAll('#hyspex-data-wrapper-2 > div');
        containers2.forEach(container => {
            if (container.classList.contains('hyspex-layer-checkbox-container') || 
                container.classList.contains('hyspex-spectral-container')) {
                container.classList.add('collapsed');
            }
        });
    }

    // Initialize group toggle state (stored in localStorage for persistence)
    const spectralGroupState = localStorage.getItem('hyspex-spectral-expanded') !== 'false';
    const spectralGroupState2 = localStorage.getItem('hyspex-spectral-expanded-2') !== 'false';

    // Get group toggle button and content container (5.11.2025)
    const spectralGroupToggle = document.getElementById('hyspex-spectral-group-toggle');
    const spectralGroupContent = document.getElementById('hyspex-spectral-group-content');

    // Get group toggle button and content container (3.12.2025)
    const spectralGroupToggle2 = document.getElementById('hyspex-spectral-group-toggle-2');
    const spectralGroupContent2 = document.getElementById('hyspex-spectral-group-content-2');

    // Initialize group state (5.11.2025)
    function initializeGroupState() {
        if (!spectralGroupState && spectralGroupContent) {
            spectralGroupContent.classList.add('collapsed');
            // Update icon state
            const icon = document.querySelector('#hyspex-spectral-group-toggle .hyspex-spectral-toggle-icon');
            if (icon) icon.classList.add('collapsed');
            // Update header state
            if (spectralGroupToggle) spectralGroupToggle.classList.add('collapsed');
        }
    }

    // Initialize group state (3.12.2025)
    function initializeGroupState2() {
        if (!spectralGroupState2 && spectralGroupContent2) {
            spectralGroupContent2.classList.add('collapsed');
            // Update icon state
            const icon = document.querySelector('#hyspex-spectral-group-toggle-2 .hyspex-spectral-toggle-icon');
            if (icon) icon.classList.add('collapsed');
            // Update header state
            if (spectralGroupToggle2) spectralGroupToggle2.classList.add('collapsed');
        }
    }

    // Set up group toggle event listener (5.11.2025)
    if (spectralGroupToggle) {
        spectralGroupToggle.addEventListener('click', () => {
            if (spectralGroupContent) {
                spectralGroupContent.classList.toggle('collapsed');
                spectralGroupToggle.classList.toggle('collapsed');
                
                // Toggle icon state
                const icon = spectralGroupToggle.querySelector('.hyspex-spectral-toggle-icon');
                if (icon) icon.classList.toggle('collapsed');

                localStorage.setItem('hyspex-spectral-expanded', !spectralGroupContent.classList.contains('collapsed'));
            }
        });
    }

    // Set up group toggle event listener (3.12.2025)
    if (spectralGroupToggle2) {
        spectralGroupToggle2.addEventListener('click', () => {
            if (spectralGroupContent2) {
                spectralGroupContent2.classList.toggle('collapsed');
                spectralGroupToggle2.classList.toggle('collapsed');
                
                // Toggle icon state
                const icon = spectralGroupToggle2.querySelector('.hyspex-spectral-toggle-icon');
                if (icon) icon.classList.toggle('collapsed');

                localStorage.setItem('hyspex-spectral-expanded-2', !spectralGroupContent2.classList.contains('collapsed'));
            }
        });
    }

    // Get existing checkbox elements from HTML (5.11.2025)
    const trajectoryVnirAllCheckbox = document.getElementById('hyspex-trajectory-vnir-all-checkbox');
    const trajectoryVnirEventCheckbox = document.getElementById('hyspex-trajectory-vnir-event-checkbox');
    const trajectorySwirAllCheckbox = document.getElementById('hyspex-trajectory-swir-all-checkbox');
    const trajectorySwirEventCheckbox = document.getElementById('hyspex-trajectory-swir-event-checkbox');

    // Get existing checkbox elements from HTML (3.12.2025)
    const trajectoryVnirAllCheckbox2 = document.getElementById('hyspex-trajectory-vnir-all-checkbox-2');
    const trajectoryVnirEventCheckbox2 = document.getElementById('hyspex-trajectory-vnir-event-checkbox-2');
    const trajectorySwirAllCheckbox2 = document.getElementById('hyspex-trajectory-swir-all-checkbox-2');
    const trajectorySwirEventCheckbox2 = document.getElementById('hyspex-trajectory-swir-event-checkbox-2');

    // Initialize layer variables for HySpex trajectories (5.11.2025)
    let hyspexTrajectoryVnirAllLayer = null;
    let hyspexTrajectoryVnirEventLayer = null;
    let hyspexTrajectorySwirAllLayer = null;
    let hyspexTrajectorySwirEventLayer = null;

    // Initialize layer variables for HySpex trajectories (3.12.2025)
    let hyspexTrajectoryVnirAllLayer2 = null;
    let hyspexTrajectoryVnirEventLayer2 = null;
    let hyspexTrajectorySwirAllLayer2 = null;
    let hyspexTrajectorySwirEventLayer2 = null;

    // Load HySpex trajectory VNIR All GeoJSON (5.11.2025)
    fetch('data/geojson/20251105/VNIR_all_downsampled100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryVnirAllLayer = L.geoJSON(geojsonData, {
                style: {
                    color: '#FFA500',
                    weight: 3,
                    opacity: 0.8
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex VNIR | All';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectoryVnirAllLoaded'));
        })
        .catch(error => console.error('Error loading HySpex VNIR All trajectory GeoJSON data:', error));

    // Load HySpex trajectory VNIR Event GeoJSON (Points) (5.11.2025)
    fetch('data/geojson/20251105/VNIR_event_points.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryVnirEventLayer = L.geoJSON(geojsonData, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        color: '#FFB84D',
                        fillColor: '#FFB84D',
                        fillOpacity: 0.6,
                        radius: 3,
                        weight: 1
                    });
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex VNIR | Event';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectoryVnirEventLoaded'));
        })
        .catch(error => console.error('Error loading HySpex VNIR Event points GeoJSON data:', error));

    // Load HySpex trajectory SWIR All GeoJSON (5.11.2025)
    fetch('data/geojson/20251105/SWIR_all_downsampled100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectorySwirAllLayer = L.geoJSON(geojsonData, {
                style: {
                    color: '#E68D00',
                    weight: 3,
                    opacity: 0.8
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex SWIR | All';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectorySwirAllLoaded'));
        })
        .catch(error => console.error('Error loading HySpex SWIR All trajectory GeoJSON data:', error));

    // Load HySpex trajectory SWIR Event GeoJSON (Points) (5.11.2025)
    fetch('data/geojson/20251105/SWIR_event_points.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectorySwirEventLayer = L.geoJSON(geojsonData, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        color: '#D97C00',
                        fillColor: '#D97C00',
                        fillOpacity: 0.6,
                        radius: 3,
                        weight: 1
                    });
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex SWIR | Event';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectorySwirEventLoaded'));
        })
        .catch(error => console.error('Error loading HySpex SWIR Event points GeoJSON data:', error));

    // Load HySpex trajectory VNIR All GeoJSON (3.12.2025)
    fetch('data/geojson/20251203/VNIR_all_downsampled100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryVnirAllLayer2 = L.geoJSON(geojsonData, {
                style: {
                    color: '#FFA500',
                    weight: 3,
                    opacity: 0.8
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex VNIR | All';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectoryVnirAllLoaded2'));
        })
        .catch(error => console.error('Error loading HySpex VNIR All trajectory GeoJSON data (20251203):', error));

    // Load HySpex trajectory VNIR Event GeoJSON (Points) (3.12.2025)
    fetch('data/geojson/20251203/VNIR_event_points.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryVnirEventLayer2 = L.geoJSON(geojsonData, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        color: '#FFB84D',
                        fillColor: '#FFB84D',
                        fillOpacity: 0.6,
                        radius: 3,
                        weight: 1
                    });
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex VNIR | Event';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectoryVnirEventLoaded2'));
        })
        .catch(error => console.error('Error loading HySpex VNIR Event points GeoJSON data (20251203):', error));

    // Load HySpex trajectory SWIR All GeoJSON (3.12.2025)
    fetch('data/geojson/20251203/SWIR_all_downsampled100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectorySwirAllLayer2 = L.geoJSON(geojsonData, {
                style: {
                    color: '#E68D00',
                    weight: 3,
                    opacity: 0.8
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex SWIR | All';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectorySwirAllLoaded2'));
        })
        .catch(error => console.error('Error loading HySpex SWIR All trajectory GeoJSON data (20251203):', error));

    // Load HySpex trajectory SWIR Event GeoJSON (Points) (3.12.2025)
    fetch('data/geojson/20251203/SWIR_event_points.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectorySwirEventLayer2 = L.geoJSON(geojsonData, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        color: '#D97C00',
                        fillColor: '#D97C00',
                        fillOpacity: 0.6,
                        radius: 3,
                        weight: 1
                    });
                },
                onEachFeature: function(feature, layer) {
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex SWIR | Event';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });
            window.dispatchEvent(new Event('hyspexTrajectorySwirEventLoaded2'));
        })
        .catch(error => console.error('Error loading HySpex SWIR Event points GeoJSON data (20251203):', error));

    // Initialize group state after DOM is ready
    setTimeout(() => {
        initializeGroupState();
        initializeGroupState2();
    }, 100);

    // Add event listener to toggle HySpex VNIR All trajectory visibility (5.11.2025)
    if (trajectoryVnirAllCheckbox) {
        trajectoryVnirAllCheckbox.addEventListener('change', () => {
            if (hyspexTrajectoryVnirAllLayer) {
                if (trajectoryVnirAllCheckbox.checked) {
                    hyspexTrajectoryVnirAllLayer.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryVnirAllLayer);
                }
            }
        });
    }

    // Add event listener to toggle HySpex VNIR Event trajectory visibility (5.11.2025)
    if (trajectoryVnirEventCheckbox) {
        trajectoryVnirEventCheckbox.addEventListener('change', () => {
            if (hyspexTrajectoryVnirEventLayer) {
                if (trajectoryVnirEventCheckbox.checked) {
                    hyspexTrajectoryVnirEventLayer.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryVnirEventLayer);
                }
            }
        });
    }

    // Add event listener to toggle HySpex SWIR All trajectory visibility (5.11.2025)
    if (trajectorySwirAllCheckbox) {
        trajectorySwirAllCheckbox.addEventListener('change', () => {
            if (hyspexTrajectorySwirAllLayer) {
                if (trajectorySwirAllCheckbox.checked) {
                    hyspexTrajectorySwirAllLayer.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectorySwirAllLayer);
                }
            }
        });
    }

    // Add event listener to toggle HySpex SWIR Event trajectory visibility (5.11.2025)
    if (trajectorySwirEventCheckbox) {
        trajectorySwirEventCheckbox.addEventListener('change', () => {
            if (hyspexTrajectorySwirEventLayer) {
                if (trajectorySwirEventCheckbox.checked) {
                    hyspexTrajectorySwirEventLayer.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectorySwirEventLayer);
                }
            }
        });
    }

    // Add event listener to toggle HySpex VNIR All trajectory visibility (3.12.2025)
    if (trajectoryVnirAllCheckbox2) {
        trajectoryVnirAllCheckbox2.addEventListener('change', () => {
            if (hyspexTrajectoryVnirAllLayer2) {
                if (trajectoryVnirAllCheckbox2.checked) {
                    hyspexTrajectoryVnirAllLayer2.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryVnirAllLayer2);
                }
            }
        });
    }

    // Add event listener to toggle HySpex VNIR Event trajectory visibility (3.12.2025)
    if (trajectoryVnirEventCheckbox2) {
        trajectoryVnirEventCheckbox2.addEventListener('change', () => {
            if (hyspexTrajectoryVnirEventLayer2) {
                if (trajectoryVnirEventCheckbox2.checked) {
                    hyspexTrajectoryVnirEventLayer2.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryVnirEventLayer2);
                }
            }
        });
    }

    // Add event listener to toggle HySpex SWIR All trajectory visibility (3.12.2025)
    if (trajectorySwirAllCheckbox2) {
        trajectorySwirAllCheckbox2.addEventListener('change', () => {
            if (hyspexTrajectorySwirAllLayer2) {
                if (trajectorySwirAllCheckbox2.checked) {
                    hyspexTrajectorySwirAllLayer2.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectorySwirAllLayer2);
                }
            }
        });
    }

    // Add event listener to toggle HySpex SWIR Event trajectory visibility (3.12.2025)
    if (trajectorySwirEventCheckbox2) {
        trajectorySwirEventCheckbox2.addEventListener('change', () => {
            if (hyspexTrajectorySwirEventLayer2) {
                if (trajectorySwirEventCheckbox2.checked) {
                    hyspexTrajectorySwirEventLayer2.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectorySwirEventLayer2);
                }
            }
        });
    }
})();
