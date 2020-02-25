import React from 'react';
import { Option } from '../redux/store/types';
import './ButtonGroup.css';

type ButtonGroupProp = {
    options: Option[],
    classes?: string,
    btnClasses?: string,
    active?: string,
    handleSelect?: (data: string | number) => void
}

const ButtonGroup = (prop: ButtonGroupProp) => {
    let i = 0;
    const handleSelect = (option: Option) => {
        if (prop.handleSelect) {
            prop.handleSelect(option.name !== '' ? option.name : option.data!)
        } else if (option.onClick) {
            option.onClick(option.name !== '' ? option.name : option.data!)
        }
    }
    return (
        <div className={`col-auto btn-group btn-group-sm button-group shadow-sm ${prop.classes}`}role="group" 
        aria-label="Timespan selector">
            {prop.options.map(option => 
                <button key={i++} 
                        type="button" 
                        title={option.title}
                        className={`btn btn-secondary ${prop.active && (option.name === prop.active ||  option.graphic === prop.active) ? 'active' : null} ${prop.btnClasses}`} 
                        onClick={() => handleSelect(option)}>
                    {option.graphic ? <i className={option.graphic}></i> : option.name}
                </button>)}
        </div>
    );
}

export default ButtonGroup;