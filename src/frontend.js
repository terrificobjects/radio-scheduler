import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

document.addEventListener('DOMContentLoaded', function() {
    const calendarElements = document.querySelectorAll('.wp-block-create-block-radio-scheduler');
    
    calendarElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const padding = style.padding;
        const margin = '0px'; // Explicitly set margin to 0px
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        const fontSize = style.fontSize;
        const width = style.width;
        //const height = style.height;
        const fullWidth = element.classList.contains('is-full-width');

        ReactDOM.render(
            <div style={{ padding, margin, backgroundColor, color, fontSize, width: fullWidth ? '100%' : width, boxSizing: 'border-box' }}>
                <CalendarComponent />
            </div>,
            element
        );
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
