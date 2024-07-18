import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, ColorPalette, BlockControls, AlignmentToolbar, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import './editor.scss';

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
            //height: attributes.height
        }
    });

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
                            value: attributes.buttonColor,
                            onChange: (color) => setAttributes({ buttonColor: color }),
                            label: 'Button Color'
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
                { __('Radio Scheduler – hello from the editor!', 'radio-scheduler') }
            </div>
        </>
    );
}
