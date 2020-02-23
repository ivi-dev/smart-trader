import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Search from '../Search';

const mockOnKeyUp = jest.fn((value: string) => {});
const value = 'Value';
const placeholder='Search';

const renderInput = () => {
    return render(<Search placeholder={placeholder} onKeyUp={mockOnKeyUp} />);
}

test('render an element with a search input', () => {
    const { container } = renderInput();
    const searchInput = container.querySelector("input[type='search']");
    expect(searchInput?.getAttribute('placeholder')).toBe(placeholder);
    (searchInput as HTMLInputElement).value = value;
    fireEvent.keyUp(searchInput!, {code: 65, charCode: 65});
    expect(mockOnKeyUp).toHaveBeenCalledWith(value);
});

test('an input element gets focs when an icon is clicked', () => {
    const { container } = renderInput();
    const magnifyingGlass = container.querySelector('.fas.fa-search');
    fireEvent(magnifyingGlass!, new MouseEvent('click', {cancelable: true, bubbles: true}));
    expect(container.querySelector('input:focus')).toBeTruthy();
});