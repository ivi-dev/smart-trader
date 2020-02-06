import React from 'react';
import './TimespanControls.css';

interface TimespanControlsProp {
    options: {title: string, active?: boolean}[]
}

export interface TimespanControlsComponent {
    (props: TimespanControlsProp): JSX.Element;
}

const TimespanControls: TimespanControlsComponent = (prop: TimespanControlsProp) => {
    let i = 0;
    return (
    <div className="col-auto btn-group btn-group-sm timespan-controls shadow-sm" role="group" 
    aria-label="Timespan selector">
        {prop.options.map(option => 
            <button key={i++} type="button" 
                className={`btn btn-secondary ${option.active === true ? 'active' : null}`}>
                {option.title}
            </button>)}
    </div>
    );
}

export default TimespanControls;