import React from 'react';
import { render } from '@testing-library/react';
import Reports from './Reports';
import Table, { TableCell, TableRow, OrderType } from '../models/Table';
import ListData, { ListDataRow } from '../models/List';
import { ActivityType } from '../models/Activity';
import Alert, { AlertLevel } from '../models/Alert';
import { Action } from '../redux/actions';
import Box from '../models/Box';
import { BoxType } from '../models/Box';

const mockDispatch = jest.fn((action: Action) => {});

test('render a section with report boxes', () => {
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
    
    const activitiesRow = new ListDataRow('Item');
    const activities = new ListData([activitiesRow]);

    const headlinesRow = new ListDataRow('Item');
    const headlines = new ListData([headlinesRow]);

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

    const boxes = [new Box(0, 'Box 1', BoxType.ORDER_HISTORY)];
    const { container } = render(<Reports data={data} 
                                          boxes={boxes} 
                                          selectedBox={null} 
                                          dispatch={mockDispatch} />);
    expect(container.children[0].children).toHaveLength(boxes.length);
});