import React from 'react';
import Table from '../models/Table';
import List from '../models/List';
import Alert from '../models/Alert';
import './style/Box.css';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import { Option } from '../redux/store/types';
import Menu from './Menu';
import { capitalize } from '../utility';

type BoxProp = {
    id: number,
    title: string,
    selectedBox: number | null,
    status?: string,
    menuItems?: Option[],
    menuVisible?: boolean,
    secondary?: JSX.Element,
    classes?: string,
    tableData?: Table,
    listTitle?: string,
    listData?: List,
    alerts?: Alert[],
    dispatch: (action: Action) => void
}

const Box = (prop: BoxProp) => {
    let content = <div className="empty-label text-muted text-center col-12 mt-5">
        {prop.status}
    </div>;
    if (prop.tableData) {
        if (prop.tableData?.rows.length === 0) {
            content = <div className="empty-label text-muted text-center col-12 mt-5">
                {prop.status}
            </div>
        } else {
            content = <div className="row no-gutters content">
                         <div className="scroll-area col-12">
                            <table id="order-history-table" className="col-12 table table-borderless table-hover">
                                <thead>
                                    <tr>
                                        {prop.tableData?.headers.map((header, index) => 
                                        <th key={index}>{header.content}</th>)}
                                    </tr>
                                </thead>
                               <tbody>
                                   {prop.tableData?.rows.map((row, index) => 
                                    <tr key={index}>
                                        {row.cells.map((cell, index) => 
                                        <td key={index} className={`text-center ${cell.classes}`}>
                                            {cell.content}
                                        </td>)}
                                    </tr>)}
                               </tbody>
                            </table>
                         </div>
                      </div>;
        }
    } else if (prop.listData) {
        if (prop.listData.items.length === 0) {
            content = <div className="scroll-area mt-2">
                            <div className="empty-label text-muted text-center col-12 mt-5">
                                {prop.status}
                            </div>
                        </div>;
        } else {
            content = <div className={`scroll-area ${prop.listTitle ? 'lower' : null}`}>
                {prop.listTitle && <div className="row no-gutters p-2 pl-4 list-title position-absolute col-12">{capitalize(prop.listTitle)}</div>}
                {prop.listData.items.map((item, index) => 
                <a key={index} className="row data-row text-decoration-none position-relative no-gutters px-3 py-2 border-bottom" 
                   href={item.href} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   onClick={e => e.stopPropagation()}>
                    {item.graphic && <i className={`row no-gutters col-auto ${item.graphic} align-items-center`}></i>}
                    <div className="col">
                        <div className="row no-gutters col-12">
                            {item.main}
                        </div>
                        <div className="row secondary no-gutters col-12">
                            {item.secondary}
                        </div>
                    </div>
                </a>)}
            </div>;
        }
    } else if (prop.alerts) {
        if (prop.alerts.length === 0) {
            content = <div className="scroll-area mt-2">
                <div className="empty-label text-muted text-center col-12 mt-5">
                    {prop.status}
                </div>
            </div>
        } else {
            content = <div className="scroll-area mt-2">
                {prop.alerts.map(alert => {
                    let icon = 'fas fa-info-circle', color = '#0099e6';
                    switch (alert.level) {
                        case 'error':
                            icon = 'fas fa-exclamation-circle';
                            color = '#ff6600';
                            break;
                        case 'warning':
                            icon = 'fas fa-exclamation-triangle';
                            color = '#e69900';
                            break;
                    }
                    return (
                        <div key={alert.id} className="row p-2 pl-3 mx-3 mb-2 no-gutters alert shadow-sm position-relative align-items-center">
                            <i className={`${icon} pr-3 col-auto`} 
                               style={{color: color}}></i>
                            <span className="pl-1 col-10">{alert.text}</span>
                            <i className="fas fa-times position-absolute" 
                               onClick={e => {
                                   e.stopPropagation();
                                   /* istanbul ignore next */
                                   prop.dispatch(actions.dismissAlert!(!e.altKey ? 
                                                                        alert.id : -1))}}>
                            </i>
                        </div>
                    )
                })}
            </div>
        }
    }
    /* istanbul ignore next */
    const handleKeyDown = (keyCode: number, altKey: boolean) => {
        if (prop.selectedBox === prop.id) {
            if (altKey) {
                if (keyCode === 37) {
                    prop.dispatch(actions.moveBoxBack(prop.id));
                } else if (keyCode === 39) {
                    prop.dispatch(actions.moveBoxForward(prop.id));
                } else if (keyCode === 69) {
                    prop.dispatch(actions.addAlert('error', 'Lorem ipsum'));
                } else if (keyCode === 87) {
                    prop.dispatch(actions.addAlert('warning', 'Lorem ipsum'));
                } else if (keyCode === 73) {
                    prop.dispatch(actions.addAlert('info', 'Lorem ipsum'));
                }
            }
            if (keyCode === 27) {
                prop.dispatch(actions.selectBox(prop.id));
            }
        }
    }
    return (
        <div className={`box col mr-3 mt-1 shadow pb-1 rounded 
            ${prop.classes} ${prop.selectedBox === prop.id ? 
                'selected' : null}`}
            onClick={() => prop.dispatch(actions.selectBox(prop.id))} 
            tabIndex={prop.id} 
            onKeyDown={e => handleKeyDown(e.keyCode, e.altKey)}>
            {prop.menuItems && <Menu items={prop.menuItems} 
                                     visible={prop.menuVisible} 
                                     boxId={prop.id} 
                                     dispatch={prop.dispatch} />}
            <div className="row no-gutters header p-2 pl-3 align-items-center">
                {prop.title}&nbsp;&nbsp;
                {prop.secondary}
                <i className="fas fa-ellipsis-v px-2 py-1 ml-auto rounded" 
                    onClick={e => {
                        e.stopPropagation(); 
                        prop.dispatch(actions.toggleMenu(prop.id))}}></i>
                <i className="fas fa-times px-2 py-1 rounded" 
                   onClick={e => {
                       e.stopPropagation(); 
                       prop.dispatch(actions.removeBox(prop.id))}}></i>
            </div>
            {content}
        </div>
    );
}

export default Box;