import React from 'react';
import './StockDetails.css';
import StockData from '../StockData';
import Button from './Button';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

type StockDetailsProp = {
    data: StockData | null,
    tracker: WebSocket | number | null,
    trackerMode: 'live' | 'simulated',
    dispatch?: (action: Action) => void
}

const StockDetails = (prop: StockDetailsProp) => {
    let current = 0, open = 0, 
    high = 0, low = 0, trendValue = 0, trendPercentage = 0;
    if (prop.data) {
        current = prop.data.current;
        open = prop.data.open;
        high = prop.data.high;
        low = prop.data.low;
        trendValue = Number(Math.abs(prop.data.trend).toFixed(2));
        trendPercentage = Number(Math.abs(trendValue / current * 100).toFixed(2));
    }
    const handleClick = (altKey: boolean) => {
        if (prop.dispatch) {
            if (!altKey) {
                prop.dispatch(actions.toggleTracker());
            } else {
                prop.dispatch(actions.setTrackerMode(prop.trackerMode ===
                     'simulated' ? false : true));
            }
        }
    }
    const title = () => {
        return (prop.trackerMode === 'simulated' ?
            'Simulation' : 'Live');
    }
    return (
        <div className="col-auto row no-gutters stock-details align-items-center">
            <div className="name mr-3 my-2">{prop.data?.name || '---'}</div>
            <div className="company-name mr-3 my-2 text-muted">{prop.data?.companyName || '---'}</div>
            <div className="current mr-4 my-2">{current}</div>
            <div className="stat mr-1 border-right">
                <div className="col-12 title text-muted text-center">OPEN</div>
                <div className="no-gutters col-12 text-center value">{open}</div>
            </div>
            <div className="stat mr-1 border-right">
                <div className="col-12 title text-muted text-center">HIGH</div>
                <div className="no-gutters col-12 text-center value">{high}</div>
            </div>
            <div className="stat mr-1 border-right">
                <div className="col-12 title text-muted text-center">LOW</div>
                <div className="no-gutters col-12 text-center value">{low}</div>
            </div>
            <div className="stat mr-4">
                <div className="col-12 title text-muted text-center">TREND</div>
                <div className={`no-gutters col-12 text-center value 
                ${trendValue > 0 ? 'negative' : 'positive'}`}>{`${trendValue > 0 ? '-' : ''}${trendValue} (${trendPercentage}%)`}</div>
            </div>
            {prop.data && <Button title={title()} 
                                  classes={prop.trackerMode}
                                  onClick={e => handleClick(e.altKey)} />}
        </div>
    )
}

export default StockDetails;