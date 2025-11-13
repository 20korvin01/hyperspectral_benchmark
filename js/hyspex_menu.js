(function () {
    // Get existing checkbox elements from HTML
    const trajectoryRealtimeCheckbox = document.getElementById('hyspex-trajectory-realtime-checkbox');
    const trajectoryPostprocessedCheckbox = document.getElementById('hyspex-trajectory-postprocessed-checkbox');

    // Initialize layer variables for HySpex trajectories
    let hyspexTrajectoryRealtimeLayer = null;
    let hyspexTrajectoryPostprocessedLayer = null;

    // Load HySpex trajectory RealTime GeoJSON
    fetch('data/geojson/hyspex_trajectory100_realtime.geojson')
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
                    layer.bindTooltip(tooltipContent);
                }
            });

            // Dispatch custom event to notify that HySpex trajectory is loaded
            window.dispatchEvent(new Event('hyspexTrajectoryRealtimeLoaded'));
        })
        .catch(error => console.error('Error loading HySpex RealTime trajectory GeoJSON data:', error));

    // Load HySpex trajectory Post-Processed GeoJSON
    fetch('data/geojson/hyspex_trajectory100_post_processed.geojson')
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
                    layer.bindTooltip(tooltipContent);
                }
            });

            // Dispatch custom event to notify that HySpex post-processed trajectory is loaded
            window.dispatchEvent(new Event('hyspexTrajectoryPostprocessedLoaded'));
        })
        .catch(error => console.error('Error loading HySpex Post-Processed trajectory GeoJSON data:', error));

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
})();
