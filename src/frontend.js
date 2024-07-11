import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

document.addEventListener('DOMContentLoaded', function() {
    const calendarElements = document.querySelectorAll('.wp-block-arufa-radio-scheduler');
    
    calendarElements.forEach(element => {
        ReactDOM.render(<CalendarComponent />, element);
    });
});

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/wp-json/radio-scheduler/v1/events')
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            events={events}
        />
    );
};

