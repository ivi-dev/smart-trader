import React from 'react';
import './style/CompanyInfo.css';
import { Company } from '../redux/store/types';
import Row from './Row';
import Selector from './Selector';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import { capitalize } from '../utility';

type CompanyInfoProp = {
    company: Company,
    status?: string,
    dispatch: (action: Action) => void
}

export const CompanyInfo = (prop: CompanyInfoProp) => {
    const content_ = (section: string) => {
        const data: [string, string][] = [];
        if (!(prop.company[section.toString()] instanceof Array)) {
            const entries = Object.entries(prop.company[section.toString()]);
            if (entries.length === 0) {
                return <div className="row no-gutters justify-content-center text-muted empty-label mt-5">
                            {prop.status}
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
            const items = Object.values(prop.company[section.toString()])
            if (items.length === 0) {
                return  <div className="row no-gutters justify-content-center text-muted empty-label mt-5">
                            {prop.status}
                        </div>
            }
            for (const item of Object.values(
                prop.company[section.toString()])) {
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
        for (const section of prop.company.sections) {
            if (section.selected) {
                return content_(section.data!.toString());
            }
        }
    }
    return (
        <div className="company-info col-3 border-left">
            <div className="row no-gutters">
                <Row classes='col-12 py-2 px-4 shadow' 
                     style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <Selector title='Section:' 
                              options={prop.company.sections} 
                              selected={prop.company.sections.find(
                                  section => section.selected)!.name} 
                              handleSelect={value => prop.dispatch(
                                  actions.setActiveCompanySection(value))} />
                </Row>
            </div>
            <div className="content px-4 no-gutters py-3">
                {content()}
            </div>
        </div>
    );
}