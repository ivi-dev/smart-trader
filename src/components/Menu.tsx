import React from 'react';
import {capitalize} from '../utility';
import { Option } from '../redux/store';
import './Menu.css';

type MenuProp = {
    items: Option[]
    visible?: boolean
}

const Menu = (prop: MenuProp) => {
    let i = 0;
    return (
        <div className={`menu position-absolute rounded shadow ${prop.visible ? null : 'd-none'}`}>
            {prop.items.map(item => <a key={i++} href="/" 
                className="row no-gutters py-1 px-3 col-12 text-reset text-decoration-none" onClick={(e) => {if (item.onClick) {e.stopPropagation(); item.onClick(item.name)}}}>
                    {capitalize(item.name.toString())}
                </a>)}
        </div>
    );
}

export default Menu;