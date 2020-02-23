import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from '../Input';

let value: string | number = 0, newValue = 2;
const mockHandleChange = jest.fn((value_: string | number) => {value = value_});
const mockHanldeReturnKeyPress = jest.fn(() => {});

test('render an input element with a placeholder and a value, that reacts to changes', () => {
    const classes = 'cls';
    const style = {fontSize: '100%'};
    const { container } = render(<Input type={'number'} 
                                        value={value} 
                                        classes={classes}
                                        style={style}
                                        handleChange={mockHandleChange}
                                        handleReturnKeyPress={mockHanldeReturnKeyPress} />);
    const input = container.querySelector("input[type='number']");
    expect(input).toBeTruthy();
    expect((input as HTMLInputElement).value).toBe(value.toString());
    expect(input?.classList.contains(classes)).toBe(true);
    expect(input?.getAttribute('style')).toBe('font-size: 100%;');
    fireEvent.change(input!, { target: { value: newValue } });
    expect(mockHandleChange).toHaveBeenCalledWith('2');
});