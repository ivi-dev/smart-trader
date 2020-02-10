import React, { useEffect } from 'react';
import TableData from '../TableData';
import ListData from '../ListData';
import Alert from '../Alert';
import './Box.css';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

interface BoxProp {
    id: number,
    title: string,
    selected: boolean,
    tableData?: TableData,
    listData?: ListData,
    alerts?: Alert[],
    dispatch: (action: Action) => void
}

export interface BoxComponent {
    (prop: BoxProp): JSX.Element;
}

const Box: BoxComponent = (prop: BoxProp) => {
    let content = null;
    if (prop.tableData) {
        if (prop.tableData?.rows.length === 0) {
            content = <div className="empty-label text-muted text-center col-12 mt-5">No data yet.</div>
        } else {
            content = <div className="row no-gutters content">
                         <div className="col-12 table-headers row no-gutters position-absolute">
                            {prop.tableData?.headers.map((header, index) => 
                            <div key={index} className="col text-center">
                                {header.content}
                            </div>)}
                         </div>
                         <div className="scroll-area col-12">
                            <table id="order-history-table" className="col-12 mt-4 table table-borderless table-hover">
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
                <div className="empty-label text-muted text-center col-12 mt-5">No data yet.</div>
            </div>
        } else {
            content = <div className="scroll-area mt-2">
                {prop.listData.items.map((item, index) => 
                <div key={index} className="row data-row no-gutters px-3 py-1 border-bottom">
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
                <div className="empty-label text-muted text-center col-12 mt-5">No data yet.</div>
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
    const handleKeyDown = (keyCode: number) => {
        if (keyCode === 37) {
            prop.dispatch(actions.moveBoxBack(prop.id));
        } else if (keyCode === 39) {
            prop.dispatch(actions.moveBoxForward(prop.id));
        }
    }
    return (
        <div className={`box col mr-3 mb-2 mt-1 shadow pb-1 rounded ${prop.selected ? 'selected' : null}`} onClick={() => prop.dispatch(actions.selectBox(prop.id))} tabIndex={prop.id} onKeyDown={(e) => handleKeyDown(e.keyCode)}>
            <div className="row no-gutters header p-2 pl-3 align-items-center">
                {prop.title}
                <i className="fas fa-times px-2 py-1 ml-auto rounded" onClick={() => {prop.dispatch(actions.removeBox(prop.id))}}></i>
            </div>
            {content}
        </div>
    );
}

export default Box;