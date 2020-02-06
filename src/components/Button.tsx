import React from 'react';
import './Button.css';

interface ButtonProp {
    title: string,
    onClick: () => void,
    classes: string
}

const Button = (prop: ButtonProp) => 
    <button className={`btn btn-sm btn-outline-light ${prop.classes}`} onClick={() => prop.onClick()}>{prop.title}</button>

export default Button;