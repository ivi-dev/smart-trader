import React, { useEffect, RefObject } from 'react';
import ChartData from '../ChartData';
import { createChart } from 'lightweight-charts';
import IndexData from '../IndexData';
import { Option } from '../redux/store';
import './Chart.css';
import Selector from './Selector';
import ButtonGroup from './ButtonGroup';

export type ChartType = 'bar' | 'candlestick' | 'line'

interface ChartProp {
    type: ChartType,
    options: any,
    data: ChartData,
    chartDataSources: Option[],
    chartDataSource: number,
    handleDataSourceSelect: (source: string) => void,
    resolutionOptions: Option[],
    chartResolution: string,
    handleResolutionSelect: (resolution: string) => void,
    activeIndex: IndexData | null
}

interface ChartComponent {
    (prop: ChartProp): JSX.Element;
}

const Chart: ChartComponent = (prop: ChartProp) => {
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
            height: chartBoxElement.clientHeight}, prop.options));
        window.onresize = () => chart.applyOptions({
            width: chartBoxElement.clientWidth, 
            height: chartBoxElement.clientHeight})
        ChartData.addSeries(chart, prop.data.entries, prop.type, prop.activeIndex?.name);
    });
    return <section className="row col-6 no-gutters px-4 pt-3 chart align-items-start">
                        <div className="row justify-content-between align-items-center no-gutters col-12">
                            <Selector title={'Data Source:'} options={prop.chartDataSources} sortOrder={'desc'} selected={prop.chartDataSource} handleSelect={(source) => prop.handleDataSourceSelect(source)} />
                            <ButtonGroup options={prop.resolutionOptions} active={prop.chartResolution} handleSelect={(resolution) => prop.handleResolutionSelect(resolution)} />
                        </div>
                        <div ref={chartBox} className="row no-gutters col-12 graph mt-2"></div>
            </section>
};

export default Chart;