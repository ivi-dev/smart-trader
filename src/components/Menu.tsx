import React from 'react';
import {capitalize} from '../utility';
import './Menu.css';

interface MenuProp {
    items: string[]
    visible?: boolean
}

export interface MenuComponent {
    (prop: MenuProp): JSX.Element
}

const Menu: MenuComponent = (prop: MenuProp) => {
    let i = 0;
    return (
        <div className={`menu position-absolute rounded shadow ${prop.visible ? null : 'd-none'}`}>
            {prop.items.map(item => <a key={i++} href="#" 
                className="row no-gutters py-1 px-3 col-12 text-reset text-decoration-none">
                    {capitalize(item)}
                </a>)}
        </div>
    );
}

export default Menu;