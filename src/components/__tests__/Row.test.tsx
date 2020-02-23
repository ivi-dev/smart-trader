import React from 'react';
import { render } from '@testing-library/react';
import Row from '../Row';

test('render an element with a child, with add-on classes and a style', () => {
    const { container } = render(
        <Row classes={'row'} style={{'fontSize': '100%'}}>
            <div className="child"></div>
        </Row>);
        expect(container.children[0].querySelector('.child')).toBeTruthy();
        expect(container.children[0].classList.contains('row')).toBe(true);
        expect(container.children[0].getAttribute('style')).toBe('font-size: 100%;');
});