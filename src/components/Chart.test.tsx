import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ChartData, { ChartDataEntry } from '../ChartData';
import StockData from '../StockData';
import { Action } from '../redux/actions';
import Chart from './Chart';
import * as actions from '../redux/actions';

window.matchMedia = window.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    };
};

const otions = {
    layout: {
    backgroundColor: 'transparent',
    textColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 14
  }
};
const id = 0;
const data = new ChartData([new ChartDataEntry('2019-01-01', 1, 0.5, 1.2, 0.2)]);
const activeIndex = new StockData(0, 'ABC', 1, 0.5, 1.2, 0.2, 1.1, 2);
const dataSources = [{name: 2019, selected: true}, {name: 2018}];
const resolutionOptions = [{name: '1d'}, {name: '1w'}];
const resolution = '1d';
const chartTypes = [{name: 'line'}, {name: 'bar'}];
const chartType = 'line';
const selectedChart = false;
const mockDispatch = jest.fn((action: Action) => {});

const renderChart = () => {
    return render(<Chart id={id} 
                         type={'line'} 
                         width={12} 
                         options={otions} 
                         data={data} 
                         activeIndex={activeIndex} 
                         dataSources={dataSources} 
                         year={dataSources[0].name} 
                         resolutionOptions={resolutionOptions} 
                         chartResolution={resolution} 
                         chartTypes={chartTypes} 
                         chartType={chartType} 
                         selected={selectedChart}
                         dispatch={mockDispatch} />);
}

test('render a graph that triggers a select action when clicked', () => {
    const { container } = renderChart();
    const graph = container.children[0].children[1];
    expect(graph.classList.contains('selected')).toBe(false);
    const selectChartAction = actions.selectChart(id);
    fireEvent(graph, new MouseEvent('click', {bubbles: true, cancelable: true}));
    expect(mockDispatch).toHaveBeenCalledWith(selectChartAction);
    
});