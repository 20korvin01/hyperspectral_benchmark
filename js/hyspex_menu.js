(function () {
    // Initialize group toggle state (stored in localStorage for persistence)
    const spectralGroupState = localStorage.getItem('hyspex-spectral-expanded') !== 'false';

    // Get group toggle button and content container
    const spectralGroupToggle = document.getElementById('hyspex-spectral-group-toggle');
    const spectralGroupContent = document.getElementById('hyspex-spectral-group-content');

    // Initialize group state
    function initializeGroupState() {
        if (!spectralGroupState && spectralGroupContent) {
            spectralGroupContent.classList.add('collapsed');
            const spectralContainer = spectralGroupContent.parentElement;
            if (spectralContainer) spectralContainer.classList.add('collapsed');
        }
    }

    // Set up group toggle event listener
    if (spectralGroupToggle) {
        spectralGroupToggle.addEventListener('click', () => {
            if (spectralGroupContent) {
                spectralGroupContent.classList.toggle('collapsed');
                const spectralContainer = spectralGroupContent.parentElement;
                if (spectralContainer) spectralContainer.classList.toggle('collapsed');
                localStorage.setItem('hyspex-spectral-expanded', !spectralGroupContent.classList.contains('collapsed'));
            }
        });
    }

    // Get existing checkbox elements from HTML
    const trajectoryRealtimeCheckbox = document.getElementById('hyspex-trajectory-realtime-checkbox');
    const trajectoryPostprocessedCheckbox = document.getElementById('hyspex-trajectory-postprocessed-checkbox');
    const trajectoryVnirAllCheckbox = document.getElementById('hyspex-trajectory-vnir-all-checkbox');
    const trajectoryVnirEventCheckbox = document.getElementById('hyspex-trajectory-vnir-event-checkbox');
    const trajectorySwirAllCheckbox = document.getElementById('hyspex-trajectory-swir-all-checkbox');
    const trajectorySwirEventCheckbox = document.getElementById('hyspex-trajectory-swir-event-checkbox');

    // Initialize layer variables for HySpex trajectories
    let hyspexTrajectoryRealtimeLayer = null;
    let hyspexTrajectoryPostprocessedLayer = null;
    let hyspexTrajectoryVnirAllLayer = null;
    let hyspexTrajectoryVnirEventLayer = null;
    let hyspexTrajectorySwirAllLayer = null;
    let hyspexTrajectorySwirEventLayer = null;

    // Load HySpex trajectory RealTime GeoJSON
    fetch('data/geojson/hyspex_trajectory_realtime100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryRealtimeLayer = L.geoJSON(geojsonData, {
                style: {
                    color: '#FF9800',
                    weight: 3,
                    opacity: 0.8
                },
                onEachFeature: function(feature, layer) {
                    // Add tooltip for the trajectory
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex Flugbahn | RealTime';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });

            // Dispatch custom event to notify that HySpex trajectory is loaded
            window.dispatchEvent(new Event('hyspexTrajectoryRealtimeLoaded'));
        })
        .catch(error => console.error('Error loading HySpex RealTime trajectory GeoJSON data:', error));

    // Load HySpex trajectory Post-Processed GeoJSON
    fetch('data/geojson/hyspex_trajectory_post_processed100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryPostprocessedLayer = L.geoJSON(geojsonData, {
                style: {
                    color: '#FF6F00',
                    weight: 3,
                    opacity: 0.8
                },
                onEachFeature: function(feature, layer) {
                    // Add tooltip for the trajectory
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex Flugbahn | Post-Processed';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent, { sticky: true });
                }
            });

            // Dispatch custom event to notify that HySpex post-processed trajectory is loaded
            window.dispatchEvent(new Event('hyspexTrajectoryPostprocessedLoaded'));
        })
        .catch(error => console.error('Error loading HySpex Post-Processed trajectory GeoJSON data:', error));

    // Load HySpex trajectory VNIR All GeoJSON
    fetch('data/geojson/VNIR_all_downsampled100.geojson')
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

    // Load HySpex trajectory VNIR Event GeoJSON (Points)
    fetch('data/geojson/VNIR_event_points.geojson')
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

    // Load HySpex trajectory SWIR All GeoJSON
    fetch('data/geojson/SWIR_all_downsampled100.geojson')
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

    // Load HySpex trajectory SWIR Event GeoJSON (Points)
    fetch('data/geojson/SWIR_event_points.geojson')
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

    // Initialize group state after DOM is ready
    setTimeout(() => {
        initializeGroupState();
    }, 100);

    // Add event listener to toggle HySpex RealTime trajectory visibility
    if (trajectoryRealtimeCheckbox) {
        trajectoryRealtimeCheckbox.addEventListener('change', () => {
            if (hyspexTrajectoryRealtimeLayer) {
                if (trajectoryRealtimeCheckbox.checked) {
                    hyspexTrajectoryRealtimeLayer.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryRealtimeLayer);
                }
            }
        });
    }

    // Add event listener to toggle HySpex Post-Processed trajectory visibility
    if (trajectoryPostprocessedCheckbox) {
        trajectoryPostprocessedCheckbox.addEventListener('change', () => {
            if (hyspexTrajectoryPostprocessedLayer) {
                if (trajectoryPostprocessedCheckbox.checked) {
                    hyspexTrajectoryPostprocessedLayer.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryPostprocessedLayer);
                }
            }
        });
    }

    // Add event listener to toggle HySpex VNIR All trajectory visibility
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

    // Add event listener to toggle HySpex VNIR Event trajectory visibility
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

    // Add event listener to toggle HySpex SWIR All trajectory visibility
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

    // Add event listener to toggle HySpex SWIR Event trajectory visibility
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
})();
