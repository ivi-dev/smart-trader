import React from 'react';
import './style/StockDetails.css';
import Stock from '../models/Stock';
import Button from './Button';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';
import { Tracker } from '../redux/store/types';

type StockDetailsProp = {
    data: Stock | null,
    tracker: Tracker,
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
            /* istanbul ignore next */
            if (!altKey) {
                prop.dispatch(actions.toggleTracker());
            } 
            /* istanbul ignore next */
            else {
                prop.dispatch(actions.toggleTrackerMode());
            }
        }
    }
    const title = () => {
        return !prop.tracker.object ? 'Paused' : (prop.tracker.mode === 'simulated' ?
            'Simulation' : 'Live');
    }
    return (
        <div className="col-auto row no-gutters stock-details align-items-center">
            <div className="name mr-3 my-2">{prop.data?.name || '---'}</div>
            <div className="company-name mr-3 my-2 text-muted">{prop.data?.companyName || '---'}</div>
            <div className="current mr-4 my-2">{current.toFixed(3)}</div>
            <div className="stat mr-1 border-right">
                <div className="col-12 title text-muted text-center">OPEN</div>
                <div className="no-gutters col-12 text-center value">{open.toFixed(3)}</div>
            </div>
            <div className="stat mr-1 border-right">
                <div className="col-12 title text-muted text-center">HIGH</div>
                <div className="no-gutters col-12 text-center value">{high.toFixed(3)}</div>
            </div>
            <div className="stat mr-1 border-right">
                <div className="col-12 title text-muted text-center">LOW</div>
                <div className="no-gutters col-12 text-center value">{low.toFixed(3)}</div>
            </div>
            <div className="stat mr-4">
                <div className="col-12 title text-muted text-center">TREND</div>
                <div className={`no-gutters col-12 text-center value 
                ${trendValue > 0 ? 'negative' : 'positive'}`}>{`${trendValue > 0 ? '-' : ''}${trendValue.toFixed(3)} (${trendPercentage.toFixed(3)}%)`}</div>
            </div>
            {prop.data && <Button title={title()} 
                                  classes={prop.tracker.mode}
                                  onClick={e => handleClick(e.altKey)} />}
        </div>
    )
}

export default StockDetails;