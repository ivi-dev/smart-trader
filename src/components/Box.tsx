import React, { useState } from 'react';
import TableData from '../TableData';
import ListData from '../ListData';
import Alert from '../Alert';
import './Box.css';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import { Option } from '../redux/store';
import Menu from './Menu';

interface BoxProp {
    id: number,
    title: string,
    status?: string,
    menuItems?: Option[],
    secondary?: JSX.Element,
    selectedBox: number | null,
    classes?: string,
    tableData?: TableData,
    listData?: ListData,
    alerts?: Alert[],
    dispatch: (action: Action) => void
}

export interface BoxComponent {
    (prop: BoxProp): JSX.Element;
}

const Box: BoxComponent = (prop: BoxProp) => {
    let content = <div className="empty-label text-muted text-center col-12 mt-5">{prop.status}</div>;
    if (prop.tableData) {
        if (prop.tableData?.rows.length === 0) {
            content = <div className="empty-label text-muted text-center col-12 mt-5">{prop.status}</div>
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
                      <div className="empty-label text-muted text-center col-12 mt-5">{prop.status}</div>
                  </div>;
        } else {
            content = <div className="scroll-area">
                {prop.listData.items.map((item, index) => 
                <div key={index} className="row data-row no-gutters px-3 py-2 border-bottom">
                    <div className="row no-gutters col-12">
                        {item.main}
                    </div>
                    <div className="row secondary no-gutters col-12">
                        {item.secondary && item.secondary}
                    </div>
                </div>)}
            </div>;
        }
    } else if (prop.alerts) {
        if (prop.alerts.length === 0) {
            content = <div className="scroll-area mt-2">
                <div className="empty-label text-muted text-center col-12 mt-5">{prop.status}</div>
            </div>
        } else {
            content = <div className="scroll-area mt-2">
                {prop.alerts.map(alert => 
                    <div key={alert.id} className="row p-2 pl-2 mx-3 mb-2 no-gutters alert shadow-sm position-relative">
                        {alert.text}
                        <i className="fas fa-times position-absolute" onClick={() => prop.dispatch(actions.dismissAlert!(alert.id))}></i>
                    </div>
                )}
            </div>
        }
    }
    const handleKeyDown = (keyCode: number, altlKey: boolean) => {
        if (keyCode === 37) {
            if (prop.selectedBox === prop.id) {
                if (altlKey) {
                    prop.dispatch(actions.moveBoxBack(prop.id));
                }
            }
        } else if (keyCode === 39) {
            if (prop.selectedBox === prop.id) {
                if (altlKey) {
                    prop.dispatch(actions.moveBoxForward(prop.id));
                }
            }
        } else if (keyCode === 27) {
            if (prop.selectedBox === prop.id) {
                prop.dispatch(actions.selectBox(prop.id))
            }
            setMenuVisible(false);
        }
    }
    const [ menuVisible, setMenuVisible ] = useState(false);
    return (
        <div className={`box col mr-3 mt-1 shadow pb-1 rounded ${prop.classes} ${prop.selectedBox === prop.id ? 'selected' : null}`} onClick={() => prop.dispatch(actions.selectBox(prop.id))} tabIndex={prop.id} onKeyDown={(e) => handleKeyDown(e.keyCode, e.altKey)}>
            {prop.menuItems && <Menu items={prop.menuItems} visible={menuVisible} />}
            <div className="row no-gutters header p-2 pl-3 align-items-center">
                {prop.title}&nbsp;&nbsp;
                {prop.secondary}
                <i className="fas fa-ellipsis-v px-2 py-1 ml-auto rounded" onClick={(e) => {e.stopPropagation(); setMenuVisible(!menuVisible)}}></i>
                <i className="fas fa-times px-2 py-1 rounded" onClick={() => {prop.dispatch(actions.removeBox(prop.id))}}></i>
            </div>
            {content}
        </div>
    );
}

export default Box;