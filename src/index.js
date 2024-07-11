import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useState, useEffect } from 'react';

registerBlockType('arufa/radio-scheduler', {
    title: 'Radio Scheduler',
    icon: 'calendar-alt',
    category: 'widgets',
    edit: () => {
        const blockProps = useBlockProps();
        const [events, setEvents] = useState([]);

        useEffect(() => {
            fetch('/wp-json/radio-scheduler/v1/events')
                .then(response => response.text())
                .then(text => {
                    try {
                        const data = JSON.parse(text);
                        //uncomment below to log events in console fo debug
                        //console.log('Fetched events:', data);
                        setEvents(data);
                    } catch (error) {
                        console.error('Error parsing JSON:', error, 'Response text:', text);
                        alert('Failed to fetch events. Check console for details.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                    alert('Failed to fetch events. Check console for details.');
                });
        }, []);

        return (
            <div {...blockProps}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                />
            </div>
        );
    },
    save: () => {
        const blockProps = useBlockProps.save();
        return <div {...blockProps} className="wp-block-arufa-radio-scheduler"></div>;
    },
});
