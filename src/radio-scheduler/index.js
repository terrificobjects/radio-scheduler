import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, BlockControls, AlignmentToolbar, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, ToggleControl } from '@wordpress/components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

registerBlockType('terrificobjects/radio-scheduler', {
    title: 'Radio Scheduler',
    icon: 'calendar-alt',
    category: 'widgets',
    attributes: {
        align: {
            type: 'string',
            default: 'center'
        },
        backgroundColor: {
            type: 'string',
            default: '#ffffff'
        },
        textColor: {
            type: 'string',
            default: '#000000'
        },
        padding: {
            type: 'number',
            default: 20
        },
        margin: {
            type: 'number',
            default: 0
        },
        fontSize: {
            type: 'number',
            default: 16
        },
        width: {
            type: 'string',
            default: '100%'
        },
        fullWidth: {
            type: 'boolean',
            default: false
        }
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            style: {
                textAlign: attributes.align,
                backgroundColor: attributes.backgroundColor,
                color: attributes.textColor,
                padding: `${attributes.padding}px`,
                margin: `${attributes.margin}px`,
                fontSize: `${attributes.fontSize}px`,
                width: attributes.fullWidth ? '100%' : attributes.width,
                boxSizing: 'border-box'
            },
            className: attributes.fullWidth ? 'is-full-width' : ''
        });

        const [events, setEvents] = useState([]);

        useEffect(() => {
            console.log('Fetching events...');
            fetch('/wp-json/radio-scheduler/v1/events')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched events:', data);
                    setEvents(data);
                })
                .catch(error => console.error('Error fetching events:', error));
        }, []);

        const handleEventClick = (info) => {
            console.log('Event clicked:', info.event);
            Swal.fire({
                title: info.event.title,
                text: 'Event details',
                icon: 'info',
                confirmButtonText: 'Close'
            });
        };

        console.log('Rendering FullCalendar with events:', events);

        return (
            <>
                <InspectorControls>
                    <PanelBody title="Block Settings">
                        <ToggleControl
                            label="Full Width"
                            checked={attributes.fullWidth}
                            onChange={(value) => setAttributes({ fullWidth: value })}
                        />
                        <RangeControl
                            label="Padding"
                            value={attributes.padding}
                            onChange={(value) => setAttributes({ padding: value })}
                            min={0}
                            max={100}
                        />
                        <RangeControl
                            label="Margin"
                            value={attributes.margin}
                            onChange={(value) => setAttributes({ margin: value })}
                            min={0}
                            max={100}
                        />
                        <RangeControl
                            label="Font Size"
                            value={attributes.fontSize}
                            onChange={(value) => setAttributes({ fontSize: value })}
                            min={10}
                            max={50}
                        />
                        <TextControl
                            label="Width"
                            value={attributes.width}
                            onChange={(value) => setAttributes({ width: value })}
                            disabled={attributes.fullWidth}
                        />
                    </PanelBody>
                    <PanelColorSettings
                        title="Color Settings"
                        initialOpen={true}
                        colorSettings={[
                            {
                                value: attributes.backgroundColor,
                                onChange: (color) => setAttributes({ backgroundColor: color }),
                                label: 'Background Color'
                            },
                            {
                                value: attributes.textColor,
                                onChange: (color) => setAttributes({ textColor: color }),
                                label: 'Text Color'
                            }
                        ]}
                    />
                </InspectorControls>
                <BlockControls>
                    <AlignmentToolbar
                        value={attributes.align}
                        onChange={(align) => setAttributes({ align })}
                    />
                </BlockControls>
                <div {...blockProps}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventClick={handleEventClick}
                    />
                </div>
            </>
        );
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({
            style: {
                textAlign: attributes.align,
                backgroundColor: attributes.backgroundColor,
                color: attributes.textColor,
                padding: `${attributes.padding}px`,
                margin: '0px', // Ensure no margin is applied in saved content
                fontSize: `${attributes.fontSize}px`,
                width: attributes.fullWidth ? '100%' : attributes.width,
                boxSizing: 'border-box'
            },
            className: attributes.fullWidth ? 'is-full-width' : ''
        });

        return <div {...blockProps} className="wp-block-terrificobjects-radio-scheduler"></div>;
    }
});
