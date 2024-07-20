import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const MySwal = withReactContent(Swal);

const CalendarComponent = ({ backgroundColor, textColor, buttonSwalColor, defaultEventColor }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/wp-json/radio-scheduler/v1/events')
            .then(response => response.json())
            .then(data => {
                setEvents(data.map(event => {
                    const allDay = !event.extendedProps.EventStartTime && !event.extendedProps.EventEndTime;
                    return {
                        title: event.title,
                        start: allDay ? event.date : `${event.date}T${event.extendedProps.EventStartTime}`,
                        end: allDay ? null : `${event.date}T${event.extendedProps.EventEndTime}`,
                        backgroundColor: event.EventColor || defaultEventColor,
                        borderColor: event.EventColor || defaultEventColor,
                        textColor: textColor, 
                        extendedProps: event.extendedProps,
                        allDay
                    };
                }));
            })
            .catch(error => console.error('Error fetching events:', error));
    }, [defaultEventColor, textColor]);

    const convertTo12HourFormat = (time) => {
        const [hour, minute] = time.split(':');
        const period = +hour < 12 ? 'AM' : 'PM';
        const hour12 = +hour % 12 || 12;
        return `${hour12}:${minute} ${period}`;
    };

    const handleEventClick = (info) => {
        const eventDate = new Date(info.event.extendedProps.EventDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const startTime = info.event.extendedProps.EventStartTime 
            ? convertTo12HourFormat(info.event.extendedProps.EventStartTime)
            : 'All Day';

        const endTime = info.event.extendedProps.EventEndTime 
            ? convertTo12HourFormat(info.event.extendedProps.EventEndTime)
            : 'All Day';

        const eventDetails = `
            <strong>Event Name:</strong> ${info.event.title}<br>
            <strong>Date:</strong> ${eventDate}<br>
            <strong>Start Time:</strong> ${startTime}<br>
            <strong>End Time:</strong> ${endTime}<br>
            <strong>Station:</strong> ${info.event.extendedProps.EventStation}<br>
            <strong>Artist:</strong> ${info.event.extendedProps.EventArtist}<br>
            <strong>Genre:</strong> ${info.event.extendedProps.EventGenre}<br>
            <strong>URL:</strong> <a href="${info.event.extendedProps.EventURL}" target="_blank">${info.event.extendedProps.EventURL}</a>
        `;

        MySwal.fire({
            title: info.event.title,
            html: eventDetails,
            confirmButtonText: 'Close',
            background: backgroundColor,
            color: textColor,
            confirmButtonColor: buttonSwalColor
        });
    };

    return (
        <>
            <style>
                {`
                    .fc-daygrid-event {
                        width: 100% !important;
                    }
                    .fc-daygrid-event .fc-event-main {
                        width: 100% !important;
                    }
                `}
            </style>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick}
                displayEventTime={true}
                eventContent={renderEventContent}
                eventDisplay="block"
            />
        </>
    );
};

// We needed a render function for the background color on events
const renderEventContent = (eventInfo) => {
    return (
        <div style={{
            backgroundColor: eventInfo.backgroundColor,
            color: eventInfo.textColor,
            padding: '2px 5px',
            borderRadius: '3px',
            width: '100%',
            display: 'flex',
            alignItems: 'center'
        }}>
            <b style={{ marginRight: '20px' }}>{eventInfo.timeText}</b> {/* 5 characters space equivalent */}
            <i>{eventInfo.event.title}</i>
        </div>
    );
};

document.addEventListener('DOMContentLoaded', function() {
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
        const buttonSwalColor = element.getAttribute('data-button-swal-color');
        const eventColor = element.getAttribute('data-event-color');

        ReactDOM.render(
            <div style={{ padding, margin, backgroundColor, color, fontSize, width: fullWidth ? '100%' : width, boxSizing: 'border-box' }}>
                <CalendarComponent backgroundColor={backgroundColor} textColor={color} buttonSwalColor={buttonSwalColor} defaultEventColor={eventColor || '#007bff'} />
            </div>,
            element
        );
    });
});
