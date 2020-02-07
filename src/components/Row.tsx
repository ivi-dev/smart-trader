import React from 'react';

type RowProp = {
    children: {}
}

const Row = (prop: RowProp) =>
    <div className="row px-3">
        {prop.children}
    </div>

export default Row;