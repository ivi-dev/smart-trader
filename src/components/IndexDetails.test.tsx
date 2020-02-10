import React from 'react';
import { render } from '@testing-library/react';
import IndexData from '../IndexData';
import IndexDetails from './IndexDetails';

test('render an element with an index\'s name, open and close values', () => {
    const data = new IndexData(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10);
    const { container } = render(<IndexDetails data={data} />);
    expect(container.children[0].querySelector('.name')?.innerHTML).toBe(data.name);
    expect(container.children[0].querySelector('.open .value')?.innerHTML).toBe(data.open.toString());
    expect(container.children[0].querySelector('.current .value')?.innerHTML).toBe(data.current.toString());
});

test('render an element with a \'null\' index', () => {
    const data = null;
    const { container } = render(<IndexDetails data={data} />);
    expect(container.children[0].querySelector('.name')?.innerHTML).toBe('---');
    expect(container.children[0].querySelector('.open .value')?.innerHTML).toBe('xxx');
    expect(container.children[0].querySelector('.current .value')?.innerHTML).toBe('xxx');
});