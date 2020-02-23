import React, { useEffect, RefObject } from 'react';
import {capitalize} from '../utility';
import { Option } from '../redux/store';
import './Menu.css';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

type MenuProp = {
    items: Option[],
    boxId?: number,
    visible?: boolean,
    dispatch: (action: Action) => void
}

const Menu = (prop: MenuProp) => {
    let i = 0;
    const ref: RefObject<HTMLDivElement> = React.createRef();
    useEffect(() => {
        ref.current!.focus();
    });
    const handleKeyPress = (keyCode: number) => {
        if (keyCode === 27) {
            if (prop.boxId) {
                prop.dispatch(actions.setMenuVisible(false, prop.boxId));
            }
        }
    }
    const handleItemSelect = () => {
        if (prop.boxId) {
            prop.dispatch(actions.setMenuVisible(false, prop.boxId!));
        }
    }
    return (
        <div ref={ref} 
             className={`menu position-absolute rounded shadow 
                ${prop.visible ? null : 'd-none'}`} 
             tabIndex={0} 
             onKeyDown={e => handleKeyPress(e.keyCode)}>
            {prop.items.map(item => <a key={i++} href="/" 
                className="row no-gutters py-1 px-3 col-12 text-reset text-decoration-none" 
                onClick={e => {if (item.onClick) {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    handleItemSelect();
                    item.onClick(item.name)}}}>
                    {capitalize(item.name.toString())}
                </a>)}
        </div>
    );
}

export default Menu;