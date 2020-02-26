import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { CompanyInfo } from '../CompanyInfo';
import { store } from '../../redux/store/store';
import * as actions from '../../redux/actions';

const mockDispatch = jest.fn(() => {});

const renderCompanyInfo = (section = 'profile') => {
    const sections = store.getState().stocks.company.sections;
    sections.forEach(section_ => {
        if (section_.name.toString().toLowerCase() === section.toLowerCase()) {
            section_.selected = true;
        } else {
            delete section_.selected;
        }});
    return render(<CompanyInfo company={store.getState().stocks.company} 
                               status='Fecthig Data...' 
                               dispatch={mockDispatch} />);
}

test('render a company info panel with a non-list section', () => {
    store.getState().stocks.company.profile = {name: ''};
    const { container } = renderCompanyInfo();
    expect(container.querySelector('.company-info .content')).toBeTruthy();
});

test('render a company info panel with a non-list empty section', () => {
    store.getState().stocks.company.profile = {};
    const { container } = renderCompanyInfo();
    expect(container.querySelector('.company-info .content')).toBeTruthy();
});

test('render a company info panel with a list section', () => {
    store.getState().stocks.company.investors = [{name: ''}];
    const { container } = renderCompanyInfo('investors ownership');
    expect(container.querySelector('.company-info .content')).toBeTruthy();
});

test('render a company info panel with an empty list section', () => {
    store.getState().stocks.company.investors = [];
    const { container } = renderCompanyInfo('investors ownership');
    expect(container.querySelector('.company-info .content')).toBeTruthy();
});

test('the company info panel triggers a section select action', () => {
    const { container } = renderCompanyInfo();
    const select = container.querySelector('select');
    fireEvent.change(select!, {bubbles: true, cancelable: false});
    expect(mockDispatch).toHaveBeenCalledWith(actions
        .setActiveCompanySection((select as HTMLSelectElement).value));
});