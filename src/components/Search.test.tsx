import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Search from './Search';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

const mockDispatch = jest.fn((action: Action) => {});

test('render an element with a search input', () => {
    const placeholder='Search';
    const { container } = render(<Search placeholder={placeholder} dispatch={mockDispatch} />);
    expect(container.querySelector("input[type='search']")?.getAttribute('placeholder')).toBe(placeholder);
    const searchInput = container.querySelector("input[type='search']");
    fireEvent.keyUp(searchInput!, {code: 65, charCode: 65});
    expect(mockDispatch).toHaveBeenCalledWith(actions.searchForIndex((searchInput! as HTMLInputElement).value!));
});