import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Menu from '../Menu';
import { Action } from '../../redux/actions';
import * as actions from '../../redux/actions';

const mockDispatch = jest.fn((action: Action) => {});
const mockOnClick = jest.fn((value: string | number) => {});
const items = [{name: 'Item 1', onClick: (value: string | number) => mockOnClick(value)}, 
               {name: 'Item 2', onClick: (value: string | number) => mockOnClick(value)}];
let boxId: number | undefined = 1;
const renderMenu = (visible?: boolean) => {
    return render(<Menu items={items} 
                        visible={visible}
                        boxId={boxId}
                        dispatch={mockDispatch} />);
}

test('render a non-visible menu with options', () => {
    const { container } = renderMenu();
    expect(container.children[0].classList.contains('d-none')).toBe(true);
    expect(container.children[0].children).toHaveLength(items.length);
});

test('render a visible menu', () => {
    const { container } = renderMenu(true);
    expect(container.children[0].classList.contains('d-none')).toBe(false);
});

test('menu reacts on item click', () => {
    const { container } = renderMenu(true);
    fireEvent(container.children[0].querySelectorAll('a')[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.setMenuVisible(false, boxId as number));
    expect(mockOnClick).toHaveBeenCalledWith(items[0].name);
});

test('menu reacts on item click, with no boxId property', () => {
    boxId = undefined;
    const { container } = renderMenu(true);
    mockDispatch.mockReset();
    fireEvent(container.children[0].querySelectorAll('a')[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).not.toHaveBeenCalled();
    boxId = 1;
});

test('menu does not react on item click if no handler is defined on the item', () => {
    items.forEach(item => delete item.onClick);
    const { container } = renderMenu(true);
    mockDispatch.mockReset();
    mockOnClick.mockReset();
    fireEvent(container.children[0].querySelectorAll('a')[0], 
        new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnClick).not.toHaveBeenCalled();
    items.forEach(item => item.onClick = (value: string | number) => mockOnClick(value));
});

test('menu reacts on Escape key press', () => {
    const { container } = renderMenu(true);
    mockDispatch.mockReset();
    fireEvent.keyDown(container.children[0], {key: "Escape", code: "Escape", 
        keyCode: 27, charCode: 27});
    expect(mockDispatch).toHaveBeenCalledWith(actions.setMenuVisible(false, boxId as number));
});

test('menu reacts on Escape key press, with no boxId property', () => {
    boxId = undefined;
    const { container } = renderMenu(true);
    mockDispatch.mockReset();
    fireEvent.keyDown(container.children[0], {key: "Escape", code: "Escape", 
        keyCode: 27, charCode: 27});
    expect(mockDispatch).not.toHaveBeenCalled();
});

test('menu does not react on non-Escape key press', () => {
    const { container } = renderMenu(true);
    mockDispatch.mockReset();
    fireEvent.keyDown(container.children[0], {keyCode: 28, charCode: 28});
    expect(mockDispatch).not.toHaveBeenCalled();
});