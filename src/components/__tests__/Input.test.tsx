import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from '../Input';

let value: string | number = 0, newValue = 2;
const mockHandleChange = jest.fn((value_: string | number) => {value = value_});
const mockHanldeReturnKeyPress = jest.fn(() => {});

const renderInput = (classes?: string, style?: {}) => {
    return render(<Input type='number'
                         value={value} 
                         classes={classes}
                         style={style}
                         handleChange={mockHandleChange}
                         handleReturnKeyPress={mockHanldeReturnKeyPress} />);
}

test('render an input element with a placeholder and a value, that reacts to value changes', () => {
    const classes = 'cls';
    const style = {fontSize: '100%'};
    const { container } = renderInput(classes, style);
    const input = container.querySelector("input[type='number']");
    expect(input).toBeTruthy();
    expect((input as HTMLInputElement).value).toBe(value.toString());
    expect(input?.classList.contains(classes)).toBe(true);
    expect(input?.getAttribute('style')).toBe('font-size: 100%;');
    fireEvent.change(input!, { target: { value: newValue } });
    expect(mockHandleChange).toHaveBeenCalledWith('2');
});

test('an input element reacts as on a Return keypress', () => {
    const { container } = renderInput();
    const input = container.querySelector("input[type='number']");
    mockHanldeReturnKeyPress.mockReset();
    fireEvent.keyDown(input!, {keyCode: 13, charCode: 13});
    expect(mockHanldeReturnKeyPress).toHaveBeenCalled();
});

test('an input element reacts on a non-Return keypress', () => {
    const { container } = renderInput();
    const input = container.querySelector("input[type='number']");
    mockHanldeReturnKeyPress.mockReset();
    fireEvent.keyDown(input!, {keyCode: 14, charCode: 14});
    expect(mockHanldeReturnKeyPress).not.toHaveBeenCalled();
});