import React from 'react';
import StockModel from '../models/Stock';
import './style/Stock.css';

type IndexProp = {
    data: StockModel,
    handleClick: (altKey: boolean, 
        data: StockModel) => void
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