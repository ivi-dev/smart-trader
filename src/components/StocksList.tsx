import React from 'react';
import StockData from '../StockData';
import Stock from './Stock';
import './StocksList.css';
import Search from './Search';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

type StocksListProp = {
    title?: string,
    status?: string,
    listType: 'symbolsList' | 'watchList',
    data: StockData[],
    dispatch: (action: Action) => void,
    onSearch: (value: string) => void
}

const StocksList = (prop: StocksListProp) => {
    const handleIndicesListClick = (altKey: boolean, data: StockData, listType: string) => {
        if (prop.dispatch) {
            if (listType === 'symbolsList') {
                if (altKey) {
                    prop.dispatch!(actions.addToWatchlist(data));
                } else {
                    prop.dispatch!(actions.selectIndex(data));
                }
            } else {
                if (altKey) {
                    prop.dispatch!(actions.removeFromWatchlist(data));
                } else {
                    prop.dispatch!(actions.selectIndex(data));
                }
            }
        }
    }
    const title = prop.title ? 
    <div className="row no-gutters align-items-center">
    <div className="col-auto pt-3 pb-2 text-muted">
        {prop.title}
    </div>
    <Search classes='ml-auto col-8'
            style={{fontSize: '95%', transform: 'translateY(6px)'}}
            onKeyUp={value => prop.onSearch(value)} />
    </div> : null;
    return (
        <>
            {title}
            <section className="stocks-list align-items-start">
                {prop.data.length === 0 ? 
                <div className="empty-label row justify-content-center 
                    col-auto mt-5 mx-auto text-muted">{prop.status}</div> : 
                prop.data.map(index => 
                <Stock key={index.id} 
                       data={index} 
                       handleClick={(altKey, data) => 
                       {handleIndicesListClick(altKey, data, prop.listType)}} />)}
            </section>
        </>
    )
};
    
export default StocksList;