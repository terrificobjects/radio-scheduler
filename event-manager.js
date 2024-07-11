jQuery(document).ready(function($) {
    function fetchEvents() {
        $.ajax({
            url: radioSchedulerAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'fetch_events',
                nonce: radioSchedulerAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    displayEvents(response.data);
                } else {
                    alert('Failed to fetch events.');
                }
            },
            error: function() {
                alert('Error fetching events.');
            }
        });
    }

    function displayEvents(events) {
        const eventList = $('#event-list');
        eventList.empty();

        events.forEach(event => {
            const eventElement = $(`
                <div class="event-item" data-id="${event.ID}">
                    <input type="text" class="event-name" value="${event.EventName}" />
                    <input type="date" class="event-date" value="${event.EventDate}" />
                    <input type="time" class="event-start-time" value="${event.EventStartTime}" />
                    <input type="time" class="event-end-time" value="${event.EventEndTime}" />
                    <input type="text" class="event-artist" value="${event.EventArtist}" />
                    <input type="text" class="event-genre" value="${event.EventGenre}" />
                    <input type="url" class="event-url" value="${event.EventURL}" />
                    <input type="text" class="event-station" value="${event.EventStation}" />
                    <select class="event-meta1">
                        <option value="enabled" ${event.EventMeta1 === 'enabled' ? 'selected' : ''}>Enabled</option>
                        <option value="disabled" ${event.EventMeta1 === 'disabled' ? 'selected' : ''}>Disabled</option>
                        <option value="cancelled" ${event.EventMeta1 === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <button class="update-event">Update</button>
                    <button class="delete-event">Delete</button>
                </div>
            `);

            eventElement.find('.update-event').on('click', function() {
                updateEvent(eventElement);
            });

            eventElement.find('.delete-event').on('click', function() {
                deleteEvent(event.ID);
            });

            eventList.append(eventElement);
        });
    }

    function updateEvent(eventElement) {
        const id = eventElement.data('id');
        const eventData = {
            id,
            EventName: eventElement.find('.event-name').val(),
            EventDate: eventElement.find('.event-date').val(),
            EventStartTime: eventElement.find('.event-start-time').val(),
            EventEndTime: eventElement.find('.event-end-time').val(),
            EventArtist: eventElement.find('.event-artist').val(),
            EventGenre: eventElement.find('.event-genre').val(),
            EventURL: eventElement.find('.event-url').val(),
            EventStation: eventElement.find('.event-station').val(),
            EventMeta1: eventElement.find('.event-meta1').val(),
            nonce: radioSchedulerAjax.nonce
        };

        $.ajax({
            url: radioSchedulerAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'update_event',
                ...eventData
            },
            success: function(response) {
                if (response.success) {
                    alert('Event updated successfully.');
                    fetchEvents();
                } else {
                    alert('Failed to update event.');
                }
            },
            error: function() {
                alert('Error updating event.');
            }
        });
    }

    function deleteEvent(id) {
        $.ajax({
            url: radioSchedulerAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'delete_event',
                id,
                nonce: radioSchedulerAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    alert('Event deleted successfully.');
                    fetchEvents();
                } else {
                    alert('Failed to delete event.');
                }
            },
            error: function() {
                alert('Error deleting event.');
            }
        });
    }

    fetchEvents();
});
