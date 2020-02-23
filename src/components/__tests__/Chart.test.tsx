import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Stock from '../../models/Stock';
import { Action } from '../../redux/actions';
import * as actions from '../../redux/actions';
import Chart from '../Chart';
import { capitalize } from '../../utility';

window.matchMedia = window.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    };
};

const status = 'No Data Yet.';
const data = {
    stock: new Stock(0, 'ABC', 1, 0.5, 1.2, 0.2, 1.1, 2),
    options: {
        chart: {},
        grid: {},
        xaxis: {},
        stroke: {},
        noData: {},
        series: [{name: '', 
                  data: [{x: '', y: 0}]}]
    },
    status: status,
    company: {
        profile: {},
        ceo: {},
        executives: [],
        price: {},
        valuarion: {},
        growth: {},
        margin: {},
        management: {},
        financialStrength: {},
        perShare: {},
        investors: [{}],
        funds: [],
        sections: [{name: 'profile', 
                    data: 'profile', 
                    selected: true},
                   {name: 'investors', 
                   data: 'investors'}]
    }
}
const mockDispatch = jest.fn((action: Action) => {});

const renderChart = () => {
    return render(<Chart testMode={true}
                         data={data}
                         tracker={null}
                         trackerMode='simulated'
                         dispatch={mockDispatch} />);
}

test('render a graph and a company info with a non-array section selected', () => {
    data.company.profile = {name: ''};
    const { container } = renderChart();
    expect(container.children[0].querySelector('.content .text-muted')?.innerHTML)
    .toBe(`${capitalize(Object.entries(data.company.profile)[0][0])}:`);
});

test('render a graph and a company info with a non-array empty section selected', () => {
    data.company.profile = {};
    const { container } = renderChart();
    expect(container.children[0].querySelector('.content .text-muted')?.innerHTML)
    .toBe(status);
});

test('render a graph and a company info with an empty array section selected', () => {
    delete data.company.sections[0].selected;
    data.company.investors = [];
    data.company.sections[1].selected = true;
    const { container } = renderChart();
    expect(container.children[0].querySelector('.content .text-muted')?.innerHTML)
    .toBe(status);
});

test('render a graph and a company info with an array section selected', () => {
    data.company.investors = [{name: 'name'}];
    const { container } = renderChart();
    expect(container.children[0].querySelectorAll('.content .text-muted')[0]?.innerHTML)
    .toBe('#1');
    expect(container.children[0].querySelectorAll('.content .text-muted')[1]?.innerHTML)
    .toBe(`${capitalize(Object.entries(data.company.investors[0])[0][0])}:`);
});

test('render a graph and a company info with an array section selected, and an element of a section is null', () => {
    data.company.investors = [{name: null}];
    const { container } = renderChart();
    expect(container.children[0].querySelectorAll('.content .text-muted')[0]?.innerHTML)
    .toBe('#1');
    expect(container.children[0].querySelectorAll('.content .text-muted')[1]?.innerHTML)
    .toBe(`${capitalize(Object.entries(data.company.investors[0])[0][0])}:`);
});

test('a chart container reacts on company section selection', () => {
    const { container } = renderChart();
    const selector = container.querySelector('select');
    mockDispatch.mockReset();
    fireEvent.change(selector!, {bubbles: true, cancelable: false});
    expect(mockDispatch).toHaveBeenCalledWith(actions.setActiveCompanySection('investors'));
});