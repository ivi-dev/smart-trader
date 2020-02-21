import React from 'react';
import { render } from '@testing-library/react';
import Stock from '../models/Stock';
import StockDetails from './StockDetails';

const data = new Stock(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10, 'Company Name');
const trendValue = Number(Math.abs(data.trend).toFixed(2));
const trendPercentage = Number(Math.abs(trendValue / data.current * 100).toFixed(2));

const renderStockDetails = (mode: 'simulated' | 'live' = 'simulated') => {
    return render(<StockDetails data={data} 
                                tracker={1} 
                                trackerMode={mode} />);
}

test('render an element in simulation mode', () => {
    const { container } = renderStockDetails();
    expect(container.children[0].querySelector('.name')?.innerHTML).toBe(data.name);
    expect(container.children[0].querySelector('.company-name')?.innerHTML).toBe(data.companyName);
    expect(container.children[0].querySelectorAll('.stat')[0]?.querySelector('.value')?.innerHTML).toBe(data.open.toFixed(3));
    expect(container.children[0].querySelectorAll('.stat')[1]?.querySelector('.value')?.innerHTML).toBe(data.high.toFixed(3));
    expect(container.children[0].querySelectorAll('.stat')[2]?.querySelector('.value')?.innerHTML).toBe(data.low.toFixed(3));
    expect(container.children[0].querySelectorAll('.stat')[3]?.querySelector('.value')?.innerHTML).toBe(`${trendValue > 0 ? '-' : ''}${trendValue.toFixed(3)} (${trendPercentage.toFixed(3)}%)`);
    expect(container.children[0].querySelector('button')?.innerHTML).toBe('Simulation');
});

test('render an element in live mode', () => {
    const { container } = renderStockDetails('live');
    expect(container.children[0].querySelector('button')?.innerHTML).toBe('Live');
});