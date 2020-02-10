import React from 'react';
import { render } from '@testing-library/react';
import Column from './Column';

test('render a container with children and add-on classes', () => {
    const classes = 'cls1';
    const { container } = render(
    <Column classes={classes}>
        <div className="cls"></div>
    </Column>);
    expect(container.children[0].children).toHaveLength(1);
    expect(container.children[0].classList.contains(classes)).toBe(true);
});