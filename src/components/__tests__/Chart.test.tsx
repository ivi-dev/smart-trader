import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Stock from '../../models/Stock';
import { Action } from '../../redux/actions';
import * as actions from '../../redux/actions';
import Chart from '../Chart';
import { capitalize } from '../../utility';
import { Tracker } from '../../redux/store/types';

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
const tracker: Tracker = {
    object: 1,
    mode: 'simulated'
}
const mockDispatch = jest.fn((action: Action) => {});

const renderChart = () => {
    return render(<Chart testMode={true}
                         data={data}
                         tracker={tracker}
                         dispatch={mockDispatch} />);
}

test('render a graph', () => {
    const { container } = renderChart();
    expect(container.children[0].querySelector('.graph')).toBeTruthy();
});