import React from 'react';
import './StockDetails.css';
import StockData from '../StockData';
import Button from './Button';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

type IndexDetailsProp = {
    data: StockData | null,
    tracker: WebSocket | number | null,
    trackerMode: 'live' | 'simulated',
    dispatch?: (action: Action) => void
}

const StockDetails = (prop: IndexDetailsProp) => {
    let color = 'positive';
    if (prop.data) {
        if (prop.data!.open > prop.data!.current) {
            color = 'negative';
        }
    }
    const handleClick = (altKey: boolean) => {
        if (prop.dispatch) {
            if (!altKey) {
                prop.dispatch(actions.toggleStopTracker());
            } else {
                prop.dispatch(actions.setTrackerMode(prop.trackerMode === 'simulated' ? false : true));
            }
        }
    }
    const title = () => {
        return !prop.tracker ? 'Resume' : (prop.trackerMode === 'simulated' ? 'Simulation' : 'Live');
    }
    return (
        <div className="col-4 row no-gutters index-details align-items-center">
            <div className="name mr-3 my-2">{prop.data?.name || '---'}</div>
            <div className="mr-3 my-2 text-muted">{prop.data?.companyName || '---'}</div>
            <div className={`pr-3 text-center ${color}`}>
                {`${prop.data?.trend || '---'}%`}
            </div>
            {prop.data && <Button title={title()} 
                                  classes={prop.trackerMode}
                                  onClick={e => handleClick(e.altKey)} />}
        </div>
    )
}

export default StockDetails;