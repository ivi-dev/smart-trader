import React from 'react';
import StockModel from '../models/Stock';
import Stock from './Stock';
import './StocksList.css';
import Search from './Search';
import { Action } from '../redux/actions';
import * as actions from '../redux/actions';

type StocksListProp = {
    title?: string,
    status?: string,
    listType: 'symbolsList' | 'watchList',
    data: StockModel[],
    dispatch: (action: Action) => void,
    onSearch: (value: string) => void
}

const StocksList = (prop: StocksListProp) => {
    const handleStockListClick = (altKey: boolean, 
                                  data: StockModel) => {
        if (prop.listType === 'symbolsList') {
            /* istanbul ignore next */
            if (altKey) {
                prop.dispatch!(actions.addToWatchlist(data));
            } else {
                prop.dispatch!(actions.selectStock(data));
            }
        } else {
            /* istanbul ignore next */
            if (altKey) {
                prop.dispatch!(actions.removeFromWatchlist(data));
            } else {
                prop.dispatch!(actions.selectStock(data));
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
    </div> : <Search classes='ml-auto col-8'
                style={{fontSize: '95%', transform: 'translateY(6px)'}}
                onKeyUp={value => prop.onSearch(value)} />;
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
                       {handleStockListClick(altKey, data)}} />)}
            </section>
        </>
    )
};
    
export default StocksList;