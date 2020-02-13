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
                return <Box key={box.id} id={box.id} title={box.title} status={'No data yet.'} selectedBox={prop.selectedBox}
                    tableData={prop.data.orderHistory} dispatch={prop.dispatch}  />
            case BoxType.RECENT_ACTIVIY:
                return <Box key={box.id} id={box.id} title={box.title} status={'No data yet.'} selectedBox={prop.selectedBox}
                    listData={prop.data.activities} dispatch={prop.dispatch}  />
            case BoxType.HEADLINES:
                return <Box key={box.id} id={box.id} title={box.title} status={'Fetching headlines...'} classes={'headlines'} secondary={<span className="small text-muted">Powered by NewsAPI.com</span>} selectedBox={prop.selectedBox}
                    listData={prop.data.headlines} listTitle={prop.data.headlinesTitle} dispatch={prop.dispatch} menuItems={prop.data.headlinesMenuItems} />
            default:
                let alerts = prop.data.alerts;
                if (prop.data.displayedAlertsLevel !== 'all') {
                    alerts = prop.data.alerts.slice().filter(alert => alert.level === prop.data.displayedAlertsLevel);
                }
                return <Box key={box.id} id={box.id} title={box.title} status={'No alerts.'} selectedBox={prop.selectedBox}
                    alerts={alerts} dispatch={prop.dispatch} menuItems={prop.data.alertDisplayOptions} />
        }
    });
    return (
    <section className="reports row no-gutters px-4 mt-2">
        {content}
    </section>
    );
    
}

export default Reports;