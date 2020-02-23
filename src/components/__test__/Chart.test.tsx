import React from 'react';
import { render } from '@testing-library/react';
import Stock from '../../models/Stock';
import { Action } from '../../redux/actions';
import Chart from '../Chart';

window.matchMedia = window.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    };
};

const id = 0;
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
    status: '',
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
        investors: [],
        funds: [],
        sections: [{name: 'profile', 
                    data: 'profile', 
                    selected: true}]
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

test('render a graph', () => {
    const { container } = renderChart();
    const graph = container.children[0];
    expect(graph.querySelector('.stock-details')).toBeTruthy();
    expect(graph.querySelector('.graph')).toBeTruthy();
    expect(graph.querySelector('.company-info')).toBeTruthy();
    expect(graph.querySelector('.company-info')?.querySelector('select')).toBeTruthy();
    expect(graph.querySelector('.company-info')?.querySelector('.content')).toBeTruthy();
});