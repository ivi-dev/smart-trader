import React from 'react';
import { render } from '@testing-library/react';
import Text from '../Text';

test('render an elemeny with a text content', () => {
    const content = 'Text';
    const classes = 'cls';
    const style = {fontSize: '100%'};
    const { container } = render(<Text content={content} 
        classes={classes}
        style={style} />);
    expect(container.children[0].innerHTML).toBe(content);
    expect(container.children[0].classList.contains(classes)).toBe(true);
    expect(container.children[0].getAttribute('style')).toBe('font-size: 100%;');
});