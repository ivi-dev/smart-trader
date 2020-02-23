import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StocksList from '../StocksList';
import Stock from '../../models/Stock';
import { Action } from '../../redux/actions';
import * as actions from '../../redux/actions';

const title = 'Symbols';
let data_: Stock[] = [new Stock(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10), 
               new Stock(1, 'DEF', 2, 1.2, 1.1, 0.1, 0.1, -0.12)];
const mockDispatch = jest.fn((action: Action) => {});
const mockOnSearch = jest.fn((value: string) => {});

const renderStocksList = (listType: 'symbolsList' | 'watchList', 
                          data: Stock[] = data_, title?: string) => {
    return render(<StocksList title={title} 
                              data={data}
                              listType={listType}
                              dispatch={mockDispatch}
                              onSearch={mockOnSearch} />);
}

test('render a list of stocks with a title', () => {
    const { container, getByText } = renderStocksList('symbolsList', data_, title);
    expect(getByText(title)).toBeTruthy();
    expect(container.children[1].children).toHaveLength(data_.length);
});

test('render an empty list', () => {
    data_ = [];
    const { container } = renderStocksList('symbolsList');
    expect(container.querySelector('.empty-label')).toBeTruthy();
    data_ = [new Stock(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10), 
               new Stock(1, 'DEF', 2, 1.2, 1.1, 0.1, 0.1, -0.12)];
});

test('render a list of stocks without a title', () => {
    const { getByText } = renderStocksList('symbolsList');
    expect(() => getByText(title)).toThrow();
});

test('react on search in an untitled list', () => {
    const value = 'a';
    const { container } = renderStocksList('symbolsList');
    const searchField = container.querySelector('input[type="search"]');
    (searchField! as HTMLInputElement).value = value;
    fireEvent.keyUp(container.querySelector('input[type="search"]')!, 
        {keyCode: 65, charCode: 65});
    expect(mockOnSearch).toHaveBeenCalledWith(value);
});

test('react on search in a titled list', () => {
    const value = 'a';
    const { container } = renderStocksList('symbolsList', data_, title);
    const searchField = container.querySelector('input[type="search"]');
    (searchField! as HTMLInputElement).value = value;
    fireEvent.keyUp(container.querySelector('input[type="search"]')!, 
        {keyCode: 65, charCode: 65});
    expect(mockOnSearch).toHaveBeenCalledWith(value);
});

test('react on stock click in a symbols list', () => {
    const { container } = renderStocksList('symbolsList');
    fireEvent(container.querySelectorAll('.stock')[0], 
        new MouseEvent('click', {cancelable: true, bubbles: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.selectStock(data_[0]));
});

test('react on stock click in a watchlist', () => {
    const { container } = renderStocksList('watchList');
    mockDispatch.mockReset();
    fireEvent(container.querySelectorAll('.stock')[0], 
        new MouseEvent('click', {cancelable: true, bubbles: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.selectStock(data_[0]));
});