// Weather Modal Management
document.addEventListener('DOMContentLoaded', function() {
    const weatherBtn = document.getElementById('sidebar-weather-btn');
    const weatherModal = document.getElementById('weather-modal');
    const weatherModalClose = weatherModal.querySelector('.info-modal-close');
    const weatherTabsContainer = document.getElementById('weather-tabs');
    const weatherModalBody = document.getElementById('weather-modal-body');

    // Scan and build weather data from available images
    const weatherData = {
        '5.11.2025': {
            sky: [],
            sun: []
        }
    };

    // Image metadata - maps filename to properties
    const skyImages = [
        '103521', '103906', '104024', '105645', '111356', '131114', '135237'
    ];
    
    const sunImages = [
        '103924', '104511', '105649', '111402', '123450', '131119', '133211', '135239'
    ];

    // Format time from HHMMSS to HH:MM:SS
    function formatTime(timeStr) {
        if (timeStr.length !== 6) return timeStr;
        return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}:${timeStr.substring(4, 6)}`;
    }

    // Initialize weather data
    function initializeWeatherData() {
        skyImages.forEach(timeCode => {
            weatherData['5.11.2025'].sky.push({
                time: formatTime(timeCode),
                timeCode: timeCode,
                filename: `sky_${timeCode}.jpg`
            });
        });

        sunImages.forEach(timeCode => {
            weatherData['5.11.2025'].sun.push({
                time: formatTime(timeCode),
                timeCode: timeCode,
                filename: `sun_${timeCode}.jpg`
            });
        });

        // Sort by time
        weatherData['5.11.2025'].sky.sort((a, b) => a.timeCode.localeCompare(b.timeCode));
        weatherData['5.11.2025'].sun.sort((a, b) => a.timeCode.localeCompare(b.timeCode));
    }

    // Build tab buttons
    function buildTabs() {
        weatherTabsContainer.innerHTML = '';
        const dates = Object.keys(weatherData).sort();
        
        dates.forEach((date, index) => {
            const button = document.createElement('button');
            button.className = `weather-tab-button ${index === 0 ? 'active' : ''}`;
            button.textContent = date;
            button.dataset.date = date;
            
            button.addEventListener('click', function() {
                document.querySelectorAll('.weather-tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                buildTabContent(date);
            });
            
            weatherTabsContainer.appendChild(button);
        });
    }

    // Build timeline
    function buildTimeline(date) {
        const data = weatherData[date];
        const allImages = [...(data.sky || []), ...(data.sun || [])].sort((a, b) => 
            a.timeCode.localeCompare(b.timeCode)
        );

        let timelineHtml = '<div class="weather-timeline">';
        
        // Add legend
        timelineHtml += `
            <div class="weather-timeline-legend">
                <div class="weather-legend-item">
                    <div class="weather-legend-point sky"></div>
                    <span class="weather-legend-label">Himmel</span>
                </div>
                <div class="weather-legend-item">
                    <div class="weather-legend-point sun"></div>
                    <span class="weather-legend-label">Sonne</span>
                </div>
                <div class="weather-legend-item">
                    <div class="weather-legend-point flight"></div>
                    <span class="weather-legend-label">Hyperspektralflug</span>
                </div>
                <div class="weather-legend-item">
                    <div class="weather-legend-point dji"></div>
                    <span class="weather-legend-label">DJI Flug</span>
                </div>
            </div>
        `;
        
        timelineHtml += '<div class="weather-timeline-track">';

        // Calculate positions for flight time rectangle
        // Between point 1 and 2, until between point 5 and 6
        const flightStart = ((0.5) / (allImages.length - 1)) * 100; // Zwischen Punkt 1 und 2
        const flightEnd = (4.4 / (allImages.length - 1)) * 100; // Between point 5 and 6
        const flightWidth = flightEnd - flightStart;
        
        timelineHtml += `
            <div class="weather-flight-time-rectangle" 
                 style="left: ${flightStart}%; width: ${flightWidth}%;" 
                 title="Hyperspektralflug: 10:36 - 10:47"
                 data-flight-start="10:36"
                 data-flight-end="10:47">
                <div class="weather-flight-time-tooltip">10:36 - 10:47</div>
            </div>
        `;

        // Calculate positions for DJI flight time rectangle
        // 10:57 to 11:25
        const djiFlightStart = ((4.6) / (allImages.length - 1)) * 100; // Position on timeline
        const djiFlightEnd = ((8.5) / (allImages.length - 1)) * 100; // Position on timeline
        const djiFlightWidth = djiFlightEnd - djiFlightStart;
        
        timelineHtml += `
            <div class="weather-dji-flight-time-rectangle" 
                 style="left: ${djiFlightStart}%; width: ${djiFlightWidth}%;" 
                 title="DJI Flug: 10:57 - 11:25"
                 data-dji-start="10:57"
                 data-dji-end="11:25">
                <div class="weather-dji-flight-time-tooltip">10:57 - 11:25</div>
            </div>
        `;

        allImages.forEach((item, index) => {
            const percentage = (index / (allImages.length - 1)) * 100;
            const type = data.sky.some(s => s.timeCode === item.timeCode) ? 'sky' : 'sun';
            
            timelineHtml += `
                <div class="weather-timeline-point" style="left: ${percentage}%" 
                     data-time="${item.time}" data-type="${type}" title="${item.time} (${type})">
                    <div class="weather-timeline-label">${item.time}</div>
                </div>
            `;
        });

        timelineHtml += '</div></div>';
        return timelineHtml;
    }

    // Build tab content - only show timeline initially
    function buildTabContent(date) {
        const data = weatherData[date];
        if (!data) {
            weatherModalBody.innerHTML = '<div class="weather-no-data"><p>Keine Daten verfügbar</p></div>';
            return;
        }

        let html = buildTimeline(date);
        html += '<div id="weather-image-popup"></div>';

        weatherModalBody.innerHTML = html;
        
        // Add click handlers for timeline points
        addTimelineClickHandlers(date);
    }

    // Add click handlers for timeline points
    function addTimelineClickHandlers(date) {
        const timelinePoints = document.querySelectorAll('.weather-timeline-point');
        const data = weatherData[date];

        timelinePoints.forEach(point => {
            point.addEventListener('click', function(e) {
                e.stopPropagation();
                const time = this.dataset.time;
                const type = this.dataset.type;
                
                // Find the image data
                let imageData = null;
                if (type === 'sky') {
                    imageData = data.sky.find(item => item.time === time);
                } else {
                    imageData = data.sun.find(item => item.time === time);
                }
                
                if (imageData) {
                    showImagePopup(imageData, type);
                }
            });
        });
    }

    // Show image in popup
    function showImagePopup(imageData, type) {
        const popup = document.getElementById('weather-image-popup');
        const typeLabel = type === 'sky' ? 'Himmel' : 'Sonne';
        
        popup.innerHTML = `
            <div class="weather-popup-overlay" id="weather-popup-overlay">
                <div class="weather-popup-content" data-type="${type}">
                    <button class="weather-popup-close" id="weather-popup-close-btn">&times;</button>
                    <div class="weather-popup-image-container">
                        <img src="img/weather/${imageData.filename}" alt="${typeLabel} at ${imageData.time}" class="weather-popup-image" />
                    </div>
                    <div class="weather-popup-info">
                        <div class="weather-popup-type">${typeLabel}</div>
                        <div class="weather-popup-time">${imageData.time}</div>
                    </div>
                </div>
            </div>
        `;
        
        popup.classList.add('active');
        
        // Close button handler
        document.getElementById('weather-popup-close-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            closeImagePopup();
        });
        
        // Click outside to close
        document.getElementById('weather-popup-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeImagePopup();
            }
        });
        
        // Escape key to close
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeImagePopup();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Close image popup
    function closeImagePopup() {
        const popup = document.getElementById('weather-image-popup');
        if (popup) {
            popup.classList.remove('active');
            popup.innerHTML = '';
        }
    }

    // Initialize modal
    function initializeModal() {
        initializeWeatherData();
        buildTabs();
        const firstDate = Object.keys(weatherData)[0];
        if (firstDate) {
            buildTabContent(firstDate);
        }
    }

    // Open modal
    if (weatherBtn) {
        weatherBtn.addEventListener('click', function() {
            weatherModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    if (weatherModalClose) {
        weatherModalClose.addEventListener('click', function() {
            weatherModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close when clicking outside or Escape
    window.addEventListener('click', e => {
        if (e.target === weatherModal) {
            weatherModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && weatherModal.style.display === 'block') {
            weatherModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Initialize
    initializeModal();
});
