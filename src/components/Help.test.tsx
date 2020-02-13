import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Help from './Help';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

const mockDispatch = jest.fn((action: Action) => {});
const sections = [{name: 'Section 1'}, {name: 'Section 2'}];
const active = 'Section 1';
const content = 'Content';

const renderHelp = (visible?: boolean) => {
    return render(<Help sections={sections} 
                        active={active}
                        content={content}
                        visible={visible}
                        dispatch={mockDispatch} />);
}

test('render an invisible container with nav links a text content', () => {
    const { container, getByText } = renderHelp();
    expect(container.children[0].classList.contains('slid-up')).toBe(true);
    const closeButton = container.children[0].querySelector('.fas.fa-times');
    expect(closeButton).toBeTruthy();
    const sections_ = container.querySelectorAll('.section');
    for (let index = 0; index < sections_.length; index++) {
        expect(sections_[index].innerHTML).toBe(sections[index].name);
    }
    expect(getByText(content)).toBeTruthy();
    fireEvent(closeButton!, new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.toggleHelp('close'));
    fireEvent(sections_[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.setActiveHelpSection(sections[0].name));
});

test('render a visible container with nav links a text content', () => {
    const { container } = renderHelp(true);
    expect(container.children[0].classList.contains('slid-down')).toBe(true);
});