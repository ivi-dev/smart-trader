import React from 'react';
import './Main.css';

interface MainProp {
    children?: {}
}

export interface MainComponent {
    (prop: MainProp): JSX.Element;
}

const Main: MainComponent = (prop: MainProp) =>
    <section id="main-area" className="col-10 vh-100">
        {prop.children}
    </section>

export default Main;