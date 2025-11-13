// Technology Modal Management
document.addEventListener('DOMContentLoaded', function() {
    const technologyBtn = document.getElementById('sidebar-technology-btn');
    const technologyModal = document.getElementById('technology-modal');
    const technologyModalClose = technologyModal.querySelector('.info-modal-close');
    const modalBody = technologyModal.querySelector('.info-modal-body');

    // Technology data
    const technologies = [
        {
            name: 'HySpex Mjolnir VS-620',
            images: [
                'img/technologies/hyspex_mjolnir_vs-620_mounted.jpg',
                'img/technologies/hyspex_mjolnir_vs-620.jpg'
            ],
            description: 'Die HySpex Mjolnir VS-620 ist ein hyperspektrales Dual-Sensor-System (VNIR + SWIR) für wissenschaftliche Fernerkundung. Sie deckt den Bereich von 400–2500 nm ab und liefert spektral wie räumlich perfekt korregistrierte Datensätze für präzise Materialanalysen und UAV-basierte Anwendungen.',
            documentUrl: 'https://www.hyspex.com/media/qj1ppye0/mjolnir-vs-620-data-sheet.pdf',
            documentLabel: 'Data Sheet (PDF)',
            specs: [
                { label: 'Spektralbereich', value: '400 – 2500 nm (VNIR + SWIR kombiniert)' },
                { label: 'Spektralkanäle', value: '490 (200 @ 3.0 nm + 300 @ 5.1 nm)' },
                { label: 'Räumliche Pixel', value: '620' },
                { label: 'FOV (Sichtfeld)', value: '20°' },
                { label: 'F-Nummer', value: 'f/1.8 (VNIR), f/1.9 (SWIR)' },
                { label: 'Pixel FOV', value: '0.55 × 0.55 mrad' },
                { label: 'Dynamikbereich', value: 'bis 26 000 (LG), 10 000 (HG)' },
                { label: 'Signal-Rausch-Verhältnis', value: '> 430 (LG), > 2000 (HG)' },
                { label: 'Max. Bildrate', value: '250 fps (VNIR) / 125 fps (SWIR)' },
                { label: 'Leistungsaufnahme', value: '≈ 50 W (inkl. DAQ & IMU)' },
                { label: 'Abmessungen', value: '374 × 202 × 178 mm' },
                { label: 'Gewicht', value: '≈ 6 kg' }
            ]
        },
        {
            name: 'DJI Mavic 3M',
            images: [
                'img/technologies/dji_mavic_3m.jpg',
                'img/technologies/dji_mavic_3m_draft.jpg'
            ],
            description: 'Die DJI Mavic 3M ist eine kompakte Enterprise-Drohne mit integrierter Multispektralkamera für Präzisionslandwirtschaft und Fernerkundung. Sie kombiniert eine hochauflösende RGB-Kamera (20 MP, 4/3 CMOS) mit einer Multispektralkamera (5 MP, 4 Spektralkanäle: G/R/RE/NIR) und bietet optionale RTK-Genauigkeit für zentimetergenaue Positionierung.',
            documentUrl: 'https://dl.djicdn.com/downloads/DJI_Mavic_3_Enterprise/20230531/DJI_Mavic_3M_UM_de_v1.2.pdf',
            documentLabel: 'User Manual (PDF)',
            specs: [
                { label: 'Eigengewicht', value: '951 g (mit RTK-Modul)' },
                { label: 'Max. Flugzeit', value: '43 Minuten (bei Windstille)' },
                { label: 'Max. Schwebezeit', value: '37 Minuten (bei Windstille)' },
                { label: 'Höchstgeschwindigkeit', value: '15 m/s (Normalmodus), 21 m/s (Sportmodus Vorwärts)' },
                { label: 'Max. Starthöhe', value: '6.000 m über NHN' },
                { label: 'RGB-Kamera', value: '4/3 CMOS, 20 MP, 24 mm Äquivalent' },
                { label: 'Multispektralkamera', value: '5 MP, 4 Kanäle (G/R/RE/NIR)' },
                { label: 'Spektrale Bänder', value: 'Grün 560±16 nm, Rot 650±16 nm, Red Edge 730±16 nm, NIR 860±26 nm' },
                { label: 'GNSS', value: 'GPS + Galileo + BeiDou + GLONASS (mit RTK-Modul)' },
                { label: 'RTK-Positionsgenauigkeit', value: 'Horizontal: 1 cm + 1 ppm; Vertikal: 1,5 cm + 1 ppm' },
                { label: 'Videoübertragung', value: 'DJI O3 Enterprise, bis 15 km (FCC)' },
                { label: 'Betriebstemperatur', value: '-10 °C bis 40 °C' }
            ]
        },
        {
            name: 'DJI D-RTK 2 Mobile Station',
            images: [
                'img/technologies/dji_drtk2.jpg',
                'img/technologies/dji_drtk2_draft.jpg'
            ],
            description: 'Die DJI D-RTK 2 ist eine hochpräzise GNSS-Basisstation für DJI-Drohnen. Sie unterstützt GPS, GLONASS, Galileo und BeiDou und liefert zentimetergenaue RTK-Korrektionen in Echtzeit. Die Station ist wetterfest, robust und für präzise Vermessungs-, Mapping- und Landwirtschaftsanwendungen konzipiert.',
            documentUrl: 'https://dl.djicdn.com/downloads/d-rtk-2/20230621/D-RTK_2_Mobile_Station_User_Guide_v2.6_multi_.pdf',
            documentLabel: 'User Guide (PDF)',
            specs: [
                { label: 'Positioniergenauigkeit', value: '±1 cm + 1 ppm horizontal, ±2 cm + 1 ppm vertikal' },
                { label: 'Satellitensysteme', value: 'GPS L1/L2, GLONASS L1/L2, Galileo E1/E5a/E5b, BeiDou B1/B2' },
                { label: 'Maximale Reichweite', value: 'bis zu 12 km (freies Sichtfeld, FCC)' },
                { label: 'Kommunikation', value: 'OcuSync, LAN, Wi-Fi, 4G' },
                { label: 'Aktualisierungsrate', value: '1 – 20 Hz' },
                { label: 'Speicher', value: '16 GB intern' },
                { label: 'Betriebszeit', value: 'ca. 2 Stunden mit WB37-Akku' },
                { label: 'Schutzklasse', value: 'IP65 (staub- und spritzwassergeschützt)' },
                { label: 'Betriebstemperatur', value: '−20 °C bis +55 °C' },
                { label: 'Abmessungen', value: '168 × 168 × 1800 mm' },
                { label: 'Gewicht', value: 'ca. 1,05 kg' }
            ]
        }
    ];

    // Build modal content
    function buildModalContent() {
        let html = '<div class="technology-modal-body">';
        technologies.forEach(tech => {
            html += `
                <div class="technology-section">
                    <div class="technology-images">
                        ${tech.images.map(image => `
                            <div class="technology-image">
                                <img src="${image}" alt="${tech.name}" />
                            </div>
                        `).join('')}
                    </div>
                    <div class="technology-content">
                        <div class="technology-header">
                            <h3>${tech.name}</h3>
                            ${tech.documentUrl ? `
                                <a href="${tech.documentUrl}" target="_blank" class="technology-document-link">${tech.documentLabel}</a>
                            ` : ''}
                        </div>
                        <p>${tech.description}</p>
                        ${tech.specs ? `
                            <div class="technology-specs">
                                <div class="technology-specs-title">Spezifikationen</div>
                                <ul class="technology-specs-list">
                                    ${tech.specs.map(spec => `
                                        <li><strong>${spec.label}:</strong> ${spec.value}</li>
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

    // Open modal
    if (technologyBtn) {
        technologyBtn.addEventListener('click', function() {
            technologyModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    if (technologyModalClose) {
        technologyModalClose.addEventListener('click', function() {
            technologyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close when clicking outside or Escape
    window.addEventListener('click', e => {
        if (e.target === technologyModal) {
            technologyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && technologyModal.style.display === 'block') {
            technologyModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
