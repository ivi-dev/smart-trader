import React from 'react';
import './Row.css';

type RowProp = {
    children: {},
    classes?: string
}

const Row = (prop: RowProp) =>
    <div className={`row px-3 ${prop.classes}`} style={{'height': '52vh'}}>
        {prop.children}
    </div>

export default Row;