import React, { useEffect, RefObject } from 'react';
import ChartDataEntry from '../ChartDataEntry';
import { createChart } from 'lightweight-charts';
import IndexData from '../IndexData';
import './Chart.css';
import { convertChartData } from '../utility';

export type ChartType = 'bar' | 'candlestick' | 'line'

interface ChartProp {
    type: ChartType,
    data: ChartDataEntry[],
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
        const chart = createChart(chartBoxElement, { 
            width: chartBoxElement.clientWidth * 0.96, 
            height: chartBoxElement.clientHeight,
            priceScale: {
                borderVisible: false
            },
            layout: {
                backgroundColor: 'transparent',
                textColor: 'rgba(255, 255, 255, 0.2)',
                fontSize: 14
            },
            grid: {
                vertLines: {
                    color: 'rgba(255, 255, 255, 0.2)'
                },
                horzLines: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            timeScale: {
                fixLeftEdge: true
            }
        });
        window.onresize = () => chart.applyOptions({width: chartBoxElement.clientWidth * 0.96, 
            height: chartBoxElement.clientHeight})
        switch (prop.type) {
            case 'bar': 
                chart.addBarSeries({
                    title: prop.activeIndex?.name.toUpperCase() || '',
                    thinBars: false
                }).setData(prop.data);
            break;
            case 'line': 
                chart.addLineSeries({
                    title: prop.activeIndex?.name.toUpperCase() || '',
                    lineWidth: 1,
                    color: '#0099ff'
                }).setData(convertChartData(prop.data, 'line'));
            break;
            default:
                chart.addCandlestickSeries({
                    title: prop.activeIndex?.name.toUpperCase() || ''
                }).setData(prop.data);
        }
    });
    return <section className="row col-12 no-gutters px-4 pt-3 chart" 
                    ref={chartBox}></section>
};

export default Chart;