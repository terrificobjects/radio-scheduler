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

        // Add column titles
        const headerRow = $(`
            <div class="event-item event-header">
                <div class="event-column">Event Name</div>
                <div class="event-column">Date</div>
                <div class="event-column">Start Time</div>
                <div class="event-column">End Time</div>
                <div class="event-column">Artist</div>
                <div class="event-column">Genre</div>
                <div class="event-column">URL</div>
                <div class="event-column">Station</div>
                <div class="event-column">Status</div>
                <div class="event-column">Event Color</div>
                <div class="event-column">Actions</div>
            </div>
        `);
        eventList.append(headerRow);

        events.forEach(event => {
            const eventElement = $(`
                <div class="event-item" data-id="${event.ID}">
                    <div class="event-column"><input type="text" class="event-name" value="${event.EventName}" /></div>
                    <div class="event-column"><input type="date" class="event-date" value="${event.EventDate}" /></div>
                    <div class="event-column"><input type="time" class="event-start-time" value="${event.EventStartTime}" /></div>
                    <div class="event-column"><input type="time" class="event-end-time" value="${event.EventEndTime}" /></div>
                    <div class="event-column"><input type="text" class="event-artist" value="${event.EventArtist}" /></div>
                    <div class="event-column"><input type="text" class="event-genre" value="${event.EventGenre}" /></div>
                    <div class="event-column"><input type="url" class="event-url" value="${event.EventURL}" /></div>
                    <div class="event-column"><input type="text" class="event-station" value="${event.EventStation}" /></div>
                    <div class="event-column">
                        <select class="event-meta1">
                            <option value="enabled" ${event.EventMeta1 === 'enabled' ? 'selected' : ''}>Enabled</option>
                            <option value="disabled" ${event.EventMeta1 === 'disabled' ? 'selected' : ''}>Disabled</option>
                            <option value="cancelled" ${event.EventMeta1 === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    <div class="event-column"><input type="text" class="event-color" value="${event.EventColor}" /></div>
                    <div class="event-column">
                        <button class="update-event">Update</button>
                        <button class="delete-event">Delete</button>
                    </div>
                </div>
            `);

            // Initialize the WordPress color picker
            eventElement.find('.event-color').wpColorPicker();

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
            EventColor: eventElement.find('.event-color').val(),
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

    function addNewEvent() {
        const newEventElement = $(`
            <div class="event-item">
                <div class="event-column"><input type="text" class="event-name" placeholder="Event Name" /></div>
                <div class="event-column"><input type="date" class="event-date" /></div>
                <div class="event-column"><input type="time" class="event-start-time" /></div>
                <div class="event-column"><input type="time" class="event-end-time" /></div>
                <div class="event-column"><input type="text" class="event-artist" placeholder="Artist" /></div>
                <div class="event-column"><input type="text" class="event-genre" placeholder="Genre" /></div>
                <div class="event-column"><input type="url" class="event-url" placeholder="URL" /></div>
                <div class="event-column"><input type="text" class="event-station" placeholder="Station" /></div>
                <div class="event-column">
                    <select class="event-meta1">
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div class="event-column"><input type="text" class="event-color" placeholder="Event Color" /></div>
                <div class="event-column">
                    <button class="save-new-event">Save</button>
                    <button class="cancel-new-event">Cancel</button>
                </div>
            </div>
        `);

        // Initialize the WordPress color picker
        newEventElement.find('.event-color').wpColorPicker();

        newEventElement.find('.save-new-event').on('click', function() {
            saveNewEvent(newEventElement);
        });

        newEventElement.find('.cancel-new-event').on('click', function() {
            newEventElement.remove();
        });

        $('#event-list').append(newEventElement);
    }

    function saveNewEvent(eventElement) {
        const eventData = {
            EventName: eventElement.find('.event-name').val(),
            EventDate: eventElement.find('.event-date').val(),
            EventStartTime: eventElement.find('.event-start-time').val(),
            EventEndTime: eventElement.find('.event-end-time').val(),
            EventArtist: eventElement.find('.event-artist').val(),
            EventGenre: eventElement.find('.event-genre').val(),
            EventURL: eventElement.find('.event-url').val(),
            EventStation: eventElement.find('.event-station').val(),
            EventMeta1: eventElement.find('.event-meta1').val(),
            EventColor: eventElement.find('.event-color').val(),
            nonce: radioSchedulerAjax.nonce
        };

        $.ajax({
            url: radioSchedulerAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'add_event',
                ...eventData
            },
            success: function(response) {
                if (response.success) {
                    alert('Event added successfully.');
                    fetchEvents();
                } else {
                    alert('Failed to add event.');
                }
            },
            error: function() {
                alert('Error adding event.');
            }
        });
    }

    $('#add-new-event').on('click', function() {
        addNewEvent();
    });

    fetchEvents();
});
