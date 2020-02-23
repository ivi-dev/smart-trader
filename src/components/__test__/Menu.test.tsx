import React from 'react';
import { render } from '@testing-library/react';
import Menu from '../Menu';
import { Action } from '../../redux/actions';

const mockDispatch = jest.fn((action: Action) => {});

const items = [{name: 'Item 1'}, {name: 'Item 2'}];
const renderMenu = (visible?: boolean) => {
    return render(<Menu items={items} 
                        visible={visible}
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