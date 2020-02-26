import React, { useEffect, RefObject } from 'react';
import ApexCharts from 'apexcharts';
import './style/Chart.css';
import { Action } from '../redux/actions';
import StockDetails from './StockDetails';
import { Chart as ChartType, Tracker } from '../redux/store/types';
import * as actions from '../redux/actions';
import { capitalize } from '../utility';
import Selector from './Selector';
import Row from './Row';

type ChartProp = {
    testMode?: boolean,
    data: ChartType,
    tracker: Tracker,
    dispatch: (action: Action) => void
}

const Chart = (prop: ChartProp) => {
    /* istanbul ignore next */
    const cleanUp = (container: HTMLDivElement) => {
        for (let i = 0; i < container.childNodes.length; i++) {
            container.removeChild(container.childNodes[i]);
        }
    }
    const content_ = (section: string) => {
        const data: [string, string][] = [];
        if (!(prop.data.company[section.toString()] instanceof Array)) {
            const entries = Object.entries(prop.data.company[section.toString()]);
            if (entries.length === 0) {
                return <div className="row no-gutters justify-content-center text-muted empty-label mt-5">
                            {prop.data.status}
                        </div>
            }
            for (let [key, value] of entries) {
                data.push([capitalize(formatMetricDataLabels(key)), value]);
            }
            return data.map((entry, index) => 
                        <div key={index} className="row no-gutters">
                            <span className="text-muted">
                                {entry[0]}:
                            </span>&nbsp;&nbsp;
                            <span className="text-bold">{entry[1] || '---'}</span>
                        </div>);
        } else {
            const data_: [string, string][][] = [];
            const items = Object.values(prop.data.company[section.toString()])
            if (items.length === 0) {
                return  <div className="row no-gutters justify-content-center text-muted empty-label mt-5">
                            {prop.data.status}
                        </div>
            }
            for (const item of Object.values(
                prop.data.company[section.toString()])) {
                    const item_: [string, string][] = [];
                    for (let [key, value] of Object.entries(item)) {
                        item_.push([capitalize(formatMetricDataLabels(key)), 
                            value as string]);
                    }
                    data_.push(item_);
            }
            return data_.map((executive, index) => 
                        <div key={index} className="mb-4">
                            <div className="text-muted">#{index + 1}</div>
                            {executive.map((entry, index) => 
                                <div key={index} className="row no-gutters">
                                    <span className="text-muted">
                                        {entry[0]}:
                                    </span>&nbsp;&nbsp;
                                <span className="text-bold">{entry[1] || '---'}</span>
                            </div>)}
                        </div>);
        }
    }
    /* istanbul ignore next */
    const formatMetricDataLabels = (label: string) => {
        let label_ = label.replace(/s&p500/gi, ' S&P 500 ');
        label_ = label_.replace(/13week/gi, ' 13 Week ');
        label_ = label_.replace(/26week/gi, ' 26 Week ');
        label_ = label_.replace(/52week/gi, ' 52 Week ');
        label_ = label_.replace(/3month/gi, ' 3 Month ');
        label_ = label_.replace(/5day/gi, ' 5 Day ');
        label_ = label_.replace(/10day/gi, ' 10 Day ');
        label_ = label_.replace(/ttm/gi, ' TTM ');
        return label_.replace(/\s{2,}/, ' ').trim();
    }
    const content = () => {
        for (const section of prop.data.company.sections) {
            if (section.selected) {
                return content_(section.data!.toString());
            }
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
        <section className="row col-12 no-gutters pl-4 chart align-items-start">
            <div className="row justify-content-between 
                align-items-center no-gutters col-12">
                <StockDetails data={prop.data.stock} 
                              tracker={prop.tracker}
                              dispatch={prop.dispatch} />
            </div>
            <div ref={chartBox} className="col-9 graph border rounded"></div>
            <div className="company-info col-3 border-left">
                <div className="row no-gutters">
                    <Row classes='col-12 py-2 px-4 shadow' 
                         style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                        <Selector title='Section:' 
                                options={prop.data.company.sections} 
                                selected={prop.data.company.sections.find(
                                    section => section.selected)!.name} 
                                handleSelect={value => prop.dispatch(
                                    actions.setActiveCompanySection(value))} />
                    </Row>
                </div>
                <div className="content px-4 no-gutters py-3">
                    {content()}
                </div>
            </div>
        </section>
    );
};

export default Chart;