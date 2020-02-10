import React from 'react';
import { render } from '@testing-library/react';
import IndicesList from './IndicesList';
import IndexData from '../IndexData';

const mockHandleClick = jest.fn((altKey: boolean, data: IndexData) => {});
const title = 'Indices';
const data_ = [new IndexData(0, 'ABC', 1, 1.1, 1.2, 0.5, 0.8, -0.10), 
                  new IndexData(1, 'DEF', 2, 1.2, 1.1, 0.1, 0.1, -0.12)];

const renderIndicesList = (data: IndexData[] = data_) => {
    return render(<IndicesList title={title} 
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