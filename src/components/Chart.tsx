import React, { useEffect, RefObject } from 'react';
import ChartData from '../ChartData';
import { createChart } from 'lightweight-charts';
import './Chart.css';
import ButtonGroup from './ButtonGroup';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import StockDetails from './StockDetails';
import { ChartDescriptor } from '../redux/store';

type ChartProp = {
    data: ChartDescriptor,
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
        const chartBoxElement = chartBox.current as HTMLDivElement;
        cleanUp(chartBoxElement);
        const chart = createChart(chartBoxElement, Object.assign({
            width: chartBoxElement.clientWidth, 
            height: chartBoxElement.clientHeight}, prop.data.options));
        window.onresize = () => chart.applyOptions({
            width: chartBoxElement.clientWidth, 
            height: chartBoxElement.clientHeight});
        if (prop.data.data) {
            ChartData.addSeries(chart, prop.data.data.entries, prop.data.stock?.name || '');
        }
    });
    return (
        <section className={`row col-12 no-gutters px-4 chart align-items-start`}>
            <div className="row justify-content-between 
                align-items-center no-gutters col-12">
                <StockDetails data={prop.data.stock} />
            </div>
            <div ref={chartBox} className={`row no-gutters col-12 graph border rounded`}></div>
        </section>
    );
};

export default Chart;