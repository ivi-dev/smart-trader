import React from 'react';
import './style/Column.css';

type ColumnProp = {
    classes?: string,
    children?: {}
}

const Column = (prop: ColumnProp) =>
    <section className={prop.classes}>
        {prop.children}
    </section>

export default Column;