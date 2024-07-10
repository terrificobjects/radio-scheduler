document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        selectHelper: true,
        select: function(info) {
            Swal.fire({
                title: 'Create Event',
                html:
                    '<input id="event-name" class="swal2-input" placeholder="Event Name">' +
                    '<input id="event-artist" class="swal2-input" placeholder="Artist">' +
                    '<input id="event-genre" class="swal2-input" placeholder="Genre">' +
                    '<input id="event-url" class="swal2-input" placeholder="URL">' +
                    '<input id="event-station" class="swal2-input" placeholder="Station">',
                showCancelButton: true,
                confirmButtonText: 'Create',
                preConfirm: () => {
                    const eventName = document.getElementById('event-name').value;
                    const eventArtist = document.getElementById('event-artist').value;
                    const eventGenre = document.getElementById('event-genre').value;
                    const eventURL = document.getElementById('event-url').value;
                    const eventStation = document.getElementById('event-station').value;
                    return {
                        eventName: eventName,
                        eventArtist: eventArtist,
                        eventGenre: eventGenre,
                        eventURL: eventURL,
                        eventStation: eventStation
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const eventData = {
                        title: result.value.eventName,
                        start: info.startStr,
                        end: info.endStr
                    };
                    calendar.addEvent(eventData);

                    // Send data to server to save in database
                    jQuery.post(radioSchedulerAjax.ajax_url, {
                        action: 'radio_scheduler_create_event',
                        data: {
                            eventName: result.value.eventName,
                            eventArtist: result.value.eventArtist,
                            eventGenre: result.value.eventGenre,
                            eventURL: result.value.eventURL,
                            eventStation: result.value.eventStation,
                            start: info.startStr,
                            end: info.endStr
                        },
                        nonce: radioSchedulerAjax.nonce
                    });
                }
            });
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            jQuery.get(radioSchedulerAjax.ajax_url, {
                action: 'radio_scheduler_get_events',
                nonce: radioSchedulerAjax.nonce
            }, function(response) {
                successCallback(response.data);
            });
        }
    });
    calendar.render();
});
