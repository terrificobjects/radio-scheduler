import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const blockProps = useBlockProps.save({
        style: {
            textAlign: attributes.align,
            backgroundColor: attributes.backgroundColor,
            color: attributes.textColor,
            padding: `${attributes.padding}px`,
            margin: `${attributes.margin}px`,
            fontSize: `${attributes.fontSize}px`,
            width: attributes.width,
            height: attributes.height
        }
    });

    return (
        <div {...blockProps} className="wp-block-terrificobjects-radio-scheduler"></div>
    );
}
