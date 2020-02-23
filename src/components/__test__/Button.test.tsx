import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../Button';

const mockOnClick = jest.fn(() => {});

test('renders a button with a title', () => {
    const title = 'Button with a title';
    const { container } = render(<Button title={title} onClick={mockOnClick} />);
    expect(container.querySelector('.btn')).toBeTruthy();
    expect(container.querySelector('.btn')?.innerHTML).toBe(title);
});

test('renders a button with a graphic', () => {
    const graphic1 = 'fas';
    const graphic2 = 'fa-chart';
    const { container } = render(<Button graphic={`${graphic1} ${graphic2}`} 
                                         onClick={mockOnClick} />);
    expect(container.querySelector('.btn')?.children[0].classList.contains(graphic1)).toBe(true);
    expect(container.querySelector('.btn')?.children[0].classList.contains(graphic2)).toBe(true);
});

test('renders a button with extra classes', () => {
    const title = 'Button with extra classes';
    const extraClass = 'class1';
    const { container } = render(<Button title={title} 
                                         onClick={mockOnClick} 
                                         classes={extraClass} />);
    expect(container.querySelector('.btn')?.classList.contains(extraClass)).toBe(true);
});

test('button reacts to a click', () => {
    const title = 'Button with extra classes';
    const { container } = render(<Button title={title} 
                                         onClick={mockOnClick} />);
    fireEvent(container.querySelector('.btn')!, new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockOnClick).toHaveBeenCalled();
});