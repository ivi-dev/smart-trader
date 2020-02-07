import React from 'react';

type TextProp = {
    content: string,
    classes?: string,
    style?: {}
}

const Text = (prop: TextProp) =>
    <span className={prop.classes} style={prop.style}>{prop.content}</span>

export default Text;