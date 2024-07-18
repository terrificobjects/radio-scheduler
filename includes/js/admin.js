document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        selectHelper: true,
        select: function(info) {
            const formattedDate = new Date(info.start).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            Swal.fire({
                title: 'Create Event',
                html:
                    '<input id="event-name" class="swal2-input" placeholder="Event Name">' +
                    '<input id="event-artist" class="swal2-input" placeholder="Artist">' +
                    '<input id="event-genre" class="swal2-input" placeholder="Genre">' +
                    '<input id="event-url" class="swal2-input" placeholder="URL">' +
                    '<input id="event-station" class="swal2-input" placeholder="Station">' +
                    '<input id="event-start-time" class="swal2-input" type="time" placeholder="Start Time">' +
                    '<input id="event-end-time" class="swal2-input" type="time" placeholder="End Time">',
                showCancelButton: true,
                confirmButtonText: 'Create',
                preConfirm: () => {
                    const eventName = document.getElementById('event-name').value;
                    const eventArtist = document.getElementById('event-artist').value;
                    const eventGenre = document.getElementById('event-genre').value;
                    const eventURL = document.getElementById('event-url').value;
                    const eventStation = document.getElementById('event-station').value;
                    const eventStartTime = document.getElementById('event-start-time').value;
                    const eventEndTime = document.getElementById('event-end-time').value;
                    return {
                        eventName: eventName,
                        eventArtist: eventArtist,
                        eventGenre: eventGenre,
                        eventURL: eventURL,
                        eventStation: eventStation,
                        eventStartTime: eventStartTime,
                        eventEndTime: eventEndTime,
                        eventDate: formattedDate
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const start = `${info.startStr}T${result.value.eventStartTime}`;
                    const end = `${info.startStr}T${result.value.eventEndTime}`;
                    const eventData = {
                        title: result.value.eventName,
                        start: start,
                        end: end
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
                            start: start,
                            end: end,
                            eventDate: result.value.eventDate
                        },
                        nonce: radioSchedulerAjax.nonce
                    });
                }
            });
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            const start = fetchInfo.startStr;
            const end = fetchInfo.endStr;
            jQuery.get(radioSchedulerAjax.ajax_url, {
                action: 'radio_scheduler_get_events',
                nonce: radioSchedulerAjax.nonce,
                start: start,
                end: end
            }, function(response) {
                if (response.success) {
                    successCallback(response.data);
                } else {
                    failureCallback(response.error);
                }
            });
        }
    });
    calendar.render();
});
