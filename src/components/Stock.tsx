import React from 'react';
import StockData from '../StockData';
import './Stock.css';

type IndexProp = {
    data: StockData,
    handleClick: (altKey: boolean, 
        data: StockData) => void
}

const Stock = (prop: IndexProp) => {
    return (
    <div className="stock col-12 p-2 pl-3 mb-2 row align-items-center no-gutters rounded"
    onClick={(e) => {prop.handleClick(e.altKey, prop.data);}}>
        <div className="col-auto name font-weight-bold mr-2">{prop.data.name}</div>
        <div className="col-auto company-name">{prop.data.companyName}</div>
    </div>
    );
}

export default Stock;