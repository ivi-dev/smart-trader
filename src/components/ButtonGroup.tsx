import React from 'react';
import { Option } from '../redux/store';
import './ButtonGroup.css';

interface ButtonGroupProp {
    options: Option[],
    classes?: string,
    active?: string,
    handleSelect: (value: string) => void
}

const ButtonGroup = (prop: ButtonGroupProp) => {
    let i = 0;
    return (
        <div className={`col-auto btn-group btn-group-sm button-group shadow-sm ${prop.classes}`}role="group" 
        aria-label="Timespan selector">
            {prop.options.map(option => 
                <button key={i++} type="button" 
                    className={`btn btn-secondary ${option.name === prop.active ? 'active' : null}`} onClick={(e) => {prop.handleSelect((e.target as HTMLButtonElement).innerHTML)}}>
                    {option.graphic ? <i className={option.graphic}></i> : option.name}
                </button>)}
        </div>
    );
}

export default ButtonGroup;