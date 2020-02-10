import React from 'react';
import './Row.css';

type RowProp = {
    children?: {},
    style?: {},
    classes?: string
}

const Row = (prop: RowProp) =>
    <div className={`row no-gutters align-items-center ${prop.classes}`} style={prop.style}>
        {prop.children}
    </div>

export default Row;