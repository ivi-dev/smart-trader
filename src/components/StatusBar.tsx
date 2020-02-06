import React from 'react';
import './StatusBar.css';

interface StatusBarProp {
    children: {}
}

const StatusBar = (prop: StatusBarProp) =>
    <section className="row status-bar px-4 align-items-center 
        no-gutters border-bottom">
        {prop.children}
    </section>

export default StatusBar;