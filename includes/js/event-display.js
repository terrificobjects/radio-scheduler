document.addEventListener('DOMContentLoaded', function() {
    // Add an event listener for custom event handlers
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('custom-event-handler')) {
            const eventId = event.target.dataset.eventId;
            // Replace with your desired action, such as showing an alert
            Swal.fire({
                title: 'Event Clicked',
                text: `Event ID: ${eventId}`,
                icon: 'info',
                confirmButtonText: 'Close'
            });
        }
    });
});
