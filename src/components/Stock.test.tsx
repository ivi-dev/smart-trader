import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Stock from './Stock';
import StockData from '../StockData';

const mockHandleClick = jest.fn((altKey: boolean, data: StockData) => {});
const data_ = new StockData(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, 0.10, 'Company Name');
const renderStock = (data: StockData = data_) => {
    return render(<Stock data={data} 
                         handleClick={mockHandleClick} />);
}

test('render an element representing a stock', () => {
    const { container } = renderStock();
    expect(container.children[0].querySelector('.name')?.innerHTML).toBe(data_.name);
    expect(container.children[0].querySelector('.company-name')?.innerHTML).toBe(data_.companyName);
});

test('a stock responds to a click', () => {
    const { container } = renderStock();
    fireEvent(container.children[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockHandleClick).toHaveBeenCalledWith(false, data_);
});