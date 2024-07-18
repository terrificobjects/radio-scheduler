import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const MySwal = withReactContent(Swal);

const CalendarComponent = ({ backgroundColor, textColor, buttonSwalColor, eventColor }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/wp-json/radio-scheduler/v1/events')
            .then(response => response.json())
            .then(data => {
                setEvents(data.map(event => ({
                    ...event,
                    backgroundColor: eventColor,
                    borderColor: eventColor
                })));
            })
            .catch(error => console.error('Error fetching events:', error));
    }, [eventColor]);

    const handleEventClick = (info) => {
        console.log("Button Swal Color (inside handleEventClick):", buttonSwalColor);
        MySwal.fire({
            title: info.event.title,
            text: 'Event details',
            icon: 'info',
            confirmButtonText: 'Close',
            background: backgroundColor,
            color: textColor,
            confirmButtonColor: buttonSwalColor
        });
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

document.addEventListener('DOMContentLoaded', function() {
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
        const buttonSwalColor = element.getAttribute('data-button-swal-color');
        const eventColor = element.getAttribute('data-event-color');

        console.log("Element attributes:", {
            backgroundColor,
            color,
            buttonSwalColor,
            eventColor
        });

        if (!buttonSwalColor) {
            console.error('Button Swal color is not set.');
        }

        ReactDOM.render(
            <div style={{ padding, margin, backgroundColor, color, fontSize, width: fullWidth ? '100%' : width, boxSizing: 'border-box' }}>
                <CalendarComponent backgroundColor={backgroundColor} textColor={color} buttonSwalColor={buttonSwalColor} eventColor={eventColor || '#007bff'} />
            </div>,
            element
        );
    });
});
