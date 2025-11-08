(function () {
    // Create a checkbox to toggle orthophoto visibility
    const orthophotoCheckboxContainer = document.createElement('div');
    orthophotoCheckboxContainer.id = 'dji-orthophoto-checkbox-container';

    const orthophotoCheckbox = document.createElement('input');
    orthophotoCheckbox.type = 'checkbox';
    orthophotoCheckbox.id = 'dji-orthophoto-checkbox';
    orthophotoCheckbox.checked = false;

    const orthophotoLabel = document.createElement('label');
    orthophotoLabel.htmlFor = 'dji-orthophoto-checkbox';
    orthophotoLabel.textContent = 'Orthophoto anzeigen';

    orthophotoCheckboxContainer.appendChild(orthophotoCheckbox);
    orthophotoCheckboxContainer.appendChild(orthophotoLabel);

    // Get the dji menu element to insert the checkbox after the title
    const djiMenu = document.getElementById('dji-menu');
    djiMenu.appendChild(orthophotoCheckboxContainer);

    // Create the orthophoto layer using XYZ tiles
    const orthophotoLayer = L.tileLayer('img/ortho_tiles/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 16,
        tms: false,
        attribution: 'DJI Orthophoto',
        // Use zoomOffset to keep displaying zoom level 20 tiles when zooming beyond level 20
        zoomOffset: 0,
        maxNativeZoom: 20
    });

    // Add event listener to toggle orthophoto visibility
    orthophotoCheckbox.addEventListener('change', () => {
        if (orthophotoCheckbox.checked) {
            orthophotoLayer.addTo(map);
        } else {
            map.removeLayer(orthophotoLayer);
        }
    });

    // Ensure the menu elements are accessible even when collapsed
    const djiMenuEl = document.getElementById('dji-menu');
    if (!djiMenuEl) {
        console.error('DJI menu element not found');
    }

})();
