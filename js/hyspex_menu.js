(function () {
    // Get existing checkbox elements from HTML
    const trajectoryCheckbox = document.getElementById('hyspex-trajectory-checkbox');

    // Initialize layer variable for HySpex trajectory
    let hyspexTrajectoryLayer = null;

    // Load HySpex trajectory GeoJSON
    fetch('data/geojson/hyspex_trajectory100.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            hyspexTrajectoryLayer = L.geoJSON(geojsonData, {
                style: {
                    color: 'orange',
                    weight: 4,
                    opacity: 0.8
                },
                onEachFeature: function(feature, layer) {
                    // Add tooltip for the trajectory
                    const properties = feature.properties;
                    let tooltipContent = 'HySpex Flugbahn';
                    if (properties && Object.keys(properties).length > 0) {
                        tooltipContent = Object.entries(properties)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('<br>');
                    }
                    layer.bindTooltip(tooltipContent);
                }
            });

            // Dispatch custom event to notify that HySpex trajectory is loaded
            window.dispatchEvent(new Event('hyspexTrajectoryLoaded'));
        })
        .catch(error => console.error('Error loading HySpex trajectory GeoJSON data:', error));

    // Add event listener to toggle HySpex trajectory visibility
    if (trajectoryCheckbox) {
        trajectoryCheckbox.addEventListener('change', () => {
            if (hyspexTrajectoryLayer) {
                if (trajectoryCheckbox.checked) {
                    hyspexTrajectoryLayer.addTo(map);
                } else {
                    map.removeLayer(hyspexTrajectoryLayer);
                }
            }
        });
    }
})();
