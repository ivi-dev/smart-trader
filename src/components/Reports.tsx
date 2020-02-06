import React from 'react';
import './Reports.css';
import BoxData, { BoxType } from '../BoxData';
import Box from './Box';
import { ReportData } from '../redux/store';

interface ReportsProp {
    reportData: ReportData,
    boxes: BoxData[],
    removeBox: (id: number) => void,
    dismissAlert: (id: number) => void
}

export interface ReportsComponent {
    (prop: ReportsProp): JSX.Element;
}

const Reports: ReportsComponent = (prop: ReportsProp) => {
    return (
    <section className="reports row no-gutters px-4 mt-4">
        {prop.boxes.map(box => {
            switch (box.type) {
                case BoxType.ORDER_HISTORY:
                    return <Box key={box.id} id={box.id} title={box.title} 
                        tableData={prop.reportData.orderHistory} removeBox={(id) => prop.removeBox(id)} />
                case BoxType.RECENT_ACTIVIY:
                    return <Box key={box.id} id={box.id} title={box.title} 
                        listData={prop.reportData.activities} removeBox={(id) => prop.removeBox(id)} />
                case BoxType.HEADLINES:
                    return <Box key={box.id} id={box.id} title={box.title} 
                        listData={prop.reportData.headlines} removeBox={(id) => prop.removeBox(id)}  />
                default:
                    return <Box key={box.id} id={box.id} title={box.title} 
                        alerts={prop.reportData.alerts} removeBox={(id) => prop.removeBox(id)} dismissAlert={(id) => prop.dismissAlert(id)} />
            }
        })}
    </section>
    );
    
}

export default Reports;