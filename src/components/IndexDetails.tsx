import React from 'react';
import './IndexDetails.css';
import StockData from '../StockData';

type IndexDetailsProp = {
    data: StockData | null
}

const IndexDetails = (prop: IndexDetailsProp) =>
    <div className="col-4 row no-gutters index-details align-items-center">
        <div className="name mr-3 my-2">{prop.data?.name || '---'}</div>
        <div className="mr-3 my-2 text-muted">{prop.data?.companyName}</div>
        <div className={`pr-3 text-center ${prop.data!.open <= prop.data!.current ? 'positive' : 'negative'}`}>
             {prop.data?.trend}%
        </div>
    </div>

export default IndexDetails;