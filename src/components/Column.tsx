import React from 'react';
import './Column.css';

type ColumnProp = {
    classes?: string,
    children?: {}
}

const Column = (prop: ColumnProp) =>
    <section className={prop.classes}>
        {prop.children}
    </section>

export default Column;