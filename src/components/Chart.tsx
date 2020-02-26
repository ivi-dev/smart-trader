import React, { useEffect, RefObject } from 'react';
import ApexCharts from 'apexcharts';
import './style/Chart.css';
import { Action } from '../redux/actions';
import StockDetails from './StockDetails';
import { Chart as ChartType, Tracker } from '../redux/store/types';

type ChartProp = {
    data: ChartType,
    tracker: Tracker,
    testMode?: boolean,
    dispatch: (action: Action) => void
}

const Chart = (prop: ChartProp) => {
    /* istanbul ignore next */
    const cleanUp = (container: HTMLDivElement) => {
        for (let i = 0; i < container.childNodes.length; i++) {
            container.removeChild(container.childNodes[i]);
        }
    }
    const chartBox: RefObject<HTMLDivElement> = React.createRef();

    /* istanbul ignore next */
    useEffect(() => {
        if (!prop.testMode) {
            cleanUp(chartBox.current as HTMLDivElement);
            var chart = new ApexCharts(chartBox.current, prop.data.options);
            chart.render();
        }
    });
    return (
        <section className="row col-9 no-gutters pl-4 chart align-items-start">
            <div className="row justify-content-between 
                align-items-center no-gutters col-12">
                <StockDetails data={prop.data.stock} 
                              tracker={prop.tracker}
                              dispatch={prop.dispatch} />
            </div>
            <div ref={chartBox} className="col-12 graph"></div>
        </section>
    );
};

export default Chart;