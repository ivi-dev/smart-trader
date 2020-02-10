import React from 'react';
import './Column.css';

interface ColumnProp {
    classes?: string,
    children?: {}
}

const Column = (prop: ColumnProp) =>
    <section className={prop.classes}>
        {prop.children}
    </section>

export default Column;