// Technology Modal Management
document.addEventListener('DOMContentLoaded', function() {
    const technologyBtn = document.getElementById('sidebar-technology-btn');
    const technologyModal = document.getElementById('technology-modal');
    const technologyModalClose = technologyModal.querySelector('.info-modal-close');
    const modalBody = technologyModal.querySelector('.info-modal-body');

    // Technology data
    const technologies = [
        {
            name: 'DJI D-RTK 2 Mobile Station',
            image: 'img/technologies/dji_drtk2.png',
            description: 'Die D-RTK 2 ist eine hochpräzise GNSS-Basisstation für DJI-Drohnen. Sie ermöglicht zentimetergenaue RTK-Positionierung über GPS, GLONASS, Galileo und BeiDou und wird drahtlos mit der Drohne verbunden.',
            specs: [
                { label: 'Genauigkeit', value: '±2 cm (vertikal)' },
                { label: 'Auflösungsrate', value: '1 Hz' },
                { label: 'Frequenzbänder', value: 'GPS, GLONASS, Galileo, BeiDou' },
                { label: 'Reichweite', value: 'bis 10 km' }
            ]
        }
    ];

    // Build modal content
    function buildModalContent() {
        let html = '<div class="technology-modal-body">';
        
        technologies.forEach(tech => {
            html += `
                <div class="technology-section">
                    <div class="technology-image">
                        <img src="${tech.image}" alt="${tech.name}" />
                    </div>
                    <div class="technology-content">
                        <h3>${tech.name}</h3>
                        <p>${tech.description}</p>
                        ${tech.specs ? `
                            <div class="technology-specs">
                                <div class="technology-specs-title">Spezifikationen</div>
                                <ul class="technology-specs-list">
                                    ${tech.specs.map(spec => `
                                        <li>
                                            <strong>${spec.label}</strong>
                                            ${spec.value}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // Set modal content
    modalBody.innerHTML = buildModalContent();

    // Open modal when technology button is clicked
    if (technologyBtn) {
        technologyBtn.addEventListener('click', function() {
            technologyModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal when close button is clicked
    if (technologyModalClose) {
        technologyModalClose.addEventListener('click', function() {
            technologyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === technologyModal) {
            technologyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && technologyModal.style.display === 'block') {
            technologyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
