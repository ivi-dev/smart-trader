import React, { useEffect, RefObject } from 'react';
import ChartData from '../ChartData';
import { createChart } from 'lightweight-charts';
import IndexData from '../IndexData';
import { Option } from '../redux/store';
import { ChartType } from '../redux/store';
import './Chart.css';
import Selector from './Selector';
import ButtonGroup from './ButtonGroup';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import Button from './Button';

interface ChartProp {
    id: number,
    type: ChartType,
    width: number,
    options: any,
    data: ChartData,
    dataSources: Option[],
    year: number,
    resolutionOptions: Option[],
    chartResolution: string,
    activeIndex: IndexData | null,
    chartTypes: Option[],
    chartType: string,
    dispatch: (action: Action) => void
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
    return <section className={`row col-${prop.width} no-gutters px-4 pt-3 chart align-items-start`}>
                <div className="row justify-content-between align-items-center no-gutters col-12">
                    <Selector title={'Data Source:'} options={prop.dataSources} sortOrder={'desc'} selected={prop.year} handleSelect={(year) => prop.dispatch(actions.setChartYear(year, prop.id))} />
                    <Button graphic={'fas fa-plus'} classes={'ml-3'} onClick={() => prop.dispatch(actions.addChart(prop.id))} />
                    <Selector title={'Chart type:'} options={prop.chartTypes} selected={prop.type} classes={'ml-auto'} handleSelect={(type) => prop.dispatch(actions.setChartType(type, prop.id))} />
                    <ButtonGroup options={prop.resolutionOptions} active={prop.chartResolution} handleSelect={(resolution) => prop.dispatch(actions.setChartResolution(resolution, prop.id, prop.year))} classes={'ml-2'} />
                </div>
                <div ref={chartBox} className="row no-gutters col-12 graph mt-2"></div>
            </section>
};

export default Chart;