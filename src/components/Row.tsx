import React from 'react';

type RowProp = {
    children: {}
}

const Row = (prop: RowProp) =>
    <div className="row">
        {prop.children}
    </div>

export default Row;