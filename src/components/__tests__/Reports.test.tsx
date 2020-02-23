import React from 'react';
import { render } from '@testing-library/react';
import Reports from '../Reports';
import Table, { TableCell, TableRow, OrderType } from '../../models/Table';
import List, { ListRow } from '../../models/List';
import { ActivityType } from '../../models/Activity';
import Alert, { AlertLevel } from '../../models/Alert';
import { Action } from '../../redux/actions';
import Box from '../../models/Box';
import { BoxType } from '../../models/Box';

const mockDispatch = jest.fn((action: Action) => {});

const headerContent = ['Time', 'Stock', 'Price', 'Type'];
const cellsContent = ['1m', 'ABC', '123', 'SELL'];
const headers: TableCell[] = [];
for (const item of headerContent) {
    headers.push(new TableCell(item));
}
const cells: TableCell[] = [];
for (const item of cellsContent) {
    cells.push(new TableCell(item));
}
const row = new TableRow(cells, 'sell');
const orderHistory = new Table(headers, [row]);

const activitiesRow = new ListRow('Item');
const activities = new List([activitiesRow]);

const headlinesRow = new ListRow('Item');
const headlines = new List([headlinesRow]);

const alerts = [new Alert(0, 'Alert')];

const data = {orderHistory, activities, headlines, headlinesMenuItems: 
    [{name: 'Item 1'}, {name: 'Item 2'}], alerts,
    headlinesTitle: 'Business',
    ordersDisplayOptions: [],
    activityDisplayOptions: [],
    alertDisplayOptions: [],
    menuVisible: false,
    displayedOrdersLevel: 'all' as OrderType,
    displayedActivitiesLevel: 'all' as ActivityType,
    displayedAlertsLevel: 'all' as AlertLevel};

let boxes = [new Box(1, 'Box 1', BoxType.ORDER_HISTORY), 
               new Box(2, 'Box 2', BoxType.RECENT_ACTIVITY), 
               new Box(3, 'Box 3', BoxType.HEADLINES), 
               new Box(4, 'Box 4', BoxType.ALERTS)];

const renderReports = () => {
    return render(<Reports data={data} 
                           boxes={boxes} 
                           selectedBox={null} 
                           dispatch={mockDispatch} />);
}

test('render a section with report boxes', () => {
    const { container } = renderReports();
    expect(container.children[0].children).toHaveLength(boxes.length);
});

test('render a section with report boxes, showing items in categories different than \'all\'', () => {
    data.displayedOrdersLevel = 'buy';
    data.displayedActivitiesLevel = 'trade';
    data.displayedAlertsLevel = 'info';
    const { container } = renderReports();
    expect(container.children[0].children).toHaveLength(boxes.length);
});

test('render a section with report boxes, showing items in categories different than \'all\'', () => {
    boxes = [];
    const { container } = renderReports();
    expect(container.querySelector('.empty-label')).toBeTruthy();
});