import React from 'react';
import './Button.css';

type ButtonProp = {
    title?: string,
    graphic?: string,
    classes?: string,
    style?: {},
    onClick: (value?: any) => void
}

const Button = (prop: ButtonProp) => 
    <button className={`btn btn-sm btn-outline-light single ${prop.classes}`} style={prop.style} onClick={e => prop.onClick(e)}>{prop.title ? prop.title : <i className={prop.graphic}></i>}</button>

export default Button;