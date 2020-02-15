import React, { useEffect, RefObject } from 'react';
import ApexCharts from 'apexcharts';
import './Chart.css';
import { Action } from '../redux/actions';
import StockDetails from './StockDetails';
import { ChartDescriptor } from '../redux/store';
import * as actions from '../redux/actions';

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
    const companyProfile = () => {
        const data: [string, string][] = [];
        for (let [key, value] of Object.entries(prop.data.company.profile)) {
            data.push([key, value]);
        }
        return data;
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
            <div ref={chartBox} className="col-9 graph border rounded"></div>

            <div className="company-info col-3 px-4 border-left">
                <div className="row no-gutters">
                    {prop.data.company.sections.map((section, index) => 
                        <a key={index} href="/" className={`tab col-auto px-2 mb-2 mr-2 test-reset text-decoration-none rounded ${section.selected ? 'active' : null}`} 
                        onClick={e => {e.preventDefault(); prop.dispatch(actions.setActiveCompanySection(section.name.toString()))}}>
                            {section.name}
                        </a>
                    )}
                </div>
                
                <div className="content no-gutters py-3">
                    {companyProfile().map(entry => 
                    <div className="row no-gutters"><span className="text-muted">{entry[0]}:</span>&nbsp;&nbsp;
                    <span className="text-bold">{entry[1]}</span></div>)}
                </div>
            </div>
        </section>
    );
};

export default Chart;