import React, { useEffect, RefObject } from 'react';
import ApexCharts from 'apexcharts';
import './Chart.css';
import { Action } from '../redux/actions';
import StockDetails from './StockDetails';
import { ChartDescriptor } from '../redux/store';

type ChartProp = {
    data: ChartDescriptor,
    tracker: WebSocket | number | null,
    trackerMode: 'live' | 'simulated',
    dispatch: (action: Action) => void
}

const Chart = (prop: ChartProp) => {
    const cleanUp = (container: HTMLDivElement) => {
        for (let i = 0; i < container.childNodes.length; i++) {
            container.removeChild(container.childNodes[i]);
        }
    }
    const chartBox: RefObject<HTMLDivElement> = React.createRef();

    useEffect(() => {
          cleanUp(chartBox.current as HTMLDivElement);
          var chart = new ApexCharts(chartBox.current, prop.data.options);
          chart.render();
    });
    return (
        <section className={`row col-12 no-gutters px-4 chart align-items-start`}>
            <div className="row justify-content-between 
                align-items-center no-gutters col-12">
                <StockDetails data={prop.data.stock} 
                              tracker={prop.tracker}
                              trackerMode={prop.trackerMode}
                              dispatch={prop.dispatch} />
            </div>
            <div ref={chartBox} className={`row no-gutters col-12 graph border rounded`}></div>
        </section>
    );
};

export default Chart;