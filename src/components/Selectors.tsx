import React from 'react';

interface SelectorsProp {
    children: {}
}

export interface SelectorsComponent {
    (prop: SelectorsProp): JSX.Element;
}

const Selectors: SelectorsComponent = (prop: SelectorsProp) =>
    <section className="row selectors justify-content-between align-items-center no-gutters pt-3 px-4">
        {prop.children}
    </section>

export default Selectors;
