import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Index from './Index';
import IndexData from '../IndexData';

const mockHandleClick = jest.fn((altKey: boolean, data: IndexData) => {});
const negativeData = new IndexData(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, 0.10);
const positiveData = new IndexData(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10);
const renderIndex = (data: IndexData) => {
    return render(<Index data={data} 
                         handleClick={mockHandleClick} />);
}

test('render an element representing a stock with a negative trend', () => {
    const { container } = renderIndex(negativeData);
    expect(container.children[0].querySelector('.name')?.innerHTML).toBe(negativeData.name);
    expect(container.children[0].querySelector('.current')?.innerHTML).toBe(negativeData.current.toString());
    expect(container.children[0].querySelector('.trend')?.innerHTML).toBe(`-${Math.abs(negativeData.trend)}&nbsp;(${Math.abs(Number((negativeData.trend / negativeData.open * 100).toFixed(2)))}%)`);
});

test('render an element representing a stock with a positive trend', () => {
    const { container } = renderIndex(positiveData);
    expect(container.children[0].querySelector('.name')?.innerHTML).toBe(positiveData.name);
    expect(container.children[0].querySelector('.current')?.innerHTML).toBe(positiveData.current.toString());
    expect(container.children[0].querySelector('.trend')?.innerHTML).toBe(`${Math.abs(positiveData.trend)}&nbsp;(${Math.abs(Number((positiveData.trend / positiveData.open * 100).toFixed(2)))}%)`);
});

test('an index responds to a click', () => {
    const { container } = renderIndex(positiveData);
    fireEvent(container.children[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockHandleClick).toHaveBeenCalledWith(false, positiveData);
});