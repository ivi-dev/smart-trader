import React from 'react';
import './Reports.css';
import BoxData, { BoxType } from '../BoxData';
import Box from './Box';
import { ReportData } from '../redux/store';
import { Action } from '../redux/actions';
import ListData from '../ListData';
import TableData from '../TableData';

type ReportsProp = {
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
    </section> : 
    prop.boxes.map(box => {
        switch (box.type) {
            case BoxType.ORDER_HISTORY:
                let orders = prop.data.orderHistory.rows;
                if (prop.data.displayedOrdersLevel !== 'all') {
                    orders = orders.slice().filter(order => 
                        order.type === prop.data.displayedOrdersLevel);
                }
                return <Box key={box.id} 
                            id={box.id} 
                            title={box.title} 
                            status={'No data yet.'} 
                            menuVisible={box.menuVisible}
                            selectedBox={prop.selectedBox}
                            tableData={new TableData(prop.data.orderHistory.headers, orders)} 
                            dispatch={prop.dispatch}
                            menuItems={prop.data.ordersDisplayOptions} />
            case BoxType.RECENT_ACTIVIY:
                let activities = prop.data.activities.items;
                if (prop.data.displayedActivitiesLevel !== 'all') {
                    activities = activities.slice().filter(activity => 
                        activity.type === prop.data.displayedActivitiesLevel);
                }
                return <Box key={box.id} 
                            id={box.id} 
                            title={box.title} 
                            status={'No data yet.'} 
                            menuVisible={box.menuVisible}
                            selectedBox={prop.selectedBox}
                            listData={new ListData(activities)} 
                            dispatch={prop.dispatch} 
                            menuItems={prop.data.activityDisplayOptions} />
            case BoxType.HEADLINES:
                return <Box key={box.id} 
                            id={box.id} 
                            title={box.title} 
                            status={'Fetching headlines...'} 
                            menuVisible={box.menuVisible}
                            classes={'headlines'} 
                            secondary={<span className="small text-muted">
                                Powered by NewsAPI.com</span>} 
                            selectedBox={prop.selectedBox}
                            listData={prop.data.headlines} 
                            listTitle={prop.data.headlinesTitle} 
                            dispatch={prop.dispatch} 
                            menuItems={prop.data.headlinesMenuItems} />
            default:
                let alerts = prop.data.alerts;
                if (prop.data.displayedAlertsLevel !== 'all') {
                    alerts = prop.data.alerts.slice().filter(alert => 
                        alert.level === prop.data.displayedAlertsLevel);
                }
                return <Box key={box.id} 
                            id={box.id} 
                            title={box.title} 
                            status={'No alerts.'} 
                            menuVisible={box.menuVisible}
                            selectedBox={prop.selectedBox}
                            alerts={alerts} 
                            dispatch={prop.dispatch} 
                            menuItems={prop.data.alertDisplayOptions} />
        }
    });
    return (
    <section className="reports row no-gutters px-4 mt-2">
        {content}
    </section>
    );
    
}

export default Reports;