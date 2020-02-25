import React from 'react';
import './Help.css';
import { Option } from '../redux/store/types';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import Button from './Button';

type HelpProp = {
    visible?: boolean,
    sections: Option[],
    active: string,
    content: string,
    dispatch?: (action: Action) => void
}

const Help = (prop: HelpProp) => {
    const handleNextClick = () => {
        if (prop.dispatch) {
            let section = '';
            for (let index = 0; index < prop.sections.length; index++) {
                if (prop.sections[index].selected) {
                    section = prop.sections[index + 1].name.toString();
                    break;
                }
            }
            prop.dispatch(actions.setActiveHelpSection(section));
        }
    }
    const handlePreviousClick = () => {
        if (prop.dispatch) {
            let section = '';
            for (let index = 0; index < prop.sections.length; index++) {
                if (prop.sections[index].selected) {
                    section = prop.sections[index - 1].name.toString();
                    break;
                }
            }
            prop.dispatch(actions.setActiveHelpSection(section));
        }
    }
    const isLastSection = () => {
        return prop.active === 
            prop.sections[prop.sections.length - 1].name;
    }
    const isFirstSection = () => {
        return prop.active === prop.sections[0].name;
    }
    return (
        <div className={`help position-fixed shadow rounded p-4 ${prop.visible ? 'slid-down' : 'slid-up'}`} tabIndex={0}>
        <i className="fas fa-times rounded position-absolute px-2 py-1" 
           onClick={() => {if (prop.dispatch) {
               prop.dispatch(actions.toggleHelp('close'))
           }}}></i>
            <div className="row no-gutters mt-2 mb-3 border-bottom sections">
        {prop.sections.map((section, index) => <a key={index} 
                                                  href="/" 
                                                  className={`col-auto rounded-top p-1 px-2 text-reset text-decoration-none section mr-1 border ${prop.active.toLowerCase() === section.name.toString().toLowerCase() ? 'active' : null}`} 
        onClick={(e) => {e.preventDefault(); if(prop.dispatch) {prop.dispatch(actions.setActiveHelpSection(section.name.toString()))}}}>{section.name}</a>)}
            </div>
            <div className="row no-gutters content">
                <span dangerouslySetInnerHTML={{__html: prop.content}}></span>
            </div>
            {!isFirstSection() && <Button title='Previous' 
                                         classes='mt-4 mr-2' 
                                         onClick={() => handlePreviousClick()} />}
            {!isLastSection() && <Button title='Next' 
                                         classes='mt-4' 
                                         onClick={() => handleNextClick()} />}
        </div>
    );
}

export default Help;