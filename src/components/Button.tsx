import React from 'react';
import './Button.css';

type ButtonProp = {
    title?: string,
    graphic?: string,
    onClick: (value?: any) => void,
    classes?: string,
    style?: {}
}

const Button = (prop: ButtonProp) => 
    <button className={`btn btn-sm btn-outline-light single ${prop.classes}`} style={prop.style} onClick={() => prop.onClick()}>{prop.title ? prop.title : <i className={prop.graphic}></i>}</button>

export default Button;