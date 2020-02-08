import React from 'react';
import './Reports.css';
import BoxData, { BoxType } from '../BoxData';
import Box from './Box';
import { ReportData } from '../redux/store';
import * as actions from '../redux/actions';
import { Action } from '../redux/actions';

interface ReportsProp {
    reportData: ReportData,
    boxes: BoxData[],
    selectedBox: number | null,
    dispatch: (action: Action) => void
}

export interface ReportsComponent {
    (prop: ReportsProp): JSX.Element;
}

const Reports: ReportsComponent = (prop: ReportsProp) => {
    let content = prop.boxes.length === 0 ? 
    <section className="reports row col-12 no-gutters px-4 mt-4">
        <div className="empty-label row justify-content-center col-auto mt-5 mx-auto text-muted">
            Click on the buttons on the top right of the screen to add reports
        </div>
    </section>: 
    prop.boxes.map(box => {
        switch (box.type) {
            case BoxType.ORDER_HISTORY:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    tableData={prop.reportData.orderHistory} dispatch={prop.dispatch}  />
            case BoxType.RECENT_ACTIVIY:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    listData={prop.reportData.activities} dispatch={prop.dispatch}  />
            case BoxType.HEADLINES:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    listData={prop.reportData.headlines} dispatch={prop.dispatch}   />
            default:
                return <Box key={box.id} id={box.id} title={box.title} selected={prop.selectedBox === box.id ? true : false}
                    alerts={prop.reportData.alerts} dispatch={prop.dispatch} />
        }
    });
    return (
    <section className="reports row no-gutters px-4 mt-2">
        {content}
    </section>
    );
    
}

export default Reports;