import React from 'react';
import { render } from '@testing-library/react';
import Reports from './Reports';
import TableData, { TableCell, TableRow } from '../TableData';
import ListData, { ListDataRow } from '../ListData';
import AlertData from '../AlertData';
import { Action } from '../redux/actions';
import BoxData from '../BoxData';
import { BoxType } from '../BoxData';

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
    const row = new TableRow(cells);
    const orderHistory = new TableData(headers, [row]);
    
    const activitiesRow = new ListDataRow('Item');
    const activities = new ListData([activitiesRow]);

    const headlinesRow = new ListDataRow('Item');
    const headlines = new ListData([headlinesRow]);

    const alerts = [new AlertData(0, 'Alert')];

    const data = {orderHistory, activities, headlines, headlinesMenuItems: 
        [{name: 'Item 1'}, {name: 'Item 2'}], alerts};

    const boxes = [new BoxData(0, 'Box 1', BoxType.ORDER_HISTORY)];
    const { container } = render(<Reports data={data} 
                                          boxes={boxes} 
                                          selectedBox={null} 
                                          dispatch={mockDispatch} />);
    expect(container.children[0].children).toHaveLength(boxes.length);
});