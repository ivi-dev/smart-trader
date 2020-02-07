import React, { useEffect, RefObject } from 'react';
import ChartData from '../ChartData';
import { createChart } from 'lightweight-charts';
import IndexData from '../IndexData';
import './Chart.css';

export type ChartType = 'bar' | 'candlestick' | 'line'

interface ChartProp {
    type: ChartType,
    options: any,
    data: ChartData,
    activeIndex: IndexData | null
}

interface ChartComponent {
    (prop: ChartProp): JSX.Element;
}

const Chart: ChartComponent = (prop: ChartProp) => {
    const cleanUp = (container: HTMLElement) => {
        for (let i = 0; i < container.childNodes.length; i++) {
            container.removeChild(container.childNodes[i]);
        }
    }
    const chartBox: RefObject<HTMLElement> = React.createRef();
    useEffect(() => {
        const chartBoxElement = chartBox.current as HTMLElement;
        cleanUp(chartBoxElement);
        const chart = createChart(chartBoxElement, prop.options);
        window.onresize = () => chart.applyOptions({width: chartBoxElement.clientWidth * 0.96, 
            height: chartBoxElement.clientHeight})
        ChartData.addSeries(chart, prop.data.entries, prop.type, prop.activeIndex?.name);
    });
    return <section className="row col-12 no-gutters px-4 pt-3 chart" 
                    ref={chartBox}></section>
};

export default Chart;