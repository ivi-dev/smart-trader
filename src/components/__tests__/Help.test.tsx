import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Help from '../Help';
import { Action } from '../../redux/actions';
import * as actions from '../../redux/actions';
import { Option } from '../../redux/store/types';

const mockDispatch = jest.fn((action: Action) => {});
const sections: Option[] = [{name: 'Section 1'}, {name: 'Section 2'}, {name: 'Section 3'}];
let active = 'Section 1';
const content = 'Content';

const renderHelp = (visible?: boolean, dispatch: boolean = true) => {
    return dispatch ? render(<Help sections={sections} 
                                   active={active}
                                   content={content}
                                   visible={visible}
                                   dispatch={mockDispatch} />) : 
                      render(<Help sections={sections} 
                                   active={active}
                                   content={content}
                                   visible={visible} />);
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
});

test('render a visible container', () => {
    const { container } = renderHelp(true);
    expect(container.children[0].classList.contains('slid-down')).toBe(true);
});

test('a help window reacts to a click on its close button', () => {
    const { container } = renderHelp();
    const closeButton = container.children[0].querySelector('.fas.fa-times');
    mockDispatch.mockReset();
    fireEvent(closeButton!, new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.toggleHelp('close'));
});

test('a help window reacts to a click on its close button, with no dispatch property', () => {
    const { container } = renderHelp(true, false);
    const closeButton = container.children[0].querySelector('.fas.fa-times');
    mockDispatch.mockReset();
    fireEvent(closeButton!, new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).not.toHaveBeenCalled();
});

test('a help window reacts to a selection of a section', () => {
    const { container } = renderHelp();
    const sections_ = container.querySelectorAll('.section');
    mockDispatch.mockReset();
    fireEvent(sections_[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.setActiveHelpSection(sections[0].name.toString()));
});

test('a help window reacts to a selection of a section, with no dispatch property', () => {
    const { container } = renderHelp(true, false);
    const sections_ = container.querySelectorAll('.section');
    mockDispatch.mockReset();
    fireEvent(sections_[0], new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).not.toHaveBeenCalled();
});

test('help window reacts to a click on the \'Previous\' button', () => {
    active = sections[1].name.toString();
    sections[1].selected = true;
    const { getByText } = renderHelp(true);
    mockDispatch.mockReset();
    fireEvent(getByText('Previous'), new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.setActiveHelpSection(sections[0].name.toString()));
});

test('help window reacts to a click on the \'Next\' button', () => {
    const { getByText } = renderHelp(true);
    mockDispatch.mockReset();
    fireEvent(getByText('Next'), new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(actions.setActiveHelpSection(sections[2].name.toString()));
});

test('help window reacts to a click on the \'Previous\' button, with no dispatch property', () => {
    const { getByText } = renderHelp(true, false);
    mockDispatch.mockReset();
    fireEvent(getByText('Previous'), new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).not.toHaveBeenCalled();
});

test('help window reacts to a click on the \'Next\' button, with no dispatch property', () => {
    const { getByText } = renderHelp(true, false);
    mockDispatch.mockReset();
    fireEvent(getByText('Next'), new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).not.toHaveBeenCalled();
});