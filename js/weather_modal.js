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
            sun: [],
            folderName: '20251105',
            flights: {
                hyperspectral: [
                    { start: '10:36', end: '10:47', startIndex: 0.5, endIndex: 4.4 }
                ],
                dji: [
                    { start: '10:57', end: '11:25', startIndex: 4.6, endIndex: 8.5 }
                ]
            }
        },
        '3.12.2025': {
            sky: [],
            sun: [],
            folderName: '20251203',
            flights: {
                hyperspectral: [
                    { start: '10:48', end: '10:58', startIndex: 1.5, endIndex: 9.4 },
                    { start: '11:55', end: '12:05', startIndex: 13.6, endIndex: 23. }
                ],
                dji: [
                    { start: '11:08', end: '11:43', startIndex: 9.6, endIndex: 13.4 }
                ]
            }
        }
    };

    // Define date order for tabs
    const dateOrder = ['5.11.2025', '3.12.2025'];

    // Image metadata - maps filename to properties
    const skyImages = {
        '5.11.2025': ['103521', '103906', '104024', '105645', '111356', '131114', '135237'],
        '3.12.2025': ['103328', '104822', '105035', '105347', '105611', '110809', '114004', '115548', '115712', '115905', '120155', '120337']
    };
    
    const sunImages = {
        '5.11.2025': ['103924', '104511', '105649', '111402', '123450', '131119', '133211', '135239'],
        '3.12.2025': ['103333', '104825', '105039', '105350', '105614', '110811', '114008', '115552', '115717', '115909', '120158', '120339']
    };

    // Format time from HHMMSS to HH:MM:SS
    function formatTime(timeStr) {
        if (timeStr.length !== 6) return timeStr;
        return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}:${timeStr.substring(4, 6)}`;
    }

    // Initialize weather data
    function initializeWeatherData() {
        Object.keys(weatherData).forEach(date => {
            skyImages[date].forEach(timeCode => {
                weatherData[date].sky.push({
                    time: formatTime(timeCode),
                    timeCode: timeCode,
                    filename: `${weatherData[date].folderName}_${timeCode}_sky.jpg`
                });
            });

            sunImages[date].forEach(timeCode => {
                weatherData[date].sun.push({
                    time: formatTime(timeCode),
                    timeCode: timeCode,
                    filename: `${weatherData[date].folderName}_${timeCode}_sun.jpg`
                });
            });

            // Sort by time
            weatherData[date].sky.sort((a, b) => a.timeCode.localeCompare(b.timeCode));
            weatherData[date].sun.sort((a, b) => a.timeCode.localeCompare(b.timeCode));
        });
    }

    // Build tab buttons
    function buildTabs() {
        weatherTabsContainer.innerHTML = '';
        
        dateOrder.forEach((date, index) => {
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

        // Add hyperspectral flight rectangles
        if (data.flights && data.flights.hyperspectral) {
            data.flights.hyperspectral.forEach(flight => {
                let flightStart, flightEnd;
                
                // If startIndex/endIndex are provided, use them; otherwise calculate from time
                if (flight.startIndex !== undefined && flight.endIndex !== undefined) {
                    flightStart = (flight.startIndex / (allImages.length - 1)) * 100;
                    flightEnd = (flight.endIndex / (allImages.length - 1)) * 100;
                } else {
                    // Calculate positions based on time for new flights
                    const startTime = flight.start.replace(':', '');
                    const endTime = flight.end.replace(':', '');
                    
                    let startIdx = 0, endIdx = allImages.length - 1;
                    allImages.forEach((img, idx) => {
                        if (img.timeCode <= startTime) startIdx = idx;
                        if (img.timeCode <= endTime) endIdx = idx;
                    });
                    
                    flightStart = (startIdx / (allImages.length - 1)) * 100;
                    flightEnd = (endIdx / (allImages.length - 1)) * 100;
                }
                
                const flightWidth = flightEnd - flightStart;
                
                timelineHtml += `
                    <div class="weather-flight-time-rectangle" 
                         style="left: ${flightStart}%; width: ${flightWidth}%;"
                         data-flight-start="${flight.start}"
                         data-flight-end="${flight.end}">
                        <div class="weather-flight-time-tooltip">${flight.start} - ${flight.end}</div>
                    </div>
                `;
            });
        }

        // Add DJI flight rectangles
        if (data.flights && data.flights.dji) {
            data.flights.dji.forEach(flight => {
                let djiFlightStart, djiFlightEnd;
                
                if (flight.startIndex !== undefined && flight.endIndex !== undefined) {
                    djiFlightStart = (flight.startIndex / (allImages.length - 1)) * 100;
                    djiFlightEnd = (flight.endIndex / (allImages.length - 1)) * 100;
                } else {
                    const startTime = flight.start.replace(':', '');
                    const endTime = flight.end.replace(':', '');
                    
                    let startIdx = 0, endIdx = allImages.length - 1;
                    allImages.forEach((img, idx) => {
                        if (img.timeCode <= startTime) startIdx = idx;
                        if (img.timeCode <= endTime) endIdx = idx;
                    });
                    
                    djiFlightStart = (startIdx / (allImages.length - 1)) * 100;
                    djiFlightEnd = (endIdx / (allImages.length - 1)) * 100;
                }
                
                const djiFlightWidth = djiFlightEnd - djiFlightStart;
                
                timelineHtml += `
                    <div class="weather-dji-flight-time-rectangle" 
                         style="left: ${djiFlightStart}%; width: ${djiFlightWidth}%;"
                         data-dji-start="${flight.start}"
                         data-dji-end="${flight.end}">
                        <div class="weather-dji-flight-time-tooltip">${flight.start} - ${flight.end}</div>
                    </div>
                `;
            });
        }

        allImages.forEach((item, index) => {
            const percentage = (index / (allImages.length - 1)) * 100;
            const type = data.sky.some(s => s.timeCode === item.timeCode) ? 'sky' : 'sun';
            
            timelineHtml += `
                <div class="weather-timeline-point" style="left: ${percentage}%" 
                     data-time="${item.time}" data-type="${type}">
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
                    showImagePopup(imageData, type, date);
                }
            });
        });
    }

    // Show image in popup
    function showImagePopup(imageData, type, date) {
        const popup = document.getElementById('weather-image-popup');
        const typeLabel = type === 'sky' ? 'Himmel' : 'Sonne';
        const folderName = weatherData[date].folderName;
        
        popup.innerHTML = `
            <div class="weather-popup-overlay" id="weather-popup-overlay">
                <div class="weather-popup-content" data-type="${type}">
                    <button class="weather-popup-close" id="weather-popup-close-btn">&times;</button>
                    <div class="weather-popup-image-container">
                        <img src="img/weather/${folderName}/${imageData.filename}" alt="${typeLabel} at ${imageData.time}" class="weather-popup-image" />
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
        const firstDate = dateOrder[0];
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
