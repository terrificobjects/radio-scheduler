// We need custom CSS for color picker and input alignment
const style = document.createElement('style');
style.innerHTML = `
    .swal2-container .wp-picker-container {
        margin: 0 auto;
        text-align: center;
    }
    .swal2-container .wp-picker-container .wp-picker-input-wrap {
        display: none;
    }
    .swal2-container .wp-picker-container .wp-color-picker {
        width: 100%;
    }
    .input-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;'
        width: 100%;
    }
    .input-group .swal2-input {
        width: calc(33% - 20px);
        margin-bottom: 10px;
    }
    .input-container {
        margin-bottom: 10px;
    }
    #color-picker-container .swal2-input {
        width: 100%;
        display: inline-flex;
    }
    .scheduler-title {
        display: inline-flex;
        align-items: center;
        margin-bottom: 0;
    }
    .swal2-popup {
        width: 65%;
    }
    #event-name {
        width: 65%;
    }
    #event-start-time, #event-end-time {
        width: 50%;
    }
`;
document.head.appendChild(style);

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
                html: `
                <div class="input-container">
                    <input id="event-name" class="swal2-input" placeholder="Event Name">
                </div>
                <div class="input-group">
                    <input id="event-artist" class="swal2-input" placeholder="Artist">
                    <input id="event-genre" class="swal2-input" placeholder="Genre">
                </div>
                <div class="input-group">
                    <input id="event-url" class="swal2-input" placeholder="URL">
                    <input id="event-station" class="swal2-input" placeholder="Station">
                </div>
                <div class="input-group">
                    <div class="input-container" id="color-picker-container" style="border:none; box-shadow:none;">
                        <p class="scheduler-title">Select the calendar's event color:</p>&nbsp; <input id="event-color" class="swal2-input" placeholder="Event Color">
                    </div>
                    <div class="input-container">
                        <p class="scheduler-title">Start time:</p>&nbsp; <input id="event-start-time" class="swal2-input" type="time" placeholder="Start Time">
                    </div>
                    <div class="input-container">
                        <p class="scheduler-title">End time:</p>&nbsp; <input id="event-end-time" class="swal2-input" type="time" placeholder="End Time">
                    </div>
                </div>
            `,
                showCancelButton: true,
                didOpen: () => {
                    // Initialize the WordPress color picker
                    jQuery('#event-color').wpColorPicker();
                },
                confirmButtonText: 'Create',
                preConfirm: () => {
                    const eventName = document.getElementById('event-name').value;
                    const eventArtist = document.getElementById('event-artist').value;
                    const eventGenre = document.getElementById('event-genre').value;
                    const eventURL = document.getElementById('event-url').value;
                    const eventStation = document.getElementById('event-station').value;
                    const eventColor = document.getElementById('event-color').value;
                    const eventStartTime = document.getElementById('event-start-time').value;
                    const eventEndTime = document.getElementById('event-end-time').value;
                    return {
                        eventName: eventName,
                        eventArtist: eventArtist,
                        eventGenre: eventGenre,
                        eventURL: eventURL,
                        eventStation: eventStation,
                        eventColor: eventColor,
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
                        end: end,
                        backgroundColor: result.value.eventColor,
                        borderColor: result.value.eventColor
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
                            eventColor: result.value.eventColor,
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
