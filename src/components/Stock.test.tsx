import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Stock from './Stock';
import StockModel from '../models/Stock';

const mockHandleClick = jest.fn((altKey: boolean, data: StockModel) => {});
const data_ = new StockModel(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, 0.10, 'Company Name');
const renderStock = (data: StockModel = data_) => {
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