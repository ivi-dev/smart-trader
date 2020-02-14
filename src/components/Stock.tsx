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
    <div className="index col-12 p-2 pl-3 mb-2 row align-items-center no-gutters rounded"
    onClick={(e) => {prop.handleClick(e.altKey, prop.data);}}>
        <div className="col-auto name font-weight-bold mr-2">{prop.data.name}</div>
        <div className="col-auto company-name">{prop.data.companyName}</div>
        {/* <div className="col current">{prop.data.current}</div>
        <div className={`col-5 trend text-right ${prop.data.trend > 0 ? 'negative' : 'positive'}`}>
            {prop.data.trend > 0 && '-'}{Math.abs(prop.data.trend)} 
            &nbsp;({Math.abs(Number((prop.data.trend / prop.data.open * 100).toFixed(2)))}%)
        </div> */}
    </div>
    );
}

export default Stock;