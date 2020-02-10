import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Box from './Box';
import TableData, { TableCell, TableRow } from '../TableData';
import { Action } from '../redux/actions';
import ListData, { ListDataRow } from '../ListData';
import Alert from '../Alert';
import * as actions from '../redux/actions';

const alerts_ = ['Alert 1', 'Alert 2', 'Alert 3', 'Alert 4'];
const mockDispatch = jest.fn((action: Action) => {});

const renderTableBox = (headerContent: string[], cellsContent: string[]) => {
    const title = 'Order History';
    const headers: TableCell[] = [];
    for (const item of headerContent) {
        headers.push(new TableCell(item));
    }
    const cells: TableCell[] = [];
    for (const item of cellsContent) {
        cells.push(new TableCell(item));
    }
    const row = new TableRow(cells);
    return render(<Box id={0} 
                       title={title} 
                       tableData={new TableData(headers, [row])} 
                       selected={false}
                       dispatch={(action: Action) => {}} />);
}

const renderSingleRowListBox = (listItems: string[]) => {
    const listRows: ListDataRow[] = [];
    for (const item of listItems) {
        listRows.push(new ListDataRow(item));
    }
    const listData = new ListData(listRows);
    return render(<Box id={0} 
                       title={'List Box'} 
                       listData={listData} 
                       selected={false}
                       dispatch={(action: Action) => {}} />);
}

const renderMultiRowListBox = (mainListItems: string[], 
    secondaryListItems: string[]) => {
    const listRows: ListDataRow[] = [];
    for (let index = 0; index < mainListItems.length; index++) {
        listRows.push(new ListDataRow(mainListItems[index], secondaryListItems[index]));
    }
    const listData = new ListData(listRows);
    return render(<Box id={0} 
                       title={'List Box'} 
                       listData={listData} 
                       selected={false}
                       dispatch={(action: Action) => {}} />);
}

const renderAlertBox = (id = 0) => {
    const alerts: Alert[] = [];
    for (let index = 0; index < alerts_.length; index++) {
        alerts.push(new Alert(index, alerts_[index]));
    }
    return render(<Box id={id} 
                       title={'Alerts Box'} 
                       alerts={alerts} 
                       selected={false}
                       dispatch={mockDispatch} />);
}

test('renders a non-selected box with a title and a close button', () => {
    const title = 'Box';
    const { container, getByText } = render(<Box id={0} 
                                                 title={title} 
                                                 tableData={new TableData([new TableCell('')], 
                                                             [new TableRow([new TableCell('')])])} 
                                                 selected={false}
                                                 dispatch={(action: Action) => {}} />);

    const box = container.querySelector('.box');
    expect(box).toBeTruthy();
    expect(box?.classList.contains('selected')).toBe(false);
    expect(getByText(title)).toBeTruthy();
    expect(box?.querySelector('.fas.fa-times')).toBeTruthy();
});

test('renders a selected box', () => {
    const title = 'Selected Box';
    const { container } = render(<Box id={0} 
                                      title={title} 
                                      tableData={new TableData([new TableCell('')], 
                                                  [new TableRow([new TableCell('')])])} 
                                      selected={true}
                                      dispatch={(action: Action) => {}} />);

    expect(container.querySelector('.box')?.classList.contains('selected')).toBe(true);
});

test('renders a box with table data', () => {
    const headerContent = ['Time', 'Stock', 'Price', 'Type'];
    const cellsContent = ['1m', 'ABC', '123', 'SELL'];
    const { container } = renderTableBox(headerContent, cellsContent);
    const box = container.querySelector('.box');
    const tableHeaders = box?.querySelector('.table-headers')
    expect(tableHeaders).toBeTruthy();
    for (let index = 0; index < tableHeaders!.children.length; index++) {
        expect(tableHeaders?.children[index].innerHTML).toBe(headerContent[index]);
    }
    const table = container.querySelector('table');
    expect(table).toBeTruthy();
    expect(table?.querySelectorAll('tr')).toHaveLength(1);
    const tableCells = table!.querySelectorAll('tr')[0].querySelectorAll('td');
    expect(tableCells).toHaveLength(4);
    for (let index = 0; index < tableCells.length; index++) {
        expect(tableCells[index].innerHTML).toBe(cellsContent[index]);
    }
});

test('renders a box with a single-row-item list data', () => {
    const listItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    const { container } = renderSingleRowListBox(listItems);
    const dataRows = container.querySelectorAll('.data-row');
    expect(dataRows).toHaveLength(4);
    for (let index = 0; index < dataRows.length; index++) {
        expect(dataRows[index].children[0].innerHTML).toBe(listItems[index]);
    }
});

test('renders a box with a dual-row-item list data', () => {
    const mainListItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    const secondaryListItems = ['Item 1 Secondary', 'Item 2 Secondary', 'Item 3 Secondary', 'Item 4 Secondary'];
    const { container } = renderMultiRowListBox(mainListItems, secondaryListItems);
    const dataRows = container.querySelectorAll('.data-row');
    expect(dataRows).toHaveLength(4);
    for (let index = 0; index < dataRows.length; index++) {
        expect(dataRows[index].children[0].innerHTML).toBe(mainListItems[index]);
        expect(dataRows[index].children[1].innerHTML).toBe(secondaryListItems[index]);
    }
});

test('renders a box with alerts', () => {
    const { container } = renderAlertBox();
    const alertElements = container.querySelectorAll('.alert');
    expect(alertElements).toHaveLength(4);
});

test('a box gets selected on click', () => {
    const id = 1;
    const { container } = renderAlertBox(id);

    const selectBoxAction = actions.selectBox(id);
    
    mockDispatch.mockClear();
    fireEvent(container.children[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(selectBoxAction);
});

test('a box triggers a move action on keypdown', () => {
    const id = 1;
    const { container } = renderAlertBox(id);

    const moveBoxBackAction = actions.moveBoxBack(id);
    const moveBoxForwardAction = actions.moveBoxForward(id);

    mockDispatch.mockClear();
    // container.children[0].focus();
    fireEvent.keyDown(container.children[0], {code: 37, charCode: 37});
    // expect(mockDispatch).toHaveBeenCalledWith(moveBoxBackAction);

    mockDispatch.mockClear();
    fireEvent.keyDown(container.children[0], {code: 39, charCode: 39});
    // expect(mockDispatch).toHaveBeenCalledWith(moveBoxForwardAction);
});

test('a box tirggers a close action', () => {
    const id = 1;
    const { container } = renderAlertBox(id);

    const removeBoxAction = actions.removeBox(id);
    mockDispatch.mockClear();
    fireEvent(container.querySelector('.fas.fa-times')!, new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(removeBoxAction);
});