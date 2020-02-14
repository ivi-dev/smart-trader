import React from 'react';
import { render } from '@testing-library/react';
import StocksList from './StocksList';
import StockData from '../StockData';

const mockHandleClick = jest.fn((altKey: boolean, data: StockData) => {});
const title = 'Indices';
const data_ = [new StockData(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10), 
                  new StockData(1, 'DEF', 2, 1.2, 1.1, 0.1, 0.1, -0.12)];

const renderIndicesList = (data: StockData[] = data_) => {
    return render(<StocksList title={title} 
                               data={data}
                               handleClick={mockHandleClick} />);
}

test('render a list of indices with a title', () => {
    
    const { container } = renderIndicesList();
    expect(container.children[0].innerHTML).toBe(title);
    expect(container.children[1].children).toHaveLength(data_.length);
});

test('render a label saying that the list is empty', () => {
    const { container } = renderIndicesList([]);
    expect(container.children[0].innerHTML).toBe(title);
    expect(container.children[1].children[0].innerHTML).toBe('Empty');
});