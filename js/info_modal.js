// Info Modal Management
document.addEventListener('DOMContentLoaded', function() {
    const infoBtn = document.getElementById('info-btn');
    const infoModal = document.getElementById('info-modal');
    const infoModalClose = infoModal.querySelector('.info-modal-close');

    // Show modal initially
    infoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Open modal when info button is clicked
    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            infoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal when close button is clicked
    if (infoModalClose) {
        infoModalClose.addEventListener('click', function() {
            infoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && infoModal.style.display === 'block') {
            infoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
