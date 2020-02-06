import React from 'react';
import './StatusBar.css';

interface StatusBarProp {
    children: {}
}

export interface StatusBarComponent {
    (prop: StatusBarProp): JSX.Element;
}

const StatusBar: StatusBarComponent = (prop: StatusBarProp) =>
    <section className="row status-bar px-4 align-items-center 
        no-gutters border-bottom">
        {prop.children}
    </section>

export default StatusBar;