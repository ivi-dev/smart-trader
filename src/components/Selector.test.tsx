import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Selector from './Selector';

const mockHandleSelect = jest.fn((value: string, ...other: any[]) => {});
const title = 'Selector';
const options = [{name: 'Option 1'}, {name: 'Option 2'}];
const selected = options[0].name;
const classes = 'cls';
const renderSelector = (sortOrder?: 'asc' | 'desc') => {
    
    return render(<Selector title={title}
                            options={options} 
                            selected={options[0].name} 
                            classes={classes}
                            sortOrder={sortOrder}
                            handleSelect={mockHandleSelect} />);
}

test('render a select element with options sorted in an ascending order', () => {
    const { container } = renderSelector();
    expect(container.querySelector('.title')?.innerHTML).toBe(title);
    expect(container.children[0].classList.contains(classes)).toBe(true);
    expect(container.querySelector('select')!.value).toBe(selected);
    const options_ = container.querySelectorAll('select option');
    for (let index = 0; index < options_.length; index++) {
        expect(options_[index].innerHTML).toBe(options[index].name);
    }
});

test('render a select element with options sorted in an descending order', () => {
    const { container } = renderSelector('desc');
    const options_ = container.querySelectorAll('select option');
    for (let index = 0; index < options_.length; index++) {
        expect(options_[index].innerHTML).toBe(options[options.length - 1 - index].name);
    }
});

test('a select element reacts on a selecton event', () => {
    const { container } = renderSelector();
    const select = container.querySelector('select');
    fireEvent.change(select!, {bubbles: true, cancelable: false});
    expect(mockHandleSelect).toHaveBeenCalledWith((select as HTMLSelectElement).value);
});