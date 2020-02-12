import React, { useEffect, RefObject } from 'react';
import './Help.css';
import { Option } from '../redux/store';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

type HelpProp = {
    visible?: boolean,
    sections: Option[],
    active: string,
    content: string,
    dispatch?: (action: Action) => void
}

const Help = (prop: HelpProp) => {
    const handleKeyDown = (keyCode: number) => {
        if (keyCode === 27) {
            if (prop.dispatch) {
                prop.dispatch(actions.toggleHelp());
            }
        }
    }
    const ref: RefObject<HTMLDivElement> = React.createRef();
    useEffect(() => {
        (ref.current as HTMLDivElement).focus();
    });
    return (
        <div className={`help position-fixed shadow rounded p-4 ${prop.visible ? 'slid-down' : 'slid-up'}`} tabIndex={0} onKeyDown={(e) => handleKeyDown(e.keyCode)} ref={ref}>
        <i className="fas fa-times rounded position-absolute px-2 py-1" onClick={() => { if (prop.dispatch) {prop.dispatch(actions.toggleHelp())}}}></i>
            <div className="row no-gutters mt-2 mb-3 border-bottom sections">
        {prop.sections.map((section, index) => <a key={index} href="#" className={`col-auto rounded-top p-1 px-2 text-reset text-decoration-none section mr-1 border ${prop.active.toLowerCase() === section.name.toString().toLowerCase() ? 'active' : null}`} onClick={() => {if(prop.dispatch) {prop.dispatch(actions.setActiveHelpSection(section.name.toString()))}}}>{section.name}</a>)}
            </div>
            <div className="row no-gutters">
                {prop.content}
            </div>
        </div>
    );
}

export default Help;