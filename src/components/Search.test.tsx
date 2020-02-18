import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Search from './Search';

const mockOnKeyUp = jest.fn((value: string) => {});

test('render an element with a search input', () => {
    const value = 'Value';
    const placeholder='Search';
    const { container } = render(<Search placeholder={placeholder} onKeyUp={mockOnKeyUp} />);
    expect(container.querySelector("input[type='search']")?.getAttribute('placeholder')).toBe(placeholder);
    const searchInput = container.querySelector("input[type='search']");
    (searchInput as HTMLInputElement).value = value;
    fireEvent.keyUp(searchInput!, {code: 65, charCode: 65});
    expect(mockOnKeyUp).toHaveBeenCalledWith(value);
});