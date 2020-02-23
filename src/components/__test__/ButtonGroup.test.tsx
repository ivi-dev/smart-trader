import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ButtonGroup from '../ButtonGroup';
import { Option } from '../../redux/store';

const mockHandleSelect = jest.fn((data: string | number) => {});
const nameOptions = [{name: 'Option 1'}, 
                     {name: 'Option 2'}, 
                     {name: 'Option 3'}];
const graphicOptions = [{name: '', graphic: 'Graphic-1'}, 
                        {name: '', graphic: 'Graphic-2'}, 
                        {name: '', graphic: 'Graphic-3'}];
const dataOptions = [{name: '', data: 'Data-1'}, 
                     {name: '', data: 'Data-2'}, 
                     {name: '', data: 'Data-3'}];

const renderButtonGroup = (optionType: 'name' | 'graphic' | 'data' = 'name') => {
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
    return render(<ButtonGroup options={options}
                               active={selected}
                               handleSelect={mockHandleSelect} />);
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

test('the button group reacts on click, sending the option\'s value to the handler', () => {
    const { container } = renderButtonGroup();
    fireEvent(container.children[0].children[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockHandleSelect).toHaveBeenCalledWith(nameOptions[0].name);
});

test('the button group reacts on click, sending the option\'s \'data\' value to the handler', () => {
    const { container } = renderButtonGroup('data');
    fireEvent(container.children[0].children[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockHandleSelect).toHaveBeenCalledWith(dataOptions[0].data);
});