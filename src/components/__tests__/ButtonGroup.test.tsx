import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ButtonGroup from '../ButtonGroup';
import { Option } from '../../redux/store/types';

const mockHandleSelect = jest.fn((data: string | number) => {});
const mockOnClick = jest.fn((value: string | number) => {});
const nameOptions = [{name: 'Option 1', onClick: (value: string | number) => mockOnClick(value)}, 
                     {name: 'Option 2', onClick: (value: string | number) => mockOnClick(value)}, 
                     {name: 'Option 3', onClick: (value: string | number) => mockOnClick(value)}];
const graphicOptions = [{name: '', graphic: 'Graphic-1'}, 
                        {name: '', graphic: 'Graphic-2'}, 
                        {name: '', graphic: 'Graphic-3'}];
const dataOptions = [{name: '', data: 'Data-1', onClick: (value: string | number) => mockOnClick(value)}, 
                     {name: '', data: 'Data-2', onClick: (value: string | number) => mockOnClick(value)}, 
                     {name: '', data: 'Data-3', onClick: (value: string | number) => mockOnClick(value)}];

const renderButtonGroup = (optionType: 'name' | 'graphic' | 'data' = 'name', 
    selectHandler = true) => {
    let options: Option[] = [],
    selected: string = '';
    switch (optionType) {
        case 'name':
            options = nameOptions, selected = nameOptions[0].name;
            break;
        case 'graphic':
            options = graphicOptions, selected = graphicOptions[0].graphic;
            break;
        default:
            options = dataOptions, selected = dataOptions[0].name;
    }
    return selectHandler ? render(<ButtonGroup options={options}
                                                active={selected}
                                                handleSelect={mockHandleSelect} />) :
                            render(<ButtonGroup options={options}
                                                active={selected} />);
}

test('render options group with text values and one being marked as active', () => {
    const { container } = renderButtonGroup();
    const btnGroup = container.children[0];
    expect(btnGroup).toBeTruthy();
    const options_ = container.querySelectorAll('button');
    expect(options_).toHaveLength(nameOptions.length);
    for (let index = 0; index < options_.length; index++) {
        expect(options_[index].innerHTML).toBe(nameOptions[index].name);
    }
    expect(options_[0].classList.contains('active')).toBe(true);
});

test('render options group with graphics and one being marked as active', () => {
    const { container } = renderButtonGroup('graphic');
    const btnGroup = container.children[0];
    expect(btnGroup).toBeTruthy();
    const options_ = container.querySelectorAll('button');
    expect(options_).toHaveLength(nameOptions.length);
    for (let index = 0; index < options_.length; index++) {
        expect(options_[index].children[0].classList.
            contains(graphicOptions[index].graphic)).toBe(true);
    }
    expect(options_[0].classList.contains('active')).toBe(true);
});

test('a button group reacts on click, sending the option\'s value to the handler', () => {
    const { container } = renderButtonGroup();
    fireEvent(container.children[0].children[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockHandleSelect).toHaveBeenCalledWith(nameOptions[0].name);
});

test('a button group reacts on click, sending the option\'s \'data\' value to the handler', () => {
    const { container } = renderButtonGroup('data');
    fireEvent(container.children[0].children[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockHandleSelect).toHaveBeenCalledWith(dataOptions[0].data);
});

test('a button group reacts on click, sending the option\'s value to the handler', () => {
    const { container } = renderButtonGroup('name', false);
    mockOnClick.mockReset();
    fireEvent(container.children[0].children[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockOnClick).toHaveBeenCalledWith(nameOptions[0].name);
});

test('a button group reacts on click, sending the option\'s \'data\' value to the handler', () => {
    const { container } = renderButtonGroup('data', false);
    mockOnClick.mockReset();
    fireEvent(container.children[0].children[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockOnClick).toHaveBeenCalledWith(dataOptions[0].data);
});

test('a button group reacts on click, but doesn\'t perform an action', () => {
    delete dataOptions[0].onClick;
    const { container } = renderButtonGroup('data', false);
    mockOnClick.mockReset();
    fireEvent(container.children[0].children[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockOnClick).not.toHaveBeenCalled();
    dataOptions[0].onClick = value => mockOnClick(value);
});