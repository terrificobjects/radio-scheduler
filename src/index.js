import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import React from 'react';

registerBlockType('arufa/radio-scheduler', {
    title: 'Radio Scheduler',
    icon: 'calendar-alt',
    category: 'widgets',
    edit: () => {
        const blockProps = useBlockProps();

        return (
            <div {...blockProps}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                        { title: 'Event 1', date: '2024-07-01' },
                        { title: 'Event 2', date: '2024-07-02' }
                    ]}
                />
            </div>
        );
    },
    save: () => {
        const blockProps = useBlockProps.save();
        return <div {...blockProps} className="wp-block-arufa-radio-scheduler"></div>;
    },
});
