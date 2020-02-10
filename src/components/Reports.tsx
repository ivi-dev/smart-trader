import React from 'react';
import './Reports.css';
import BoxData, { BoxType } from '../BoxData';
import Box from './Box';
import { ReportData } from '../redux/store';
import { Action } from '../redux/actions';

interface ReportsProp {
    data: ReportData,
    boxes: BoxData[],
    selectedBox: number | null,
    dispatch: (action: Action) => void
}

const Reports = (prop: ReportsProp) => {
    let content = prop.boxes.length === 0 ? 
    <section className="reports row col-12 no-gutters px-4 mt-4">
        <div className="empty-label row justify-content-center col-auto mt-5 mx-auto text-muted">
            Use the buttons on the top right of the screen to add reports.
        </div>
    </section>: 
    prop.boxes.map(box => {
        switch (box.type) {
            case BoxType.ORDER_HISTORY:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    tableData={prop.data.orderHistory} dispatch={prop.dispatch}  />
            case BoxType.RECENT_ACTIVIY:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    listData={prop.data.activities} dispatch={prop.dispatch}  />
            case BoxType.HEADLINES:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    listData={prop.data.headlines} dispatch={prop.dispatch}   />
            default:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    alerts={prop.data.alerts} dispatch={prop.dispatch} />
        }
    });
    return (
    <section className="reports row no-gutters px-4 mt-2">
        {content}
    </section>
    );
    
}

export default Reports;