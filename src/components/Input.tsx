import React from 'react';
import './Input.css';

type InputProp = {
    type: string,
    value: string | number,
    placeholder?: string,
    classes?: string,
    style?: {},
    handleChange: (value: string) => void
}

const Input = (prop: InputProp) =>
    <input type={prop.type} 
           value={prop.value} 
           onChange={(e) => prop.handleChange(e.target.value)} 
           className={prop.classes} 
           style={prop.style} />

export default Input;