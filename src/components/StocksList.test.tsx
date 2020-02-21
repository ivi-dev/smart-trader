import React from 'react';
import { render } from '@testing-library/react';
import StocksList from './StocksList';
import Stock from '../models/Stock';

const title = 'Symbols';
const data_ = [new Stock(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10), 
               new Stock(1, 'DEF', 2, 1.2, 1.1, 0.1, 0.1, -0.12)];

const renderStocksList = (data: Stock[] = data_) => {
    return render(<StocksList title={title} 
                              data={data}
                              listType='symbolsList'
                              dispatch={action => {}}
                              onSearch={value => {}} />);
}

test('render a list of stocks with a title', () => {
    const { container, getByText } = renderStocksList();
    expect(getByText(title)).toBeTruthy();
    expect(container.children[1].children).toHaveLength(data_.length);
});