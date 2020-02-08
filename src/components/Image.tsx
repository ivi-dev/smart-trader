import React from 'react';
import './Image.css';

type ImageProp = {
    src: string,
    size?: {width: number, height: number},
    alt?: string,
    classes?: string,
    style?: {}
}

const Image = (prop: ImageProp) =>
    <img src={prop.src} alt={prop.alt} width={prop.size?.width} height={prop.size?.height} style={prop.style} />

export default Image;