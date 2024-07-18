import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, ColorPalette, BlockControls, AlignmentToolbar, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import './editor.scss';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useState, useEffect } from 'react';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({
        style: {
            textAlign: attributes.align,
            backgroundColor: attributes.backgroundColor,
            color: attributes.textColor,
            padding: `${attributes.padding}px`,
            margin: `${attributes.margin}px`,
            fontSize: `${attributes.fontSize}px`,
            width: attributes.width,
            boxSizing: 'border-box'
        }
    });

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/wp-json/radio-scheduler/v1/events')
            .then(response => response.json())
            .then(data => {
                setEvents(data.map(event => ({
                    ...event,
                    backgroundColor: event.EventColor || attributes.eventColor,
                    borderColor: event.EventColor || attributes.eventColor
                })));
            })
            .catch(error => console.error('Error fetching events:', error));
    }, [attributes.eventColor]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Block Settings">
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
                        },
                        {
                            value: attributes.buttonSwalColor,
                            onChange: (color) => setAttributes({ buttonSwalColor: color }),
                            label: 'Button Color'
                        },
                        {
                            value: attributes.eventColor,
                            onChange: (color) => setAttributes({ eventColor: color }),
                            label: 'Event Color'
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
                    eventBackgroundColor={attributes.eventColor}
                />
            </div>
        </>
    );
}
