import React from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

document.addEventListener('DOMContentLoaded', function() {
    const calendarElements = document.querySelectorAll('.wp-block-arufa-radio-scheduler');
    
    calendarElements.forEach(element => {
        ReactDOM.render(
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={[
                    { title: 'Event 1', date: '2024-07-01' },
                    { title: 'Event 2', date: '2024-07-02' }
                ]}
            />,
            element
        );
    });
});
