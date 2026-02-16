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

    // Toggle HySpex data containers visibility (3.12.2025, 1. Flug)
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

    // Toggle HySpex data containers visibility (3.12.2025, 2. Flug)
    let isHySpexDataExpanded3 = false; // Default collapsed state
    const hyspexToggleBtn3 = document.getElementById('hyspex-data-toggle-btn-3');
    if (hyspexToggleBtn3) {
        hyspexToggleBtn3.addEventListener('click', function() {
            isHySpexDataExpanded3 = !isHySpexDataExpanded3;
            const containers3 = document.querySelectorAll('#hyspex-data-wrapper-3 > div');
            const wrapper3 = document.getElementById('hyspex-data-wrapper-3');
            const chevron3 = hyspexToggleBtn3.querySelector('.hyspex-badge-chevron-3');
            containers3.forEach(container => {
                if (container.classList.contains('hyspex-layer-checkbox-container') || 
                    container.classList.contains('hyspex-spectral-container')) {
                    container.classList.toggle('collapsed', !isHySpexDataExpanded3);
                }
            });
            if (wrapper3) {
                wrapper3.classList.toggle('expanded', isHySpexDataExpanded3);
            }
            if (chevron3) {
                chevron3.classList.toggle('rotated', isHySpexDataExpanded3);
            }
        });
        // Initialize with collapsed state
        const containers3 = document.querySelectorAll('#hyspex-data-wrapper-3 > div');
        containers3.forEach(container => {
            if (container.classList.contains('hyspex-layer-checkbox-container') || 
                container.classList.contains('hyspex-spectral-container')) {
                container.classList.add('collapsed');
            }
        });
    }

    // Get spectral data containers (5.11.2025)
    const spectralGroupContent = document.getElementById('hyspex-spectral-group-content');

    // Get spectral data containers (3.12.2025)
    const spectralGroupContent2 = document.getElementById('hyspex-spectral-group-content-2');
    // Get spectral data containers (3.12.2025, 2. Flug)
    const spectralGroupContent3 = document.getElementById('hyspex-spectral-group-content-3');

    // Get existing checkbox elements from HTML (5.11.2025)
    const trajectoryVnirAllCheckbox = document.getElementById('hyspex-trajectory-vnir-all-checkbox');
    const trajectoryVnirEventCheckbox = document.getElementById('hyspex-trajectory-vnir-event-checkbox');
    const trajectorySwirAllCheckbox = document.getElementById('hyspex-trajectory-swir-all-checkbox');
    const trajectorySwirEventCheckbox = document.getElementById('hyspex-trajectory-swir-event-checkbox');

    // Get existing checkbox elements from HTML (3.12.2025, 1. Flug)
    const trajectoryVnirAllCheckbox2 = document.getElementById('hyspex-trajectory-vnir-all-checkbox-2');
    const trajectoryVnirEventCheckbox2 = document.getElementById('hyspex-trajectory-vnir-event-checkbox-2');
    const trajectorySwirAllCheckbox2 = document.getElementById('hyspex-trajectory-swir-all-checkbox-2');
    const trajectorySwirEventCheckbox2 = document.getElementById('hyspex-trajectory-swir-event-checkbox-2');
    // Get existing checkbox elements from HTML (3.12.2025, 2. Flug)
    const trajectoryVnirAllCheckbox3 = document.getElementById('hyspex-trajectory-vnir-all-checkbox-3');
    const trajectoryVnirEventCheckbox3 = document.getElementById('hyspex-trajectory-vnir-event-checkbox-3');
    const trajectorySwirAllCheckbox3 = document.getElementById('hyspex-trajectory-swir-all-checkbox-3');
    const trajectorySwirEventCheckbox3 = document.getElementById('hyspex-trajectory-swir-event-checkbox-3');
    // Add event listener to toggle HySpex VNIR All trajectory visibility (3.12.2025, 2. Flug)
    if (trajectoryVnirAllCheckbox3) {
        trajectoryVnirAllCheckbox3.addEventListener('change', () => {
            if (typeof hyspexTrajectoryVnirAllLayer3 !== 'undefined' && hyspexTrajectoryVnirAllLayer3) {
                if (trajectoryVnirAllCheckbox3.checked) {
                    hyspexTrajectoryVnirAllLayer3.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryVnirAllLayer3);
                }
            }
        });
    }

    // Add event listener to toggle HySpex VNIR Event trajectory visibility (3.12.2025, 2. Flug)
    if (trajectoryVnirEventCheckbox3) {
        trajectoryVnirEventCheckbox3.addEventListener('change', () => {
            if (typeof hyspexTrajectoryVnirEventLayer3 !== 'undefined' && hyspexTrajectoryVnirEventLayer3) {
                if (trajectoryVnirEventCheckbox3.checked) {
                    hyspexTrajectoryVnirEventLayer3.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryVnirEventLayer3);
                }
            }
        });
    }

    // Add event listener to toggle HySpex SWIR All trajectory visibility (3.12.2025, 2. Flug)
    if (trajectorySwirAllCheckbox3) {
        trajectorySwirAllCheckbox3.addEventListener('change', () => {
            if (typeof hyspexTrajectorySwirAllLayer3 !== 'undefined' && hyspexTrajectorySwirAllLayer3) {
                if (trajectorySwirAllCheckbox3.checked) {
                    hyspexTrajectorySwirAllLayer3.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectorySwirAllLayer3);
                }
            }
        });
    }

    // Add event listener to toggle HySpex SWIR Event trajectory visibility (3.12.2025, 2. Flug)
    if (trajectorySwirEventCheckbox3) {
        trajectorySwirEventCheckbox3.addEventListener('change', () => {
            if (typeof hyspexTrajectorySwirEventLayer3 !== 'undefined' && hyspexTrajectorySwirEventLayer3) {
                if (trajectorySwirEventCheckbox3.checked) {
                    hyspexTrajectorySwirEventLayer3.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectorySwirEventLayer3);
                }
            }
        });
    }

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

    // Load HySpex trajectory VNIR All GeoJSON (3.12.2025, Flug 1)
    fetch('data/geojson/20251203/1/VNIR_all_downsampled100.geojson')
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
        .catch(error => console.error('Error loading HySpex VNIR All trajectory GeoJSON data (20251203/1):', error));

    // Load HySpex trajectory VNIR All GeoJSON (3.12.2025, Flug 2)
    let hyspexTrajectoryVnirAllLayer3 = null;
    fetch('data/geojson/20251203/2/VNIR_all_downsampled100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryVnirAllLayer3 = L.geoJSON(geojsonData, {
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
            window.dispatchEvent(new Event('hyspexTrajectoryVnirAllLoaded3'));
        })
        .catch(error => console.error('Error loading HySpex VNIR All trajectory GeoJSON data (20251203/2):', error));

    // Load HySpex trajectory VNIR Event GeoJSON (Points) (3.12.2025, Flug 1)
    fetch('data/geojson/20251203/1/VNIR_event_points.geojson')
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
        .catch(error => console.error('Error loading HySpex VNIR Event points GeoJSON data (20251203/1):', error));

    // Load HySpex trajectory VNIR Event GeoJSON (Points) (3.12.2025, Flug 2)
    let hyspexTrajectoryVnirEventLayer3 = null;
    fetch('data/geojson/20251203/2/VNIR_event_points.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryVnirEventLayer3 = L.geoJSON(geojsonData, {
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
            window.dispatchEvent(new Event('hyspexTrajectoryVnirEventLoaded3'));
        })
        .catch(error => console.error('Error loading HySpex VNIR Event points GeoJSON data (20251203/2):', error));

    // Load HySpex trajectory SWIR All GeoJSON (3.12.2025, Flug 1)
    fetch('data/geojson/20251203/1/SWIR_all_downsampled100.geojson')
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
        .catch(error => console.error('Error loading HySpex SWIR All trajectory GeoJSON data (20251203/1):', error));

    // Load HySpex trajectory SWIR All GeoJSON (3.12.2025, Flug 2)
    let hyspexTrajectorySwirAllLayer3 = null;
    fetch('data/geojson/20251203/2/SWIR_all_downsampled100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectorySwirAllLayer3 = L.geoJSON(geojsonData, {
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
            window.dispatchEvent(new Event('hyspexTrajectorySwirAllLoaded3'));
        })
        .catch(error => console.error('Error loading HySpex SWIR All trajectory GeoJSON data (20251203/2):', error));

    // Load HySpex trajectory SWIR Event GeoJSON (Points) (3.12.2025, Flug 1)
    fetch('data/geojson/20251203/1/SWIR_event_points.geojson')
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
        .catch(error => console.error('Error loading HySpex SWIR Event points GeoJSON data (20251203/1):', error));

    // Load HySpex trajectory SWIR Event GeoJSON (Points) (3.12.2025, Flug 2)
    let hyspexTrajectorySwirEventLayer3 = null;
    fetch('data/geojson/20251203/2/SWIR_event_points.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectorySwirEventLayer3 = L.geoJSON(geojsonData, {
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
            window.dispatchEvent(new Event('hyspexTrajectorySwirEventLoaded3'));
        })
        .catch(error => console.error('Error loading HySpex SWIR Event points GeoJSON data (20251203/2):', error));

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
