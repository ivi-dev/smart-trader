import React, { useEffect, RefObject } from 'react';
import ChartData from '../ChartData';
import { createChart } from 'lightweight-charts';
import StockData from '../StockData';
import { Option } from '../redux/store';
import { ChartType } from '../redux/store';
import './Chart.css';
import Selector from './Selector';
import ButtonGroup from './ButtonGroup';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import Button from './Button';
import IndexDetails from './IndexDetails';

type ChartProp = {
    id: number,
    type: ChartType,
    width: number,
    options: any,
    data: ChartData,
    dataSources: Option[],
    year: number | string,
    resolutionOptions: Option[],
    chartResolution: string,
    activeIndex: StockData,
    chartTypes: Option[],
    chartType: string,
    selected: boolean,
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
            height: chartBoxElement.clientHeight}, prop.options));
        window.onresize = () => chart.applyOptions({
            width: chartBoxElement.clientWidth, 
            height: chartBoxElement.clientHeight})
        ChartData.addSeries(chart, prop.data.entries, prop.type, prop.activeIndex?.name);
    });
    const handleResolutionSelect = (resolution: string, chartId: number, source: number | string) =>
        prop.dispatch(actions.setChartResolution(resolution, chartId, source));
    return <section className={`row col-${prop.width} no-gutters px-4 chart align-items-start`}>
                <div className="row justify-content-between align-items-center no-gutters col-12">
                    <Selector title={'Source:'} options={prop.dataSources} sortOrder={'desc'} selected={prop.year} handleSelect={(year) => prop.dispatch(actions.setChartYear(year, prop.id))} />
                    <Button graphic={'fas fa-plus'} classes={'ml-3'} onClick={() => prop.dispatch(actions.addChart(prop.id))} />
                    <Button graphic={'fas fa-trash'} classes={'ml-2 mr-4 danger'} onClick={() => prop.dispatch(actions.removeChart(prop.id))} />
                    <IndexDetails data={prop.activeIndex} />
                    <Selector title={'Type:'} options={prop.chartTypes} selected={prop.type} classes={'ml-auto'} handleSelect={(type) => prop.dispatch(actions.setChartType(type, prop.id))} />
                    <ButtonGroup options={prop.resolutionOptions} active={prop.chartResolution}  classes={`${prop.width === 12 ? 'ml-2' : ''}`} handleSelect={resolution => handleResolutionSelect(resolution.toString(), prop.id, prop.year)} />
                </div>
                <div ref={chartBox} className={`row no-gutters col-12 graph border ${prop.selected ? 'selected' : null} rounded`} onClick={() => prop.dispatch(actions.selectChart(prop.id))}></div>
            </section>
};

export default Chart;