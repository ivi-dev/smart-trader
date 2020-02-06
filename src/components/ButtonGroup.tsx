import React from 'react';
import { Option } from './Selector';
import './ButtonGroup.css';

interface ButtonGroupProp {
    options: Option[],
    active: string,
    handleSelect: (value: string) => void
}

const ButtonGroup = (prop: ButtonGroupProp) => {
    let i = 0;
    return (
        <div className="col-auto btn-group btn-group-sm resolution-options shadow-sm" role="group" 
        aria-label="Timespan selector">
            {prop.options.map(option => 
                <button key={i++} type="button" 
                    className={`btn btn-secondary ${option.name === prop.active ? 'active' : null}`} onClick={(e) => {prop.handleSelect((e.target as HTMLSelectElement).innerHTML)}}>
                    {option.name}
                </button>)}
        </div>
    );
}

export default ButtonGroup;