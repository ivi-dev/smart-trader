import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Selector from '../Selector';

const mockHandleSelect = jest.fn((value: string, ...other: any[]) => {});
const title = 'Selector';
let options = [{name: 'Option 1'}, {name: 'Option 2'}, {name: 'Option 4'}, {name: 'Option 3'}];
const selected = options[0].name;
const classes = 'cls';
const sortedOptions = () => {
    return options.sort((option1, option2) => {
        if (option1.name < option2.name) {return -1}
        else if (option1.name > option2.name) {return 1}
        else {return 0}
    });
}
const restoreOptions = () => {
    options = [{name: 'Option 1'}, {name: 'Option 2'}, {name: 'Option 4'}, {name: 'Option 3'}];
}
const renderSelector = (sortOrder?: 'asc' | 'desc', flush?: boolean) => {
    return render(<Selector title={title}
                            flush={flush}
                            options={options} 
                            selected={options[0].name} 
                            classes={classes}
                            sortOrder={sortOrder}
                            handleSelect={mockHandleSelect} />);
}

test('render a select element with a title, selecetd value and extra classes', () => {
    const { container } = renderSelector();
    expect(container.querySelector('.title')?.innerHTML).toBe(title);
    expect(container.children[0].classList.contains(classes)).toBe(true);
    expect(container.querySelector('select')!.value).toBe(selected);
});

test('render a \'flush\' select element', () => {
    const { container } = renderSelector('asc', true);
    expect(container.querySelector('select')!.classList.contains('ml-2')).toBe(false);
});

test('render a select element with options sorted in an ascending order', () => {
    const { container } = renderSelector();
    const options_ = container.querySelectorAll('select option');
    const sorted = sortedOptions();
    for (let index = 0; index < options_.length; index++) {
        expect(options_[index].innerHTML).toBe(sorted[index].name);
    }
    restoreOptions();
});

test('render a select element with options sorted in an descending order', () => {
    const { container } = renderSelector('desc');
    const options_ = container.querySelectorAll('select option');
    const sorted = sortedOptions();
    for (let index = 0; index < options_.length; index++) {
        expect(options_[index].innerHTML).toBe(sorted[sorted.length - 1 - index].name);
    }
    restoreOptions();
});

test('render a select element with options sorted in an ascending order, with two options that are the same', () => {
    options.push({name: 'Option 2'});
    const { container } = renderSelector();
    const options_ = container.querySelectorAll('select option');
    const sorted = sortedOptions();
    for (let index = 0; index < options_.length; index++) {
        expect(options_[index].innerHTML).toBe(sorted[index].name);
    }
    restoreOptions();
});

test('a select element reacts on a selecton event', () => {
    const { container } = renderSelector();
    const select = container.querySelector('select');
    fireEvent.change(select!, {bubbles: true, cancelable: false});
    expect(mockHandleSelect).toHaveBeenCalledWith((select as HTMLSelectElement).value);
});