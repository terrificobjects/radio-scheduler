import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/wp-json/radio-scheduler/v1/events');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };
        fetchEvents();
    }, []);

    const handleEventClick = (info) => {
        info.el.classList.add('custom-event-handler');
        info.el.dataset.eventId = info.event.id;
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
        />
    );
};

document.addEventListener('DOMContentLoaded', () => {
    const calendarElements = document.querySelectorAll('.wp-block-terrificobjects-radio-scheduler');

    calendarElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const padding = style.padding;
        const margin = '0px';
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        const fontSize = style.fontSize;
        const width = style.width;
        const fullWidth = element.classList.contains('is-full-width');

        ReactDOM.render(
            <div style={{ padding, margin, backgroundColor, color, fontSize, width: fullWidth ? '100%' : width, boxSizing: 'border-box' }}>
                <CalendarComponent />
            </div>,
            element
        );
    });
});
