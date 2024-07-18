import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

console.log("WOAH");

const MySwal = withReactContent(Swal);

document.addEventListener('DOMContentLoaded', function() {
    alert('DOM fully loaded and parsed');
    const calendarElements = document.querySelectorAll('.wp-block-terrificobjects-radio-scheduler');

    calendarElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const padding = style.padding;
        const margin = '0px'; // Explicitly set margin to 0px
        const backgroundColor = style.backgroundColor;
        const color = style.color;
        const fontSize = style.fontSize;
        const width = style.width;
        const fullWidth = element.classList.contains('is-full-width');

        alert('Rendering CalendarComponent in element');

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
        alert('Fetching events...');
        fetch('/wp-json/radio-scheduler/v1/events')
            .then(response => response.json())
            .then(data => {
                alert('Fetched events: ' + JSON.stringify(data));
                setEvents(data);
            })
            .catch(error => alert('Error fetching events: ' + error));
    }, []);

    const handleEventClick = (info) => {
        alert('Event clicked: ' + JSON.stringify(info.event));
        MySwal.fire({
            title: info.event.title,
            text: 'Event details',
            icon: 'info',
            confirmButtonText: 'Close'
        });
    };

    alert('Rendering FullCalendar with events');

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
        />
    );
};

export default CalendarComponent;
